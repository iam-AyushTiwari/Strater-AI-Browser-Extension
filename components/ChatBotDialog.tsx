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
  Minimize,
  Minus,
  Notebook,
  Pen,
  Save,
  UserRound,
  X
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Draggable from "react-draggable"
import toast from "react-hot-toast"
import { extractJSONArray } from "utils/extractArray"
import Markdown from "utils/markdown"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

// @ts-ignore
import logo from "../assets/icon.png"
import FlashcardsTab from "./chatbot/FlashcardsTab"
import NotesTab from "./chatbot/NotesTab"
import QuizTab from "./chatbot/QuizTab"
import SummaryTab from "./chatbot/SummaryTab"
import TypingIndicator from "./chatbot/ui/TypingIndicator"

const DUMMY_MESSAGES = [
  {
    id: 1,
    sender: "bot",
    text: "🚀 Hey there! Welcome to Strater AI. How can I boost your learning today? 🤔"
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
  const [videoTitle, setVideoTitle] = useState<string | null>()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("notes")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerHeight, setDrawerHeight] = useState("0%")
  const [savedNotes, setSavedNotes] = useState<
    Array<{ id: number; question: string; answer: string; _id?: string }>
  >([])

  // Add these new state variables after the existing state declarations
  const [summaryData, setSummaryData] = useState("")
  const [summaryType, setSummaryType] = useState("Detailed") // issues with the captal and small letter
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [quizData, setQuizData] = useState([])
  const [quizLoading, setQuizLoading] = useState(false)
  const [flashcardsData, setFlashcardsData] = useState([])
  const [flashcardsLoading, setFlashcardsLoading] = useState(false)
  const [notesLoading, setNotesLoading] = useState(false)
  const [notesCache, setNotesCache] = useState<Record<string, any>>({})

  // state for saved in the db materials
  const [notesSaved, setNotesSaved] = useState(false)
  const [summarySaved, setSummarySaved] = useState(false)
  const [quizSaved, setQuizSaved] = useState(false)
  const [flashcardsSaved, setFlashcardsSaved] = useState(false)

  // New state for saving indicators
  const [isSaving, setIsSaving] = useState(false)
  const [savingType, setSavingType] = useState<string | null>(null)

  const saveContent = async (body, type) => {
    try {
      setIsSaving(true)
      setSavingType(type)

      const response = await sendToBackground({
        //@ts-ignore
        name: "saveContents",
        body: {
          body: body,
          type: type
        }
      })

      if (response.success) {
        // Set the appropriate saved state based on the type
        switch (type) {
          case "videoSummary_Generate":
            setSummarySaved(true)
            break
          case "quiz_gen":
            setQuizSaved(true)
            break
          case "flashcard_gen":
            setFlashcardsSaved(true)
            break
        }
        toast.success(
          `${type.split("_")[0].charAt(0).toUpperCase() + type.split("_")[0].slice(1)} saved successfully!`
        )
        return true
      } else {
        toast.error(`Failed to save ${type.split("_")[0]}`)
        return false
      }
    } catch (error) {
      console.error(`Error saving ${type}:`, error)
      toast.error(`Error saving ${type.split("_")[0]}`)
      return false
    } finally {
      setIsSaving(false)
      setSavingType(null)
    }
  }

  const saveUserContents = async (action, data) => {
    const formatResponse = (input) =>
      typeof input === "string" ? input : JSON.stringify(input)

    switch (action) {
      case "videoSummary_Generate":
        console.log("Saved action for video summary!", videoTitle, action, data)
        const summaryBody = {
          title: videoTitle,
          videoId: videoId,
          response: formatResponse(data || summaryData),
          type: summaryType.toLowerCase()
        }
        return await saveContent(summaryBody, action)

      case "quiz_gen":
        console.log("Saved action for quiz!", videoTitle, action, data)
        const quizBody = {
          title: videoTitle,
          videoId: videoId,
          response: formatResponse(data || quizData)
        }
        return await saveContent(quizBody, action)

      case "flashcard_gen":
        console.log("Saved action for flashcard!", videoTitle, action, data)
        const flashcardBody = {
          title: videoTitle,
          videoId: videoId,
          response: formatResponse(data || flashcardsData)
        }
        return await saveContent(flashcardBody, action)

      default:
        return false
    }
  }

  useEffect(() => {
    const getVideoId = () => {
      return new URLSearchParams(window.location.search).get("v")
    }

    const getVideoTitle = () => {
      const titleElement = document.querySelector("h1.ytd-watch-metadata")
      console.log(
        "==> Got the video title",
        titleElement ? titleElement.textContent.trim() : "YouTube Video"
      )
      return titleElement ? titleElement.textContent.trim() : "YouTube Video"
    }

    const handleVideoChange = () => {
      const id = getVideoId()
      const title = getVideoTitle()

      if (id && id !== videoId && title && title !== "YouTube Video") {
        setVideoId(id)
        setVideoTitle(title)

        // Reset states when a new video loads
        setSavedNotes([])
        setSummaryData("")
        setQuizData([])
        setFlashcardsData([])
        setSummarySaved(false)
        setQuizSaved(false)
        setFlashcardsSaved(false)
      }
    }

    // --- MutationObserver: Reacts to DOM changes ---
    const observer = new MutationObserver(() => {
      const titleElement = document.querySelector("h1.ytd-watch-metadata")
      if (titleElement && titleElement.textContent.trim()) {
        handleVideoChange()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // --- Fallback Interval: Checks every 5s just in case ---
    const intervalId = setInterval(() => {
      handleVideoChange()
    }, 5000)

    // Cleanup
    return () => {
      observer.disconnect()
      clearInterval(intervalId)
    }
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
          let snippets = notesData.snippets
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
      setIsSaving(true)
      setSavingType("notes")

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
        setNotesSaved(true)
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
    } finally {
      setIsSaving(false)
      setSavingType(null)
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
      setIsSaving(true)
      setSavingType("notes")

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
    } finally {
      setIsSaving(false)
      setSavingType(null)
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
      setSummarySaved(false)
    } else if (action === "quiz_gen") {
      setQuizLoading(true)
      setQuizSaved(false)
    } else if (action === "flashcard_gen") {
      setFlashcardsLoading(true)
      setFlashcardsSaved(false)
    }

    const body = {
      prompt: input || "abcd",
      action: action === "chat" ? "null" : action,
      videoID: videoId,
      type: summaryType.toLowerCase()
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
          const summaryContent = response.data || "Failed to generate summary."
          setSummaryData(summaryContent)

          // If response is from AI (not from DB), save it to DB
          if (response.success && response.source === "ai") {
            saveUserContents(action, summaryContent)
          } else if (response.success && response.source === "db") {
            setSummarySaved(true)
          }

          setSummaryLoading(false)
        } else if (action === "quiz_gen") {
          console.log("Quiz gen Response data:", response.data)
          const quizContent = extractJSONArray(response.data)
          console.log("Final quizData", quizContent)
          try {
            // Assuming the response is a string that can be parsed as JSON
            const parsedData =
              typeof quizContent === "string"
                ? JSON.parse(quizContent)
                : quizContent || []

            const finalQuizData = Array.isArray(parsedData) ? parsedData : []
            setQuizData(finalQuizData)

            // If response is from AI (not from DB), save it to DB
            if (response.success && response.source === "ai") {
              saveUserContents(action, finalQuizData)
            } else if (response.success && response.source === "db") {
              setQuizSaved(true)
            }
          } catch (error) {
            console.error("Error parsing quiz data:", error)
            setQuizData([])
            toast.error("Failed to parse quiz data")
          }
          setQuizLoading(false)
        } else if (action === "flashcard_gen") {
          const flashcardContent = extractJSONArray(response.data)
          console.log("Flashcard gen Response data:", response.data)
          console.log("Flashcard gen extracted data:", flashcardContent)
          try {
            // Assuming the response is a string that can be parsed as JSON
            const parsedData =
              typeof flashcardContent === "string"
                ? JSON.parse(flashcardContent)
                : flashcardContent || []

            const finalFlashcardData = Array.isArray(parsedData)
              ? parsedData
              : []
            setFlashcardsData(finalFlashcardData)

            // If response is from AI (not from DB), save it to DB
            if (response.success && response.source === "ai") {
              saveUserContents(action, finalFlashcardData)
            } else if (response.success && response.source === "db") {
              setFlashcardsSaved(true)
            }
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

  // Function to render the saving indicator
  const renderSavingIndicator = () => {
    if (!isSaving) return null

    return (
      <div className="flex items-center gap-2 ml-4 text-neutral-300 animate-pulse">
        <Save size={14} />
        <span className="text-sm">Saving {savingType}...</span>
      </div>
    )
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
            className={`absolute right-24 top-24 ${
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
                {renderSavingIndicator()}
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
            <div className="bg-slate-950 px-3 py-2 flex border-b border-neutral-700">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-1 ${maximize ? "px-4" : "px-3"} py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-neutral-800 text-white"
                      : "hover:bg-neutral-900 text-neutral-300"
                  }`}
                  onClick={() => setActiveTab(tab.id)}>
                  {tab.icon}
                  <span className="text-lg">{tab.label}</span>
                  {tab.id === "summary" && summarySaved && (
                    <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                  {tab.id === "quiz" && quizSaved && (
                    <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                  {tab.id === "flashcards" && flashcardsSaved && (
                    <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
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
                  saved={notesSaved}
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
                  saved={summarySaved}
                  onSave={() =>
                    saveUserContents("videoSummary_Generate", summaryData)
                  }
                />
              )}
              {activeTab === "quiz" && (
                <QuizTab
                  handleSend={handleSend}
                  saveToNotes={saveToNotes}
                  quizData={quizData}
                  quizLoading={quizLoading}
                  saved={quizSaved}
                  onSave={() => saveUserContents("quiz_gen", quizData)}
                />
              )}
              {activeTab === "flashcards" && (
                <FlashcardsTab
                  handleSend={handleSend}
                  saveToNotes={saveToNotes}
                  flashcardsData={flashcardsData}
                  flashcardsLoading={flashcardsLoading}
                  saved={flashcardsSaved}
                  onSave={() =>
                    saveUserContents("flashcard_gen", flashcardsData)
                  }
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
              <div className="px-5 pt-3 pb-4 bg-[#0F0F0F] rounded-b-2xl flex items-center gap-3 border-t border-neutral-800 sticky bottom-0 shadow-lg">
                <input
                  type="text"
                  placeholder="Ask anything about this video..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onKeyUp={(event) => event.stopPropagation()}
                  disabled={loading}
                  className="flex-1 bg-[#1A1A1A] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF0042]/50 border border-neutral-700 text-base placeholder-neutral-500 transition-all"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#FF0042] to-[#FF2D60] hover:from-[#e6003b] hover:to-[#e62857] text-white p-3 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-[0_0_10px_rgba(255,0,66,0.3)]">
                  <Forward size={18} />
                </button>
              </div>
            }

            {/* Drawer for Chat History */}
            {drawerOpen && (
              <div
                ref={drawerRef}
                className={`absolute bottom-0 left-0 right-0 bg-[#121212] border-t border-stone-900 rounded-t-4xl shadow-2xl transition-all duration-300 z-50`}
                style={{ height: drawerHeight }}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-[#0F0F0F]">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-[#FF0042] rounded-full animate-pulse"></div>
                    <span className="font-medium text-lg text-white">
                      Chat History
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={toggleDrawer}
                      className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors">
                      {drawerHeight === "90%" ? (
                        <ChevronDown size={18} className="text-neutral-300" />
                      ) : (
                        <ChevronUp size={18} className="text-neutral-300" />
                      )}
                    </button>
                    <button
                      onClick={toggleDrawer}
                      className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors">
                      <X size={18} className="text-neutral-300" />
                    </button>
                  </div>
                </div>

                {/* Messages area */}
                <div className="overflow-y-auto p-5 h-[calc(100%-110px)] thin-scrollbar bg-gradient-to-b from-[#121212] to-[#151515]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-5 last:mb-2`}>
                      {msg.sender === "bot" && (
                        <div className="h-6 w-6 rounded-full mr-2 self-end border border-neutral-800 overflow-hidden flex-shrink-0 shadow-md">
                          <img
                            src={logo || "/placeholder.svg"}
                            alt="Bot"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[87%] w-auto px-4 py-3 rounded-2xl text-base shadow-md
              ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-[#29060f] to-[#1F0109] text-white rounded-br-sm border border-[#FF0042]/20"
                  : "bg-[#1A1A1A] text-white rounded-bl-sm border border-neutral-800"
              }`}>
                        {
                          <Markdown
                            markdown={msg.text}
                            className="text-neutral-200 w-auto leading-relaxed"
                          />
                        }
                        {msg.sender === "bot" && (
                          <button
                            onClick={() => saveToNotes(msg.text, msg.id)}
                            className="mt-3 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-[#FF0042] transition-colors group">
                            <BookmarkPlus
                              size={14}
                              className="group-hover:scale-110 transition-transform"
                            />
                            <span>Save to Notes</span>
                          </button>
                        )}
                      </div>
                      {msg.sender === "user" && (
                        <div className="h-8 w-8 ml-2 bg-gradient-to-br from-[#FF0042] to-[#CC0036] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <UserRound className="text-white" size={15} />
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input field */}
                <div className="px-5 pt-3 pb-4 bg-[#0F0F0F] rounded-b-2xl flex items-center gap-3 border-t border-neutral-800 sticky bottom-0 shadow-lg">
                  <input
                    type="text"
                    placeholder="Ask follow up..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onKeyUp={(event) => event.stopPropagation()}
                    disabled={loading}
                    className="flex-1 bg-[#1A1A1A] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF0042]/50 border border-neutral-700 text-base placeholder-neutral-500 transition-all"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={loading}
                    className="bg-gradient-to-r from-[#FF0042] to-[#FF2D60] hover:from-[#e6003b] hover:to-[#e62857] text-white p-3 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-[0_0_10px_rgba(255,0,66,0.3)]">
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

export default ChatBotDialog
