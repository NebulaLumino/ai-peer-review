"use client";

import { useState } from "react";

const ACCENT: [number, number, number] = [90, 70, 50];
const accentStyle = { color: `hsl(${ACCENT[0]}, ${ACCENT[1]}%, ${ACCENT[2]}%)` };
const accentBg = { backgroundColor: `hsl(${ACCENT[0]}, ${ACCENT[1]}%, ${ACCENT[2]}%)` };
const accentRing = { "--tw-ring-color": `hsl(${ACCENT[0]}, ${ACCENT[1]}%, ${ACCENT[2]}%)` } as React.CSSProperties;

export default function PeerReviewPage() {
  const [manuscript, setManuscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manuscript }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={accentBg}>
            <svg className="w-8 h-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-3">Peer Review Simulator</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Paste your manuscript abstract or full text to receive a constructive peer review covering novelty, methodology, clarity, and limitations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mb-10">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="manuscript">
              Manuscript Text <span style={accentStyle}>*</span>
            </label>
            <textarea
              id="manuscript"
              value={manuscript}
              onChange={(e) => setManuscript(e.target.value)}
              placeholder="Paste the abstract or full text of the manuscript you want reviewed..."
              required
              rows={14}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-60 transition-all resize-none font-mono text-sm"
              style={accentRing}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-gray-900 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 active:brightness-95"
            style={accentBg}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Conducting Peer Review...
              </span>
            ) : (
              "Conduct Peer Review"
            )}
          </button>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-300 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={accentBg} />
              <span className="text-sm font-medium text-gray-300">Peer Review Report</span>
            </div>
            <div className="p-6">
              <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">{result}</div>
            </div>
          </div>
        )}

        <p className="text-center text-gray-600 text-xs mt-10">
          AI-generated review for practice and feedback only. Not a substitute for genuine peer review.
        </p>
      </div>
    </div>
  );
}
