"use client"

import { BookmarkPlus, Notebook, Save } from "lucide-react"
import { useEffect, useState } from "react"
import Markdown from "utils/markdown"

const SummaryTab = ({
  handleSend,
  saveToNotes,
  setSummaryType,
  summaryType,
  summaryData,
  summaryLoading,
  saved,
  onSave
}) => {
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto my-6">
      {!summaryData ? (
        <div
          className="w-full p-6 bg-[#121212] rounded-2xl border border-neutral-800 shadow-lg"
          style={{
            transitionProperty: "opacity",
            transitionDuration: "0.3s"
          }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-gradient-to-br from-[#FF0042] to-[#FF0066] p-2.5 rounded-xl shadow-lg">
              <Notebook size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FF0042]">
              Video Summary
            </h1>
          </div>

          {/* Summary Type Selector */}
          <div className="mb-7">
            <p className="text-base text-neutral-300 leading-relaxed mb-4">
              Get a comprehensive summary of the current video to quickly
              understand the key points.
            </p>
            <div className="flex gap-3 p-1 bg-[#1A1A1A] rounded-full">
              <button
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                  summaryType === "Concise"
                    ? "bg-neutral-700 text-white shadow-md"
                    : "bg-transparent text-neutral-400 hover:text-white"
                }`}
                onClick={() => setSummaryType("Concise")}>
                Concise
              </button>
              <button
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                  summaryType === "Detailed"
                    ? "bg-neutral-700 text-white shadow-md"
                    : "bg-transparent text-neutral-400 hover:text-white"
                }`}
                onClick={() => setSummaryType("Detailed")}>
                Detailed
              </button>
            </div>
          </div>

          {summaryLoading ? (
            <div className="w-full flex flex-col items-center justify-center py-10 transition-opacity duration-300">
              <div className="relative w-16 h-16 mb-5">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FF0042]/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[#FF0042] rounded-full animate-spin"></div>
              </div>
              <p className="text-neutral-300 font-medium text-xl">
                Generating {summaryType.toLowerCase()} summary...
              </p>
            </div>
          ) : (
            <button
              className="w-full flex items-center justify-center gap-3 p-4 bg-[#1A1A1A] rounded-xl transition-all duration-300 border border-neutral-800 hover:border-[#FF0042]/40 hover:scale-[1.01] active:scale-[0.99] group"
              onClick={() => handleSend("videoSummary_Generate")}>
              <div className="p-2.5 bg-[#2A2A2A] group-hover:bg-[#FF0042]/20 rounded-lg transition-colors duration-300">
                <Notebook
                  size={18}
                  className="text-[#FF0042] group-hover:text-[#FF6699]"
                />
              </div>
              <span className="font-medium text-xl text-neutral-200 group-hover:text-white">
                Generate {summaryType} Summary
              </span>
            </button>
          )}
        </div>
      ) : (
        <div
          className="w-full transition-all duration-300"
          style={{
            transitionProperty: "opacity",
            transitionDuration: "0.3s"
          }}>
          <div className="p-6 bg-[#121212] rounded-2xl border border-neutral-800 w-full shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">Summary</h2>
              {saved ? (
                <div className="flex items-center gap-2 text-green-500">
                  <Save size={16} />
                  <span className="text-sm">Saved to database</span>
                </div>
              ) : (
                <button
                  onClick={onSave}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] text-white rounded-lg border border-neutral-700 transition-colors">
                  <Save size={16} />
                  <span className="text-sm">Save to database</span>
                </button>
              )}
            </div>
            <div className="prose prose-invert max-w-none prose-headings:text-[#FF0042] prose-a:text-[#FF6699] prose-strong:text-neutral-200">
              <Markdown markdown={summaryData} className="text-neutral-300" />
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => saveToNotes(summaryData, 0)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF0042] to-[#FF0066] rounded-lg text-white font-medium shadow-lg hover:shadow-[0_0_15px_rgba(255,0,66,0.4)] transition-all duration-300 hover:scale-105 active:scale-95">
                <BookmarkPlus size={16} />
                <span>Save to Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SummaryTab
