"use client"

import { message } from "antd"
import { BookmarkPlus, Flashlight, Save } from "lucide-react"
import { useEffect, useState } from "react"
import Markdown from "utils/markdown"

const FlashcardsTab = ({
  handleSend,
  saveToNotes,
  flashcardsData,
  flashcardsLoading,
  saved,
  onSave
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const handleNextCard = () => {
    if (currentCardIndex < flashcardsData.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setFlipped(false)
    }
  }

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setFlipped(false)
    }
  }

  const toggleFlip = () => {
    setFlipped(!flipped)
  }

  const saveFlashcardsToNotes = () => {
    let flashcardsText = "# Flashcards\n\n"
    flashcardsData.forEach((card, index) => {
      flashcardsText += `## Card ${index + 1}\n\n`
      flashcardsText += `**Question:** ${card.front}\n\n`
      flashcardsText += `**Answer:** ${card.back}\n\n`
    })

    saveToNotes(flashcardsText, 0)
    message.success("Flashcards saved to notes!")
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto my-6">
      {flashcardsLoading ? (
        <div className="w-full p-6 bg-[#121212] rounded-2xl border border-neutral-800 shadow-lg">
          <div className="w-full flex flex-col items-center justify-center py-10 transition-opacity duration-300">
            <div className="relative w-16 h-16 mb-5">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FF0042]/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[#FF0042] rounded-full animate-spin"></div>
            </div>
            <p className="text-neutral-300 font-medium text-xl">
              We're generating flashcards for you...
            </p>
          </div>
        </div>
      ) : flashcardsData && flashcardsData.length > 0 ? (
        <div
          className="w-full transition-all duration-300"
          style={{
            transitionProperty: "opacity",
            transitionDuration: "0.3s"
          }}>
          <div className="p-6 bg-[#121212] rounded-2xl border border-neutral-800 w-full shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-neutral-300">
                Card {currentCardIndex + 1} of {flashcardsData.length}
              </span>
              <div className="flex gap-2">
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
            </div>

            <div className="w-full h-2 bg-neutral-800 rounded-full mb-6">
              <div
                className="h-full bg-[#FF0042] rounded-full"
                style={{
                  width: `${((currentCardIndex + 1) / flashcardsData.length) * 100}%`
                }}></div>
            </div>

            <div
              className="relative w-full aspect-[3/2] mb-6 cursor-pointer"
              style={{ perspective: "1000px" }}
              onClick={toggleFlip}>
              <div
                className={`absolute w-full h-full transition-all duration-500 ${
                  flipped ? "rotate-180" : ""
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)"
                }}>
                <div
                  className="absolute w-full h-full bg-neutral-800 rounded-xl p-6 border border-neutral-700 flex flex-col items-center justify-center"
                  style={{ backfaceVisibility: "hidden" }}>
                  <div className="text-2xl mb-4 font-medium text-white">
                    <Markdown
                      markdown={
                        flashcardsData[currentCardIndex]?.front ||
                        "Unknown Question..."
                      }
                      className="text-white text-center"
                    />
                  </div>
                  <p className="text-neutral-400 text-sm">Click to flip</p>
                </div>

                <div
                  className="absolute w-full h-full bg-[#29060f] rounded-xl p-6 border border-[#FF0042]/50 flex flex-col items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}>
                  <div className="overflow-y-auto max-h-full">
                    <Markdown
                      markdown={
                        flashcardsData[currentCardIndex]?.back ||
                        "No answer available"
                      }
                      className="text-white text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePrevCard}
                disabled={currentCardIndex === 0}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>

              <button
                onClick={handleNextCard}
                disabled={currentCardIndex === flashcardsData.length - 1}
                className="px-4 py-2 bg-[#FF0042] hover:bg-[#e6003b] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={saveFlashcardsToNotes}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF0042] to-[#FF0066] rounded-lg text-white font-medium shadow-lg hover:shadow-[0_0_15px_rgba(255,0,66,0.4)] transition-all duration-300 hover:scale-105 active:scale-95">
                <BookmarkPlus size={16} />
                <span>Save to Notes</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="w-full p-6 bg-[#121212] rounded-2xl border border-neutral-800 shadow-lg"
          style={{
            transitionProperty: "opacity",
            transitionDuration: "0.3s"
          }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-gradient-to-br from-[#FF0042] to-[#FF0066] p-2.5 rounded-xl shadow-lg">
              <Flashlight size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FF0042]">
              Flashcards
            </h1>
          </div>

          <p className="text-base text-neutral-300 leading-relaxed mb-7">
            Create flashcards to help you memorize important concepts from the
            video.
          </p>

          <button
            className="w-full flex items-center justify-center gap-3 p-4 bg-[#1A1A1A] rounded-xl transition-all duration-300 border border-neutral-800 hover:border-[#FF0042]/40 hover:scale-[1.01] active:scale-[0.99] group"
            onClick={() => handleSend("flashcard_gen")}>
            <div className="p-2.5 bg-[#2A2A2A] group-hover:bg-[#FF0042]/20 rounded-lg transition-colors duration-300">
              <Flashlight
                size={18}
                className="text-[#FF0042] group-hover:text-[#FF6699]"
              />
            </div>
            <span className="font-medium text-xl text-neutral-200 group-hover:text-white">
              Generate Flashcards
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

export default FlashcardsTab
