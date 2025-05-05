import { message } from "antd"
import { BookCheck, BookmarkPlus } from "lucide-react"
import { useState } from "react"

import Loader from "./ui/Loader"

const QuizTab = ({ handleSend, saveToNotes, quizData, quizLoading }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

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
    <div className="flex flex-col items-center justify-center space-y-4 my-6">
      {quizLoading ? (
        <Loader eventText="We're generating quiz for you..." />
      ) : quizData && quizData.length > 0 ? (
        <div className="w-full">
          {/* Quiz Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-300">
              Question {currentQuestionIndex + 1} of {quizData.length}
            </span>
            {showResults && (
              <div className="flex gap-2">
                <button
                  onClick={resetQuiz}
                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm">
                  Reset
                </button>
                <button
                  onClick={saveQuizToNotes}
                  className="px-3 py-1 bg-[#FF0042]/80 hover:bg-[#FF0042] rounded-lg text-sm flex items-center gap-1">
                  <BookmarkPlus size={14} />
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-neutral-800 rounded-full mb-6">
            <div
              className="h-full bg-[#FF0042] rounded-full"
              style={{
                width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%`
              }}></div>
          </div>

          {/* Current Question */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 mb-4">
            <h3 className="text-xl font-medium mb-4">
              {quizData[currentQuestionIndex]?.question ||
                "No question available"}
            </h3>

            <div className="space-y-3">
              {quizData[currentQuestionIndex]?.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() =>
                    !showResults &&
                    handleAnswerSelect(currentQuestionIndex, index)
                  }
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? showResults
                        ? quizData[currentQuestionIndex].correctAnswer === index
                          ? "bg-green-950/30 border-green-600"
                          : "bg-red-950/30 border-red-600"
                        : "bg-[#FF0042]/20 border-[#FF0042]"
                      : showResults &&
                          quizData[currentQuestionIndex].correctAnswer === index
                        ? "bg-green-950/30 border-green-600"
                        : "bg-neutral-700/50 border-neutral-700 hover:bg-neutral-700"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? "bg-[#FF0042] text-white"
                          : "bg-neutral-700 text-neutral-300"
                      }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>

            {showResults && (
              <div className="mt-4 p-4 bg-neutral-900 rounded-lg">
                <h4 className="font-medium mb-2">Explanation:</h4>
                <p>
                  {quizData[currentQuestionIndex]?.explanation ||
                    "No explanation available."}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
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
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
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
        </div>
      ) : (
        <div className="w-full p-6 bg-gradient-to-r from-[#1a0010] to-[#29060f] rounded-2xl border border-[#FF0042]/20 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#FF0042] p-2 rounded-full">
              <BookCheck size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FF0042]">
              Quiz Generator
            </h1>
          </div>
          <p className="text-lg text-neutral-300 leading-relaxed mb-6">
            Test your knowledge with automatically generated quizzes based on
            the video content.
          </p>

          <button
            className="w-full flex items-center justify-center gap-3 p-4 bg-neutral-800/80 hover:bg-[#FF0042]/20 rounded-xl transition-all duration-300 border border-neutral-700 hover:border-[#FF0042]/50 group"
            onClick={() => handleSend("quiz_gen")}>
            <div className="p-2 bg-neutral-700 group-hover:bg-[#FF0042]/30 rounded-lg transition-colors">
              <BookCheck size={20} className="text-white" />
            </div>
            <span className="font-medium">Take Quiz</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizTab
