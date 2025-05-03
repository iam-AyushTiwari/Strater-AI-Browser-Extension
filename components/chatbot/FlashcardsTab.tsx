import { message } from "antd"
import { BookmarkPlus, Flashlight } from "lucide-react"
import { useState } from "react"
import Markdown from "utils/markdown"

const FlashcardsTab = ({
  handleSend,
  saveToNotes,
  flashcardsData,
  flashcardsLoading
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

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
    <div className="flex flex-col items-center justify-center space-y-4 my-6">
      {flashcardsLoading ? (
        <div className="w-full p-6 bg-gradient-to-r from-[#1a0010] to-[#29060f] rounded-2xl border border-[#FF0042]/20 shadow-lg flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF0042] mb-4"></div>
          <p className="text-neutral-300">Generating flashcards...</p>
        </div>
      ) : flashcardsData && flashcardsData.length > 0 ? (
        <div className="w-full">
          {/* Flashcard Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-300">
              Card {currentCardIndex + 1} of {flashcardsData.length}
            </span>
            <button
              onClick={saveFlashcardsToNotes}
              className="px-3 py-1 bg-[#FF0042]/80 hover:bg-[#FF0042] rounded-lg text-sm flex items-center gap-1">
              <BookmarkPlus size={14} />
              Save All
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-neutral-800 rounded-full mb-6">
            <div
              className="h-full bg-[#FF0042] rounded-full"
              style={{
                width: `${((currentCardIndex + 1) / flashcardsData.length) * 100}%`
              }}></div>
          </div>

          {/* Flashcard */}
          <div
            className="relative w-full aspect-[3/2] perspective-1000 mb-6 cursor-pointer"
            onClick={toggleFlip}>
            <div
              className={`absolute w-full h-full transition-all duration-500 transform-style-preserve-3d ${
                flipped ? "rotate-y-180" : ""
              }`}>
              {/* Front of Card */}
              <div className="absolute w-full h-full backface-hidden bg-neutral-800 rounded-xl p-6 border border-neutral-700 flex flex-col items-center justify-center">
                <h3 className="text-xl font-medium mb-4 text-center">
                  {flashcardsData[currentCardIndex]?.front ||
                    "No question available"}
                </h3>
                <p className="text-neutral-400 text-sm">Click to flip</p>
              </div>

              {/* Back of Card */}
              <div className="absolute w-full h-full backface-hidden bg-[#29060f] rounded-xl p-6 border border-[#FF0042]/50 flex flex-col items-center justify-center rotate-y-180">
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

          {/* Navigation Buttons */}
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
        </div>
      ) : (
        <div className="w-full p-6 bg-gradient-to-r from-[#1a0010] to-[#29060f] rounded-2xl border border-[#FF0042]/20 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#FF0042] p-2 rounded-full">
              <Flashlight size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FF0042]">
              Flashcards
            </h1>
          </div>
          <p className="text-lg text-neutral-300 leading-relaxed mb-6">
            Create flashcards to help you memorize important concepts from the
            video.
          </p>

          <button
            className="w-full flex items-center justify-center gap-3 p-4 bg-neutral-800/80 hover:bg-[#FF0042]/20 rounded-xl transition-all duration-300 border border-neutral-700 hover:border-[#FF0042]/50 group"
            onClick={() => handleSend("flashcard_gen")}>
            <div className="p-2 bg-neutral-700 group-hover:bg-[#FF0042]/30 rounded-lg transition-colors">
              <Flashlight size={20} className="text-white" />
            </div>
            <span className="font-medium">Generate Flashcards</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default FlashcardsTab
