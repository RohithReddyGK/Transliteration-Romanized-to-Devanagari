import torch
import torch.nn as nn

MODEL_PATH = "model/hindi_transliteration_model.pth"

# Model Architecture 
class Encoder(nn.Module):
    def __init__(self, input_dim, emb_dim, hidden, n_layers, cell='LSTM'):
        super().__init__()
        self.embedding = nn.Embedding(input_dim, emb_dim, padding_idx=0)
        if cell == 'LSTM':
            self.rnn = nn.LSTM(emb_dim, hidden, n_layers, batch_first=True)
        elif cell == 'GRU':
            self.rnn = nn.GRU(emb_dim, hidden, n_layers, batch_first=True)
        else:
            self.rnn = nn.RNN(emb_dim, hidden, n_layers, batch_first=True)

    def forward(self, x):
        emb = self.embedding(x)
        outputs, hidden = self.rnn(emb)
        return outputs, hidden


class Decoder(nn.Module):
    def __init__(self, out_dim, emb_dim, hidden, n_layers, cell='LSTM'):
        super().__init__()
        self.embedding = nn.Embedding(out_dim, emb_dim, padding_idx=0)
        if cell == 'LSTM':
            self.rnn = nn.LSTM(emb_dim, hidden, n_layers, batch_first=True)
        elif cell == 'GRU':
            self.rnn = nn.GRU(emb_dim, hidden, n_layers, batch_first=True)
        else:
            self.rnn = nn.RNN(emb_dim, hidden, n_layers, batch_first=True)
        self.fc = nn.Linear(hidden, out_dim)

    def forward(self, input_tok, hidden):
        inp = input_tok.unsqueeze(1)
        emb = self.embedding(inp)
        out, hidden = self.rnn(emb, hidden)
        pred = self.fc(out.squeeze(1))
        return pred, hidden


class Seq2Seq(nn.Module):
    def __init__(self, enc, dec, device):
        super().__init__()
        self.encoder = enc
        self.decoder = dec
        self.device = device


# Helper: Number Formatting
def format_large_number(num):
    """Format large numbers for readability (e.g., 1250000 -> 1.25M)."""
    if num >= 1e6:
        return f"{num/1e6:.2f}M"
    elif num >= 1e3:
        return f"{num/1e3:.2f}K"
    else:
        return str(num)


# Load Model + Compute Info
def compute_info(cfg, src_char2idx, tgt_char2idx, model):
    E = cfg['EMB_DIM']
    H = cfg['HIDDEN']
    L = cfg['MAX_LEN']
    V_src = len(src_char2idx)
    V_tgt = len(tgt_char2idx)
    cell = cfg['RNN_CELL']

    gate_mult = 4 if cell == 'LSTM' else (3 if cell == 'GRU' else 1)

    # Theoretical parameter & MAC computation
    theoretical_params = (V_src + V_tgt) * E + 2 * gate_mult * (E * H + H * H + H) + H * V_tgt + V_tgt
    macs_theoretical = 2 * L * gate_mult * (E * H + H * H)
    macs_simple = L * (H * (E + H))

    # Actual PyTorch parameter count
    torch_params = sum(p.numel() for p in model.parameters())

    return {
        "config": cfg,
        "vocab_src": V_src,
        "vocab_tgt": V_tgt,
        "torch_params": {
            "count": int(torch_params),
            "formatted": format_large_number(torch_params)
        },
        "params_formula": {
            "count": int(theoretical_params),
            "formatted": format_large_number(theoretical_params),
            "formula": "(V_src + V_tgt)×E + 2×g×(E×H + H² + H) + H×V_tgt + V_tgt"
        },
        "macs": {
            "simple": int(macs_simple),
            "theoretical": int(macs_theoretical),
            "formatted": format_large_number(macs_theoretical),
            "formula": "2×L×g×(E×H + H²)"
        },
        "gate_multiplier": gate_mult
    }


def load_model():
    ck = torch.load(MODEL_PATH, map_location='cpu')
    src_char2idx = ck['src_char2idx']
    tgt_char2idx = ck['tgt_char2idx']
    src_idx2char = {i: c for c, i in src_char2idx.items()}
    tgt_idx2char = {i: c for c, i in tgt_char2idx.items()}
    cfg = ck['cfg']

    EMB_DIM = cfg['EMB_DIM']
    HIDDEN = cfg['HIDDEN']
    NUM_LAYERS = cfg['NUM_LAYERS']
    RNN_CELL = cfg['RNN_CELL']
    MAX_LEN = cfg['MAX_LEN']
    DEVICE = torch.device('cpu')

    enc = Encoder(len(src_char2idx), EMB_DIM, HIDDEN, NUM_LAYERS, RNN_CELL).to(DEVICE)
    dec = Decoder(len(tgt_char2idx), EMB_DIM, HIDDEN, NUM_LAYERS, RNN_CELL).to(DEVICE)
    model = Seq2Seq(enc, dec, DEVICE)
    model.load_state_dict(ck['model_state'])
    model.eval()

    info = compute_info(cfg, src_char2idx, tgt_char2idx, model)

    print("Model loaded successfully!")
    return model, src_char2idx, tgt_char2idx, src_idx2char, tgt_idx2char, DEVICE, MAX_LEN, info


# Encoding + Inference
def encode_src_word(word, src_char2idx, MAX_LEN, DEVICE):
    chars = list(word)[:MAX_LEN - 2]
    ids = [src_char2idx.get("<sos>", 1)] + [src_char2idx.get(c, 0) for c in chars] + [src_char2idx.get("<eos>", 2)]
    if len(ids) < MAX_LEN:
        ids += [src_char2idx.get("<pad>", 0)] * (MAX_LEN - len(ids))
    return torch.tensor([ids], dtype=torch.long).to(DEVICE)


def transliterate_word(model, word, src_char2idx, tgt_char2idx, src_idx2char, tgt_idx2char, DEVICE, MAX_LEN):
    src_tensor = encode_src_word(word, src_char2idx, MAX_LEN, DEVICE)
    with torch.no_grad():
        encoder_outputs, hidden = model.encoder(src_tensor)
        input_tok = torch.tensor([tgt_char2idx.get("<sos>", 1)], dtype=torch.long).to(DEVICE)
        out_chars = []
        for _ in range(MAX_LEN):
            pred, hidden = model.decoder(input_tok, hidden)
            top1 = pred.argmax(1).item()
            if top1 == tgt_char2idx.get("<eos>", 2):
                break
            out_chars.append(tgt_idx2char.get(top1, ''))
            input_tok = torch.tensor([top1], dtype=torch.long).to(DEVICE)
    return "".join(out_chars)
