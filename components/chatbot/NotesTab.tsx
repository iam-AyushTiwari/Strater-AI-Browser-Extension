"use client"

import { Menu, Save, X } from "lucide-react"
import Markdown from "utils/markdown"

import Loader from "./ui/Loader"

const NotesTab = ({
  handleSend,
  setInput,
  savedNotes,
  deleteNote,
  loading,
  saved
}) => {
  if (loading && savedNotes.length === 0) {
    return (
      <div className="flex-1 justify-center items-center">
        <Loader eventText="Fetching your notes..." />
      </div>
    )
  }

  if (savedNotes && savedNotes.length > 0) {
    return (
      <div className="space-y-4 my-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white mb-4">Your Notes</h2>
          {saved && (
            <div className="flex items-center gap-2 text-green-500">
              <Save size={16} />
              <span className="text-sm">Saved</span>
            </div>
          )}
        </div>

        {savedNotes.map((note) => (
          <div
            key={note.id}
            className="bg-[#121212] rounded-2xl border border-neutral-800 shadow-lg p-4 relative group">
            <div className="mb-3 pb-3 border-b border-neutral-700">
              <p className="text-white">{note.question}</p>
            </div>
            <div>
              <Markdown markdown={note.answer} className="text-white" />
            </div>
            <button
              onClick={() => deleteNote(note.id)}
              className="absolute top-2 right-2 p-1 bg-neutral-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF0042]">
              <X size={14} />
            </button>
          </div>
        ))}

        <div className="p-4 rounded-2xl text-white w-full max-w-md mt-6">
          <h3 className="text-lg font-medium mb-3">Ask more questions:</h3>
          <div className="space-y-3 p-2">
            {[
              "What is the main topic of this video?",
              "What are the key takeaways from this video?"
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(question)
                  handleSend()
                }}
                className="w-full text-left bg-blue-950/40 hover:bg-blue-950/70 transition-colors rounded-lg px-4 py-3 text-lg shadow-md flex items-center gap-3 cursor-pointer">
                <Menu size={18} />
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-6">
      <div className="w-full p-6 flex flex-col items-center">
        {/* No Notes Illustration */}
        <div className="mb-6">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <rect width="120" height="120" rx="24" fill="#2a0a18" />
            <path d="M40 40h40v40H40z" fill="#fff" fillOpacity="0.05" />
            <path
              d="M50 60h20M50 68h20"
              stroke="#FF0042"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="60" cy="54" r="4" fill="#FF0042" />
            <rect
              x="40"
              y="40"
              width="40"
              height="40"
              rx="8"
              stroke="#FF0042"
              strokeWidth="2"
            />
          </svg>
        </div>
        {/* Title */}
        <h2 className="text-2xl font-semibold text-white mb-2 text-center">
          You haven't created any notes for this video yet.
        </h2>
        {/* Description */}
        <p className="text-md text-neutral-300 text-center mb-6 max-w-md">
          <span className="text-white font-medium">
            Ask for a summary or follow up with your own questions
          </span>{" "}
          to take notes and capture key insights!
        </p>
        {/* Modern Chat-Style Question Tags */}
        <div className="p-4 rounded-2xl text-white w-full max-w-md">
          <div className="space-y-3 p-2">
            {[
              "What is the main topic of this video?",
              "What are the key takeaways from this video?"
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(question)
                  handleSend()
                }}
                className="w-full text-left bg-blue-950/40 hover:bg-blue-950/70 transition-colors rounded-lg px-4 py-3 text-lg shadow-md flex items-center gap-3 cursor-pointer">
                <Menu size={18} />
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotesTab
