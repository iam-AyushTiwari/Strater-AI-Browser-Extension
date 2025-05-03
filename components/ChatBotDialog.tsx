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
import toast from "react-hot-toast"
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
    Array<{ id: number; question: string; answer: string; _id?: string }>
  >([])

  // Add these new state variables after the existing state declarations
  const [summaryData, setSummaryData] = useState("")
  const [summaryType, setSummaryType] = useState("Detailed")
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [quizData, setQuizData] = useState([])
  const [quizLoading, setQuizLoading] = useState(false)
  const [flashcardsData, setFlashcardsData] = useState([])
  const [flashcardsLoading, setFlashcardsLoading] = useState(false)
  const [notesLoading, setNotesLoading] = useState(false)
  const [notesCache, setNotesCache] = useState<Record<string, any>>({})

  useEffect(() => {
    const getVideoId = () => {
      return new URLSearchParams(window.location.search).get("v")
    }
    const fetchVideoData = async () => {
      const id = getVideoId()
      if (id && id !== videoId) {
        setVideoId(id)
        // Reset notes when video changes
        setSavedNotes([])
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

  // Load saved notes from storage or API when component mounts or videoId changes
  useEffect(() => {
    const loadSavedNotes = async () => {
      console.log("loadSavedNotes function called")
      if (!videoId || !user) return

      try {
        setNotesLoading(true)

        // Check if we have cached notes for this video
        if (notesCache[videoId] && notesCache[videoId].length > 0) {
          console.log("Using cached notes for video:", videoId)
          setSavedNotes(notesCache[videoId])
          setNotesLoading(false)
        }

        // Try to get notes from local storage first (for faster loading)
        const localNotes = await storage.get(`notes-${videoId}`)
        if (localNotes && localNotes.length > 0) {
          const parsedNotes = JSON.parse(localNotes)
          setSavedNotes(parsedNotes)
          setNotesCache((prev) => ({ ...prev, [videoId]: parsedNotes }))
          setNotesLoading(false)
          return
        }

        // Then fetch from API to ensure we have the latest data
        console.log("Fetching notes from API for video:", videoId)
        const response = await sendToBackground({
          name: "notes",
          body: {
            videoId: videoId,
            action: "getVideoNotes"
          }
        })

        if (response && response.success && response.data) {
          const notesData = response.data
          console.log("Got the notes data from server: ", notesData)

          // Handle different response formats
          let snippets = notesData[0].snippets
          console.log("This is the snippets ====>> ", snippets)
          if (typeof snippets === "string") {
            try {
              snippets = JSON.parse(snippets)
            } catch (e) {
              console.error("Error parsing snippets:", e)
              snippets = []
            }
          }

          if (Array.isArray(snippets) && snippets.length > 0) {
            console.log("Saving the snnipets from the server ====>> ", snippets)
            setSavedNotes(snippets)
            setNotesCache((prev) => ({ ...prev, [videoId]: snippets }))

            // Update local storage with the latest data
            await storage.set(`notes-${videoId}`, JSON.stringify(snippets))

            toast.success("Notes fetched successfully", {
              position: "top-right",
              duration: 2000
            })
          }
        }
      } catch (error) {
        console.error("Error loading saved notes:", error)
        toast.error("Failed to fetch notes", {
          position: "top-right",
          duration: 2000
        })
      } finally {
        setNotesLoading(false)
      }
    }

    loadSavedNotes()
  }, [videoId, user])

  const handleMaximize = () => {
    setMaximize(!maximize)
  }

  const handleOpacity = () => {
    const len = opacityOptions.length
    setOpacity((opacity + 1) % len)
    const element = document.querySelector("#strater-ai-chatbot")?.shadowRoot
    if (element) {
      const chatBot = element.querySelector<HTMLDivElement>(
        ".strater-ai-bot-opacity-handle"
      )
      if (chatBot) {
        chatBot.style.opacity = `${opacityOptions[opacity] / 100}`
      }
    }
  }

  // Updated saveToNotes function with proper API integration
  const saveToNotes = async (text, messageId) => {
    if (!videoId || !user) {
      toast.error("You must be logged in to save notes", {
        position: "top-right",
        duration: 2000
      })
      return
    }

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

    // Update local state first for immediate feedback
    const updatedNotes = [...savedNotes, newNote]
    setSavedNotes(updatedNotes)

    // Update cache
    setNotesCache((prev) => ({ ...prev, [videoId]: updatedNotes }))

    // Update local storage
    await storage.set(`notes-${videoId}`, JSON.stringify(updatedNotes))

    try {
      // Send to API
      const response = await sendToBackground({
        name: "notes",
        body: {
          notes: updatedNotes,
          videoId: videoId,
          action: "saveChanges"
        }
      })

      if (response && response.success) {
        toast.success("Note saved successfully", {
          position: "top-right",
          duration: 2000
        })
      } else {
        toast.error("Failed to save note to server", {
          position: "top-right",
          duration: 2000
        })
      }
    } catch (error) {
      console.error("Error saving note:", error)
      toast.error("Error saving note", {
        position: "top-right",
        duration: 2000
      })
    }

    // Switch to notes tab to show the saved note
    setActiveTab("notes")
  }

  // Updated deleteNote function with proper API integration
  const deleteNote = async (id) => {
    if (!videoId || !user) return

    // Update local state first for immediate feedback
    const updatedNotes = savedNotes.filter((note) => note.id !== id)
    setSavedNotes(updatedNotes)

    // Update cache
    setNotesCache((prev) => ({ ...prev, [videoId]: updatedNotes }))

    // Update local storage
    await storage.set(`notes-${videoId}`, JSON.stringify(updatedNotes))

    try {
      // Send to API
      const response = await sendToBackground({
        name: "notes",
        body: {
          notes: updatedNotes,
          videoId: videoId,
          action: "saveChanges"
        }
      })

      if (response && response.success) {
        toast.success("Note deleted successfully", {
          position: "top-right",
          duration: 2000
        })
      } else {
        toast.error("Failed to update notes on server", {
          position: "top-right",
          duration: 2000
        })
      }
    } catch (error) {
      console.error("Error deleting note:", error)
      toast.error("Error deleting note", {
        position: "top-right",
        duration: 2000
      })
    }
  }

  const handleSend = async (action = "chat") => {
    console.log("Handle send is called with action: ", action)
    if (!input.trim() && action === "chat") return

    // If user is not logged in or no video is playing, show error message
    if (!user) {
      if (action !== "chat") {
        // For non-chat actions, show error in the respective tab
        message.error("Please login to continue!")
      }

      setLoading(true)
      setMessages((prevState) => [
        ...prevState,
        {
          id: prevState.length + 1,
          sender: "user",
          text: input || action
        }
      ])
      setInput("")

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
      setDrawerOpen(true)
      setDrawerHeight("90%")
      if (action !== "chat") {
        // For non-chat actions, show error in the respective tab
        message.error("Watch some video to continue!")
      }

      setLoading(true)
      setMessages((prevState) => [
        ...prevState,
        {
          id: prevState.length + 1,
          sender: "user",
          text: input || action
        }
      ])
      setInput("")

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

    // Set loading state based on action type
    if (action === "chat") {
      setLoading(true)
      // Open drawer when user asks a follow-up question
      setDrawerOpen(true)
      setDrawerHeight("90%") // Ensure drawer is expanded when sending a message

      setMessages((prevState) => [
        ...prevState,
        {
          id: prevState.length + 1,
          sender: "user",
          text: input || action
        }
      ])
      setInput("")
    } else if (action === "videoSummary_Generate") {
      setSummaryLoading(true)
    } else if (action === "quiz_gen") {
      setQuizLoading(true)
    } else if (action === "flashcard_gen") {
      setFlashcardsLoading(true)
    }

    const body = {
      prompt: input || "abcd",
      action: action === "chat" ? "null" : action,
      videoID: videoId,
      type: summaryType // Use the selected summary type
    }

    try {
      const response = await sendToBackground({
        name: "straterAI",
        body: {
          body: body
        }
      })

      if (response) {
        console.log("response of bot:", response)

        // Handle response based on action type
        if (action === "chat") {
          setMessages((prevState) => [
            ...prevState,
            {
              id: prevState.length + 1,
              sender: "bot",
              text:
                response.data ||
                response.error ||
                "Sorry, I couldn't process that request."
            }
          ])
          setLoading(false)
        } else if (action === "videoSummary_Generate") {
          setSummaryData(response.data || "Failed to generate summary.")
          setSummaryLoading(false)
        } else if (action === "quiz_gen") {
          try {
            // Assuming the response is a string that can be parsed as JSON
            const parsedData =
              typeof response.data === "string"
                ? JSON.parse(response.data)
                : response.data || []
            setQuizData(Array.isArray(parsedData) ? parsedData : [])
          } catch (error) {
            console.error("Error parsing quiz data:", error)
            setQuizData([])
            toast.error("Failed to parse quiz data")
          }
          setQuizLoading(false)
        } else if (action === "flashcard_gen") {
          try {
            // Assuming the response is a string that can be parsed as JSON
            const parsedData =
              typeof response.data === "string"
                ? JSON.parse(response.data)
                : response.data || []
            setFlashcardsData(Array.isArray(parsedData) ? parsedData : [])
          } catch (error) {
            console.error("Error parsing flashcard data:", error)
            setFlashcardsData([])
            toast.error("Failed to parse flashcard data")
          }
          setFlashcardsLoading(false)
        }
      }
    } catch (error) {
      console.error("Error sending request:", error)

      // Handle errors for different action types
      if (action === "chat") {
        setMessages((prevState) => [
          ...prevState,
          {
            id: prevState.length + 1,
            sender: "bot",
            text: "Sorry, there was an error processing your request."
          }
        ])
        setLoading(false)
      } else if (action === "videoSummary_Generate") {
        setSummaryData("Failed to generate summary. Please try again.")
        setSummaryLoading(false)
      } else if (action === "quiz_gen") {
        setQuizLoading(false)
        toast.error("Failed to generate quiz")
      } else if (action === "flashcard_gen") {
        setFlashcardsLoading(false)
        toast.error("Failed to generate flashcards")
      }
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
      }, 100) // Small delay to ensure state updates properly
    }
  }

  const expandDrawer = () => {
    if (drawerHeight === "0%" || drawerHeight === "") {
      setDrawerHeight("90%")
      setTimeout(() => {
        setDrawerOpen(true)
      }, 300) // Wait for animation to complete
    } else {
      setDrawerHeight("0%")
      setTimeout(() => {
        if (drawerHeight === "0%") {
          setDrawerOpen(false)
        }
      }, 300) // Wait for animation to complete
    }
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
                  loading={notesLoading}
                />
              )}
              {activeTab === "summary" && (
                <SummaryTab
                  handleSend={handleSend}
                  saveToNotes={saveToNotes}
                  setSummaryType={setSummaryType}
                  summaryType={summaryType}
                  summaryData={summaryData}
                  summaryLoading={summaryLoading}
                />
              )}
              {activeTab === "quiz" && (
                <QuizTab
                  handleSend={handleSend}
                  saveToNotes={saveToNotes}
                  quizData={quizData}
                  quizLoading={quizLoading}
                />
              )}
              {activeTab === "flashcards" && (
                <FlashcardsTab
                  handleSend={handleSend}
                  saveToNotes={saveToNotes}
                  flashcardsData={flashcardsData}
                  flashcardsLoading={flashcardsLoading}
                />
              )}
            </div>

            <div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{ zIndex: drawerOpen ? -1 : 10 }}>
              <button
                onClick={toggleDrawer}
                className="bg-neutral-900 rounded-full p-2 hover:bg-neutral-800">
                <ChevronUp size={20} />
              </button>
            </div>
            {/* Input - Only show when drawer is closed */}
            {
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
                  disabled={loading}
                  className="bg-[#FF0042] hover:bg-[#e6003b] text-white px-4 py-2 rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed">
                  <Forward size={18} />
                </button>
              </div>
            }

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
                      onClick={toggleDrawer}
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

const NotesTab = ({
  handleSend,
  setInput,
  savedNotes,
  deleteNote,
  loading
}) => {
  if (loading && savedNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF0042] mb-4"></div>
        <p className="text-neutral-300">Loading notes...</p>
      </div>
    )
  }

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

