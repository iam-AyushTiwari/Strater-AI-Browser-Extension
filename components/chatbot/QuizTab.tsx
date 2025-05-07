"use client"

import { message } from "antd"
import { BookCheck, BookmarkPlus, Save } from "lucide-react"
import { useEffect, useState } from "react"

const QuizTab = ({
  handleSend,
  saveToNotes,
  quizData,
  quizLoading,
  saved,
  onSave
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    })
  }

  const handleSubmitQuiz = () => {
    setShowResults(true)
  }

  const resetQuiz = () => {
    setSelectedAnswers({})
    setShowResults(false)
    setCurrentQuestionIndex(0)
  }

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const moveToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const saveQuizToNotes = () => {
    let quizText = "# Quiz Results\n\n"
    quizData.forEach((question, index) => {
      quizText += `## Question ${index + 1}: ${question.question}\n\n`

      question.options.forEach((option, optIndex) => {
        const isSelected = selectedAnswers[index] === optIndex
        const isCorrect = question.correctAnswer === optIndex

        if (isSelected && isCorrect) {
          quizText += `- ✅ ${option}\n`
        } else if (isSelected && !isCorrect) {
          quizText += `- ❌ ${option} (Your answer)\n`
        } else if (!isSelected && isCorrect) {
          quizText += `- ✅ ${option} (Correct answer)\n`
        } else {
          quizText += `- ${option}\n`
        }
      })

      quizText += "\n"
    })

    saveToNotes(quizText, 0)
    message.success("Quiz saved to notes!")
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto my-6">
      {quizLoading ? (
        <div className="w-full p-6 bg-[#121212] rounded-2xl border border-neutral-800 shadow-lg">
          <div className="w-full flex flex-col items-center justify-center py-10 transition-opacity duration-300">
            <div className="relative w-16 h-16 mb-5">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FF0042]/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[#FF0042] rounded-full animate-spin"></div>
            </div>
            <p className="text-neutral-300 font-medium text-xl">
              We're generating quiz for you...
            </p>
          </div>
        </div>
      ) : quizData && quizData.length > 0 ? (
        <div
          className="w-full transition-all duration-300"
          style={{
            transitionProperty: "opacity",
            transitionDuration: "0.3s"
          }}>
          <div className="p-6 bg-[#121212] rounded-2xl border border-neutral-800 w-full shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-neutral-300">
                Question {currentQuestionIndex + 1} of {quizData.length}
              </span>
              <div className="flex gap-2">
                {showResults && (
                  <button
                    onClick={resetQuiz}
                    className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm">
                    Reset
                  </button>
                )}

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
                  width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%`
                }}></div>
            </div>

            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 mb-4">
              <h3 className="text-xl font-medium mb-4">
                {quizData[currentQuestionIndex]?.question ||
                  "No question available"}
              </h3>

              <div className="space-y-3">
                {quizData[currentQuestionIndex]?.options.map(
                  (option, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        !showResults &&
                        handleAnswerSelect(currentQuestionIndex, index)
                      }
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? showResults
                            ? quizData[currentQuestionIndex].correctAnswer ===
                              index
                              ? "bg-green-950/30 border-green-600"
                              : "bg-red-950/30 border-red-600"
                            : "bg-[#FF0042]/20 border-[#FF0042]"
                          : showResults &&
                              quizData[currentQuestionIndex].correctAnswer ===
                                index
                            ? "bg-green-950/30 border-green-600"
                            : "bg-neutral-700/50 border-neutral-700 hover:bg-neutral-700"
                      }`}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-lg ${
                            selectedAnswers[currentQuestionIndex] === index
                              ? "bg-[#FF0042] text-white"
                              : "bg-neutral-700 text-neutral-300"
                          }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg">{option}</span>
                      </div>
                    </div>
                  )
                )}
              </div>

              {showResults && (
                <div className="mt-4 p-4 bg-neutral-900 rounded-lg">
                  <h4 className="font-medium text-lg mb-2">Explanation:</h4>
                  <p className="text-lg">
                    {quizData[currentQuestionIndex]?.explanation ||
                      "No explanation available."}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={moveToPrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>

              {!showResults ? (
                currentQuestionIndex === quizData.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={
                      Object.keys(selectedAnswers).length < quizData.length
                    }
                    className="px-4 py-2 bg-[#FF0042] hover:bg-[#e6003b] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={moveToNextQuestion}
                    disabled={
                      selectedAnswers[currentQuestionIndex] === undefined
                    }
                    className="px-4 py-2 bg-[#FF0042] hover:bg-[#e6003b] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    Next Question
                  </button>
                )
              ) : (
                <button
                  onClick={moveToNextQuestion}
                  disabled={currentQuestionIndex === quizData.length - 1}
                  className="px-4 py-2 bg-[#FF0042] hover:bg-[#e6003b] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  Next Question
                </button>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={saveQuizToNotes}
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
              <BookCheck size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FF0042]">
              Quiz Generator
            </h1>
          </div>

          <p className="text-base text-neutral-300 leading-relaxed mb-7">
            Test your knowledge with automatically generated quizzes based on
            the video content.
          </p>

          <button
            className="w-full flex items-center justify-center gap-3 p-4 bg-[#1A1A1A] rounded-xl transition-all duration-300 border border-neutral-800 hover:border-[#FF0042]/40 hover:scale-[1.01] active:scale-[0.99] group"
            onClick={() => handleSend("quiz_gen")}>
            <div className="p-2.5 bg-[#2A2A2A] group-hover:bg-[#FF0042]/20 rounded-lg transition-colors duration-300">
              <BookCheck
                size={18}
                className="text-[#FF0042] group-hover:text-[#FF6699]"
              />
            </div>
            <span className="font-medium text-xl text-neutral-200 group-hover:text-white">
              Take Quiz
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizTab
