export default function TransliterationBox({ input, setInput, output, loading, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-md space-y-4">
      <p className="text-center font-semibold text-gray-500">Single word tranliteration is good, you can also try with multiple words.</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter romanized Hindi (e.g., 'pyaar')"
        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition"
      >
        {loading ? "Transliterating..." : "Transliterate"}
      </button>

      {output && (
        <div className="mt-4 text-center text-2xl font-bold text-gray-700">
          → {output}
        </div>
      )}
    </form>
  );
}