// SummaryTab component
const SummaryTab = ({
  handleSend,
  saveToNotes,
  setSummaryType,
  summaryType,
  summaryData,
  summaryLoading
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-6">
      {!summaryData && (
        <div className="w-full p-6 bg-gradient-to-r from-[#1a0010] to-[#29060f] rounded-2xl border border-[#FF0042]/20 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#FF0042] p-2 rounded-full">
              <Notebook size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FF0042]">
              Video Summary
            </h1>
          </div>

          {/* Summary Type Selector */}
          <div className="mb-6">
            <p className="text-lg text-neutral-300 leading-relaxed mb-3">
              Get a comprehensive summary of the current video to quickly
              understand the key points.
            </p>
            <div className="flex gap-3">
              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  summaryType === "Concise"
                    ? "bg-[#FF0042] text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
                onClick={() => setSummaryType("Concise")}>
                Concise
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  summaryType === "Detailed"
                    ? "bg-[#FF0042] text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
                onClick={() => setSummaryType("Detailed")}>
                Detailed
              </button>
            </div>
          </div>

          {summaryLoading ? (
            <div className="w-full flex flex-col items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF0042] mb-4"></div>
              <p className="text-neutral-300">
                Generating {summaryType.toLowerCase()} summary...
              </p>
            </div>
          ) : (
            <button
              className="w-full flex items-center justify-center gap-3 p-4 bg-neutral-800/80 hover:bg-[#FF0042]/20 rounded-xl transition-all duration-300 border border-neutral-700 hover:border-[#FF0042]/50 group"
              onClick={() => handleSend("videoSummary_Generate")}>
              <div className="p-2 bg-neutral-700 group-hover:bg-[#FF0042]/30 rounded-lg transition-colors">
                <Notebook size={20} className="text-white" />
              </div>
              <span className="font-medium">
                Generate {summaryType} Summary
              </span>
            </button>
          )}
        </div>
      )}
      {summaryData && (
        <div className="px-2">
          <Markdown markdown={summaryData} className="text-white" />
          <div className="flex justify-end mt-4">
            <button
              onClick={() => saveToNotes(summaryData, 0)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-[#FF0042]/70 rounded-lg transition-colors">
              <BookmarkPlus size={16} />
              <span>Save to Notes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// QuizTab component
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
        <div className="w-full p-6 bg-gradient-to-r from-[#1a0010] to-[#29060f] rounded-2xl border border-[#FF0042]/20 shadow-lg flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF0042] mb-4"></div>
          <p className="text-neutral-300">Generating quiz questions...</p>
        </div>
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

// FlashcardsTab component
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

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="avatar">
        <img
          src={logo || "/placeholder.svg"}
          alt="Bot"
          className="h-7 w-7 rounded-full mr-2 border border-neutral-700"
        />
      </div>

      <div className="message-typing">
        <div className="typing-dots bg-neutral-800 px-3 py-2 rounded-2xl flex items-center">
          <h1 className="2xl animate-pulse">
            <Markdown markdown="Thinking... ✨" className="text-white" />
          </h1>
          <div className="dot bg-neutral-400 mx-1 rounded-full animate-pulse" />
          <div className="dot bg-neutral-400 mx-1 rounded-full animate-pulse delay-100" />
          <div className="dot bg-neutral-400 mx-1 rounded-full animate-pulse delay-200" />
        </div>
      </div>
    </div>
  )
}

export default ChatBotDialog
