from flask import Flask, request, jsonify
from transliterate import load_model, transliterate_word
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

model, src_char2idx, tgt_char2idx, src_idx2char, tgt_idx2char, DEVICE, MAX_LEN, model_info = load_model()

@app.route('/')
def home():
    return jsonify({"message": "BackEnd Transliteration API is running!"})

@app.route('/transliterate', methods=['POST'])
def transliterate():
    data = request.get_json()
    sentence = data.get('word', '').strip()
    if not sentence:
        return jsonify({'output': ''})

    words = sentence.split()
    results = []
    for w in words:
        try:
            out = transliterate_word(model, w, src_char2idx, tgt_char2idx, src_idx2char, tgt_idx2char, DEVICE, MAX_LEN)
            results.append(out)
        except Exception as e:
            print(f"Error transliterating {w}: {e}")
            results.append(w)

    return jsonify({'output': " ".join(results)})

@app.route('/model_info', methods=['GET'])
def model_metadata():
    return jsonify(model_info)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
