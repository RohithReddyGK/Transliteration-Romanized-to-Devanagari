import { useState, useEffect } from "react";
import TransliterationBox from "./components/TransliterationBox";
import ModelExplanation from "./components/ModelExplanation";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000"

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);

  // Fetch model info once on page load
  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const res = await fetch(`${BASE_URL}/model_info`);
        const data = await res.json();
        console.log("Fetched model info:", data);
        setModelInfo(data);
      } catch (error) {
        console.error("Error fetching model info:", error);
      }
    };
    fetchModelInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/transliterate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: input }),
      });
      const data = await res.json();
      setOutput(data.output);
    } catch {
      setOutput("Error connecting to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 via-pink-100 to-orange-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🪶 Hindi Transliteration (Roman → Devanagari)
      </h1>

      {/* Transliteration Box */}
      <TransliterationBox
        input={input}
        setInput={setInput}
        output={output}
        loading={loading}
        handleSubmit={handleSubmit}
      />

      {/* Detailed Explanation Section */}
      <div className="w-full mt-10">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          🤖 Model Explanation
        </h2>

        <ModelExplanation model_info={modelInfo} />

        {/* Run in Google Colab button */}
        <div className="text-center mt-8 mb-10">
          <a
            href="https://colab.research.google.com/drive/173Kr_hgq_2EKPMNdzHlgPZkPyZ-LfaOf?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            🚀 Run in Google Colab
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
