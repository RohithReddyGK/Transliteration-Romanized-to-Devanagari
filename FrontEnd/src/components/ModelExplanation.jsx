import React, { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000"

const ModelExplanation = ({ model_info }) => {
  const [info, setInfo] = useState(model_info || null);

  useEffect(() => {
    if (!info) {
      const fetchInfo = async () => {
        try {
          const res = await fetch(`${BASE_URL}/model_info`);
          const data = await res.json();
          setInfo(data);
        } catch (err) {
          console.error("Error fetching model info:", err);
        }
      };
      fetchInfo();
    }
  }, [info]);

  if (!info) {
    return (
      <div className="text-center text-gray-500 mt-6">
        <p>Loading model information...</p>
      </div>
    );
  }

  // Extract values safely
  const cfg = info.config || {};
  const EMB_DIM = cfg.EMB_DIM || 0;
  const HIDDEN = cfg.HIDDEN || 0;
  const MAX_LEN = cfg.MAX_LEN || 0;
  const NUM_LAYERS = cfg.NUM_LAYERS || 0;
  const RNN_CELL = cfg.RNN_CELL || "LSTM";
  const V_src = info.vocab_src || 0;
  const V_tgt = info.vocab_tgt || 0;

  const param_count = info.torch_params?.count || 0;
  const macs_simple = info.macs?.simple || 0;

  const g = RNN_CELL === "LSTM" ? 4 : RNN_CELL === "GRU" ? 3 : 1;

  const macs_theoretical = 2 * MAX_LEN * g * (EMB_DIM * HIDDEN + HIDDEN ** 2);
  const params_theoretical =
    (V_src + V_tgt) * EMB_DIM +
    2 * g * (EMB_DIM * HIDDEN + HIDDEN ** 2 + HIDDEN) +
    HIDDEN * V_tgt +
    V_tgt;

  const fmt = (n) =>
    typeof n === "number" && !isNaN(n)
      ? n.toLocaleString("en-IN")
      : n?.toString() || "N/A";

  return (
    <div className="flex justify-center px-4 mt-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-8 text-gray-800 space-y-6 text-center">
        <h2 className="text-2xl font-bold text-blue-700">
          🏦 Model Architecture
        </h2>

        <p>
          The model is a <b>Seq2Seq transliteration system</b> with:
        </p>
        <ul className="list-disc list-inside text-left mx-auto max-w-md">
          <li>
            <b>Encoder:</b> Reads Latin characters (e.g., <i>ghar</i>) and
            encodes them into hidden representations.
          </li>
          <li>
            <b>Decoder:</b> Predicts Devanagari output (e.g., <i>घर</i>) one character at a time.
          </li>
          <li>
            <b>RNN Cell:</b> {RNN_CELL} (used in this model).
          </li>
        </ul>

        <p>
          The Encoder converts input Latin text into a dense representation, and
          the Decoder sequentially produces Devanagari characters.
        </p>

        <h3 className="text-xl font-semibold text-blue-700 mt-6">
          ⚙️ Model Configuration
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm max-w-md mx-auto text-left">
          <p>
            <b>Embedding Dim (E):</b> {EMB_DIM}
          </p>
          <p>
            <b>Hidden Units (H):</b> {HIDDEN}
          </p>
          <p>
            <b>Sequence Length (L):</b> {MAX_LEN}
          </p>
          <p>
            <b>Layers:</b> {NUM_LAYERS}
          </p>
          <p>
            <b>Source Vocab (Vₛ):</b> {V_src}
          </p>
          <p>
            <b>Target Vocab (Vₜ):</b> {V_tgt}
          </p>
        </div>

        <h3 className="text-xl font-semibold text-blue-700 mt-6">
          📊 Parameter & Compute Summary
        </h3>
        <div className="space-y-1 text-left mx-auto max-w-md">
          <p>
            <b>Total Trainable Parameters (Actual):</b> {fmt(param_count)}
          </p>
          <p>
            <b>Theoretical Parameters (Formula-Based):</b> ≈{" "}
            {fmt(params_theoretical)}
          </p>
          <p>
            <b>Simple MACs (Approx):</b> {fmt(macs_simple)}
          </p>
          <p>
            <b>Theoretical MACs (Formula-Based):</b> ≈ {fmt(macs_theoretical)}
          </p>
        </div>

        <h3 className="text-xl font-semibold text-blue-700 mt-6">
          🧮 Theoretical Formulas
        </h3>
        <div className="text-left mx-auto max-w-md space-y-2">
          <p>
            <b>1️⃣ Total Computations (MACs):</b>
          </p>
          <p>MACs = 2 × L × g × (E × H + H²)</p>
          <p>
            Substituting → 2 × {MAX_LEN} × {g} × ({EMB_DIM} × {HIDDEN} +{" "}
            {HIDDEN}²)
          </p>
          <p>≈ {fmt(macs_theoretical)} MACs per sequence</p>

          <p className="mt-4">
            <b>2️⃣ Total Trainable Parameters:</b>
          </p>
          <p>Params = (Vₛ + Vₜ)×E + 2×g×(E×H + H² + H) + H×Vₜ + Vₜ</p>
          <p>
            Substituting → ({V_src} + {V_tgt})×{EMB_DIM} + 2×{g}×({EMB_DIM}×
            {HIDDEN} + {HIDDEN}² + {HIDDEN}) + {HIDDEN}×{V_tgt} + {V_tgt}
          </p>
          <p>≈ {fmt(params_theoretical)} parameters</p>
        </div>

        <h3 className="text-xl font-semibold text-blue-700 mt-6">
          📘 Explanation
        </h3>
        <div className="text-left mx-auto max-w-md space-y-1">
          <p>
            These are <b>theoretical estimates</b> assuming a single-layer{" "}
            {RNN_CELL}-based encoder–decoder model.
          </p>
          <p>
            The factor <b>g = {g}</b> accounts for the number of gates per RNN
            cell (LSTM = 4, GRU = 3, Simple RNN = 1).
          </p>
          <p>
            Computation counts include only major matrix multiplications,
            ignoring minor activations and bias additions.
          </p>
          <p>
            Actual parameters (<b>{fmt(param_count)}</b>) may slightly differ due
            to embedding and final projection layers.
          </p>
        </div>

        <h3 className="text-xl font-semibold text-blue-700 mt-6">🧾 Summary</h3>
        <p className="text-center text-gray-700">
          This dynamic analysis helps understand the computational complexity
          and scalability of the transliteration model. Adjusting
          hyperparameters like <b>E</b>, <b>H</b>, or <b>L</b> can optimize both
          performance and efficiency.
        </p>
      </div>
    </div>
  );
};

export default ModelExplanation;
