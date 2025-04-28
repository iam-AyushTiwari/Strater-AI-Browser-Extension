"use client"

import { message, Tooltip } from "antd"
import { useMainContext } from "contextAPI/MainContext"
import {
  BookCheck,
  BookmarkPlus,
  ChevronDown,
  ChevronUp,
  Eye,
  Flashlight,
  Forward,
  Lock,
  Maximize,
  Menu,
  Minimize,
  Minus,
  Notebook,
  Pen,
  UserRound,
  X
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Draggable from "react-draggable"
import Markdown from "utils/markdown"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

// @ts-ignore
import logo from "../assets/icon.png"

const DUMMY_MESSAGES = [
  {
    id: 1,
    sender: "bot",
    text: "Hello! 👋 How can I help you today?"
  }
]

const TABS = [
  { id: "notes", label: "Notes", icon: <Pen size={18} /> },
  { id: "summary", label: "Summary", icon: <Notebook size={18} /> },
  { id: "quiz", label: "Quiz", icon: <BookCheck size={18} /> },
  { id: "flashcards", label: "Flashcards", icon: <Flashlight size={18} /> }
]

const ChatBotDialog = () => {
  const storage = new Storage()
  const opacityOptions = [100, 75, 50]
  const nodeRef = useRef(null)
  const messagesEndRef = useRef(null)
  const drawerRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState(false)
  const [maximize, setMaximize] = useState(false)
  const [messages, setMessages] = useState(DUMMY_MESSAGES)
  const [input, setInput] = useState("")
  const { chatBotVisible, setChatBotVisible } = useMainContext()
  const [chatBotOpened, setChatBotOpened] = useState(chatBotVisible || false)
  const [opacity, setOpacity] = useState(0)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("notes")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerHeight, setDrawerHeight] = useState("0%")
  const [savedNotes, setSavedNotes] = useState<
    Array<{ id: number; question: string; answer: string }>
  >([])

  useEffect(() => {
    const getVideoId = () => {
      return new URLSearchParams(window.location.search).get("v")
    }
    const fetchVideoData = async () => {
      const id = getVideoId()
      if (id && id != videoId) {
        setVideoId(id)
      }
    }
    fetchVideoData()

    const intervalId = setInterval(fetchVideoData, 2000)

    return () => clearInterval(intervalId)
  }, [videoId])

  useEffect(() => {
    const fetchUser = async () => {
      const isUser = (await storage.get("user")) as any | undefined
      if (isUser !== undefined) {
        setUser(isUser)
        console.log("chat bot got the user: ", isUser)
      } else {
        setUser(null)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    console.log("Context of the chatBOT updated: ", chatBotVisible)
    setChatBotOpened(chatBotVisible)
  }, [chatBotVisible])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Load saved notes from storage when component mounts
    const loadSavedNotes = async () => {
      try {
        const notes = await storage.get(`notes-${videoId}`)
        if (notes) {
          setSavedNotes(JSON.parse(notes))
        }
      } catch (error) {
        console.error("Error loading saved notes:", error)
      }
    }

    if (videoId) {
      loadSavedNotes()
    }
  }, [videoId])

  // Save notes to storage whenever they change
  useEffect(() => {
    const saveNotesToStorage = async () => {
      if (videoId && savedNotes.length > 0) {
        await storage.set(`notes-${videoId}`, JSON.stringify(savedNotes))
      }
    }

    saveNotesToStorage()
  }, [savedNotes, videoId])

  const handleMaximize = () => {
    setMaximize(!maximize)
  }

  const handleOpacity = () => {
    const len = opacityOptions.length
    setOpacity((opacity + 1) % len)
    const element = document.querySelector("#strater-ai-chatbot").shadowRoot
    const chatBot = element.querySelector<HTMLDivElement>(
      ".strater-ai-bot-opacity-handle"
    )
    if (chatBot) {
      chatBot.style.opacity = `${opacityOptions[opacity] / 100}`
    }
  }

  const handleSend = async (action = "chat") => {
    if (!input.trim() && action === "chat") return
    setLoading(true)

    // Open drawer when user asks a follow-up question
    if (action === "chat") {
      setDrawerOpen(true)
      setDrawerHeight("90%") // Ensure drawer is expanded when sending a message
    }

    setMessages((prevState) => [
      ...prevState,
      {
        id: prevState.length + 1,
        sender: "user",
        text: input || action
      }
    ])
    setInput("")

    if (!user) {
      setLoading(false)
      return setMessages((prevState) => [
        ...prevState,
        {
          id: prevState.length + 1,
          sender: "bot",
          text: "Please login to continue!"
        }
      ])
    }

    if (!videoId) {
      setLoading(false)
      return setMessages((prevState) => [
        ...prevState,
        {
          id: prevState.length + 1,
          sender: "bot",
          text: "Watch some video to continue!"
        }
      ])
    }

    const body = {
      prompt: input || "abcd",
      action: action === "chat" ? "null" : action,
      videoID: videoId,
      type: "Detailed"
    }

    const response = await sendToBackground({
      name: "straterAI",
      body: {
        body: body
      }
    })

    if (response) {
      console.log("response of bot dummy: ", response)
      setMessages((prevState) => [
        ...prevState,
        {
          id: prevState.length + 1,
          sender: "bot",
          text: response.data || response.error
        }
      ])
      setLoading(false)
    }
  }

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend()
    }
    e.stopPropagation()
  }

  const toggleDrawer = () => {
    if (drawerOpen) {
      // Close drawer
      setDrawerHeight("0%")
      setTimeout(() => {
        setDrawerOpen(false)
      }, 300) // Wait for animation to complete
    } else {
      // Open drawer
      setDrawerOpen(true)
      setTimeout(() => {
        setDrawerHeight("90%")
      }, 10) // Small delay to ensure state updates properly
    }
  }

  const expandDrawer = () => {
    if (drawerHeight === "0%" || drawerHeight === "") {
      setDrawerHeight("90%")
      setDrawerOpen(true)
    } else {
      setDrawerHeight("0%")
      setTimeout(() => {
        if (drawerHeight === "0%") {
          setDrawerOpen(false)
        }
      }, 300) // Wait for animation to complete
    }
  }

  const saveToNotes = (text, messageId) => {
    // Find the user question that preceded this answer
    const messageIndex = messages.findIndex((msg) => msg.id === messageId)
    let question = "No question found"

    // Look for the most recent user message before this bot message
    if (messageIndex > 0) {
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (messages[i].sender === "user") {
          question = messages[i].text
          break
        }
      }
    }

    const newNote = {
      id: Date.now(),
      question,
      answer: text
    }
    setSavedNotes((prev) => [...prev, newNote])

    // Switch to notes tab to show the saved note
    setActiveTab("notes")
  }
  const deleteNote = (id) => {
    setSavedNotes((prev) => prev.filter((note) => note.id !== id))
    message.success("Note deleted successfully")
  }

  const getActionForTab = (tabId) => {
    switch (tabId) {
      case "summary":
        return "videoSummary_Generate"
      case "quiz":
        return "quiz_gen"
      case "flashcards":
        return "flashcard_gen"
      default:
        return "chat"
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {chatBotOpened && (
        <Draggable
          nodeRef={nodeRef}
          handle=".chatbot-dialog-title"
          bounds="parent">
          <div
            ref={nodeRef}
            className={`absolute top-24 left-24 ${
              maximize ? "w-4/6 h-5/6" : "w-1/4 h-5/6"
            } max-w-full bg-neutral-900 text-white rounded-2xl shadow-2xl pointer-events-auto flex flex-col transition-all duration-200 strater-ai-bot-opacity-handle overflow-hidden`}>
            {/* Header */}
            <div className="chatbot-dialog-title cursor-move select-none bg-neutral-800 px-5 py-3 rounded-t-2xl flex items-center justify-between font-semibold text-lg">
              <div className="flex items-center gap-3">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Strater AI"
                  className="h-7 w-7 rounded-full border-2 border-white"
                />
                <h1 className="text-xl">Strater AI</h1>
              </div>
              <div className="options flex gap-3">
                <Tooltip title={`${maximize ? "Minimize" : "Expand"}`}>
                  {maximize ? (
                    <Minimize
                      size={18}
                      className="cursor-pointer"
                      onClick={handleMaximize}
                    />
                  ) : (
                    <Maximize
                      size={18}
                      className="cursor-pointer"
                      onClick={handleMaximize}
                    />
                  )}
                </Tooltip>
                <Tooltip title="Lock">
                  <Lock size={18} className="cursor-pointer" />
                </Tooltip>
                <Tooltip title="Opacity">
                  <Eye
                    size={18}
                    className="cursor-pointer"
                    onClick={handleOpacity}
                  />
                </Tooltip>
                <Tooltip title="Minimize">
                  <Minus
                    size={18}
                    className="cursor-pointer"
                    onClick={() => setChatBotVisible(!chatBotVisible)}
                  />
                </Tooltip>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-slate-950 px-4 py-2 flex border-b border-neutral-700">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-neutral-900 text-white"
                      : "hover:bg-neutral-700 text-neutral-300"
                  }`}
                  onClick={() => setActiveTab(tab.id)}>
                  {tab.icon}
                  <span className="text-lg">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-neutral-950 scroll-smooth thin-scrollbar">
              {activeTab === "notes" && (
                <NotesTab
                  handleSend={handleSend}
                  setInput={setInput}
                  savedNotes={savedNotes}
                  deleteNote={deleteNote}
                />
              )}
              {activeTab === "summary" && (
                <SummaryTab handleSend={handleSend} />
              )}
              {activeTab === "quiz" && <QuizTab handleSend={handleSend} />}
              {activeTab === "flashcards" && (
                <FlashcardsTab handleSend={handleSend} />
              )}
            </div>

            {/* Input - Only show when drawer is closed */}
            {!drawerOpen && (
              <div className="px-4 py-3 bg-neutral-900 rounded-b-2xl flex items-center gap-2 border-t border-neutral-800 sticky bottom-0">
                <input
                  type="text"
                  placeholder="Ask anything about this video..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onKeyUp={(event) => event.stopPropagation()}
                  disabled={loading}
                  className="flex-1 bg-neutral-800 text-white px-4 py-2 rounded-lg focus:outline-none border text-lg border-neutral-700"
                />
                <button
                  onClick={() => handleSend()}
                  className="bg-[#FF0042] hover:bg-[#e6003b] text-white px-4 py-2 rounded-full flex items-center justify-center transition">
                  <Forward size={18} />
                </button>
              </div>
            )}

            {/* Drawer for Chat History */}
            {drawerOpen && (
              <div
                ref={drawerRef}
                className={`absolute bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 rounded-t-xl shadow-lg transition-all duration-300`}
                style={{ height: drawerHeight }}>
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-700">
                  <span className="font-medium text-xl">Chat History</span>
                  <div className="flex gap-2">
                    <button
                      onClick={expandDrawer}
                      className="p-1 hover:bg-neutral-800 rounded-md">
                      {drawerHeight === "90%" ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronUp size={18} />
                      )}
                    </button>
                    <button
                      onClick={toggleDrawer}
                      className="p-1 hover:bg-neutral-800 rounded-md">
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto p-4 h-[calc(100%-100px)] thin-scrollbar">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
                      {msg.sender === "bot" && (
                        <img
                          src={logo || "/placeholder.svg"}
                          alt="Bot"
                          className="h-7 w-7 rounded-full mr-2 self-end border border-neutral-700"
                        />
                      )}
                      <div
                        className={`max-w-[87%] w-auto px-4 py-2 rounded-2xl text-xl shadow
                          ${
                            msg.sender === "user"
                              ? "bg-[#29060f] text-white rounded-br-md"
                              : "bg-neutral-800 text-white rounded-bl-md"
                          }`}>
                        {
                          <Markdown
                            markdown={msg.text}
                            className="text-white w-auto"
                          />
                        }
                        {msg.sender === "bot" && (
                          <button
                            onClick={() => saveToNotes(msg.text, msg.id)}
                            className="mt-2 flex items-center gap-1 text-sm text-neutral-400 hover:text-[#FF0042] transition-colors">
                            <BookmarkPlus size={14} />
                            <span>Save to Notes</span>
                          </button>
                        )}
                      </div>
                      {msg.sender === "user" && (
                        <div className="h-7 w-7 ml-2 bg-red-950 rounded-full flex items-center justify-center">
                          <UserRound className="text-white" size={14} />
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input field inside drawer */}
                <div className="px-4 pt-3 pb-4 bg-neutral-900 rounded-b-2xl flex items-center gap-2 border-t border-neutral-800 sticky bottom-0">
                  <input
                    type="text"
                    placeholder="Ask follow up..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onKeyUp={(event) => event.stopPropagation()}
                    disabled={loading}
                    className="flex-1 bg-neutral-800 text-white px-4 py-2 rounded-lg focus:outline-none border text-lg border-neutral-700"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={loading}
                    className="bg-[#FF0042] hover:bg-[#e6003b] text-white px-4 py-2 rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <Forward size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Draggable>
      )}
    </div>
  )
}

const NotesTab = ({ handleSend, setInput, savedNotes, deleteNote }) => {
  if (savedNotes && savedNotes.length > 0) {
    return (
      <div className="space-y-4 my-4">
        <h2 className="text-2xl font-semibold text-white mb-4">Your Notes</h2>

        {savedNotes.map((note) => (
          <div
            key={note.id}
            className="bg-neutral-800 rounded-xl p-4 border border-neutral-700 relative group">
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
          No notes found for this video
          <br />
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

const SummaryTab = ({ handleSend }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-6">
      <div className="w-full p-6 bg-gradient-to-r from-[#1a0010] to-[#29060f] rounded-2xl border border-[#FF0042]/20 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#FF0042] p-2 rounded-full">
            <Notebook size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FF0042]">
            Video Summary
          </h1>
        </div>
        <p className="text-lg text-neutral-300 leading-relaxed mb-6">
          Get a comprehensive summary of the current video to quickly understand
          the key points.
        </p>

        <button
          className="w-full flex items-center justify-center gap-3 p-4 bg-neutral-800/80 hover:bg-[#FF0042]/20 rounded-xl transition-all duration-300 border border-neutral-700 hover:border-[#FF0042]/50 group"
          onClick={() => handleSend("videoSummary_Generate")}>
          <div className="p-2 bg-neutral-700 group-hover:bg-[#FF0042]/30 rounded-lg transition-colors">
            <Notebook size={20} className="text-white" />
          </div>
          <span className="font-medium">Generate Summary</span>
        </button>
      </div>
    </div>
  )
}

const QuizTab = ({ handleSend }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-6">
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
          Test your knowledge with automatically generated quizzes based on the
          video content.
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
    </div>
  )
}

const FlashcardsTab = ({ handleSend }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-6">
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
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="typing-indicator flex items-center gap-2 mt-2">
      <img
        src={logo || "/placeholder.svg"}
        alt="Bot"
        className="h-7 w-7 rounded-full mr-2 border border-neutral-700"
      />

      <div className="typing-dots bg-neutral-800 px-3 py-2 rounded-2xl flex items-center relative">
        <h1 className="2xl">
          <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-2xl" />
          Thinking...
        </h1>
        <div className="dot bg-neutral-400 mx-1 rounded-full animate-pulse" />
        <div className="dot bg-neutral-400 mx-1 rounded-full animate-pulse delay-100" />
        <div className="dot bg-neutral-400 mx-1 rounded-full animate-pulse delay-200" />
      </div>
    </div>
  )
}

export default ChatBotDialog
