import { Tooltip } from "antd"
import { useMainContext } from "contextAPI/MainContext"
import { Eye, Forward, Lock, Maximize, Minimize, X } from "lucide-react"
import { useEditor } from "novel"
import React, { useEffect, useRef, useState } from "react"
import Draggable from "react-draggable"

// @ts-ignore
import logo from "../assets/icon.png"
import Providers from "./Providers"

const DUMMY_MESSAGES = [
  {
    id: 1,
    sender: "bot",
    text: "Hello! 👋 How can I help you today?",
    time: "09:00"
  },
  {
    id: 2,
    sender: "user",
    text: "Hi! Can you tell me about your features?",
    time: "09:01"
  },
  {
    id: 3,
    sender: "bot",
    text: "Absolutely! I can assist with analytics, scheduling, and more. What would you like to try?",
    time: "09:02"
  }
]

const ChatBotDialog = () => {
  const nodeRef = useRef(null)
  const [maximize, setMaximize] = useState(false)
  const [messages, setMessages] = useState(DUMMY_MESSAGES)
  const [input, setInput] = useState("")
  const { chatBotVisible, setChatBotVisible } = useMainContext()
  const [chatBotOpened, setChatBotOpened] = useState(chatBotVisible || false)

  useEffect(() => {
    console.log("Context of the chatBOT updated: ", chatBotVisible)
    setChatBotOpened(chatBotVisible)
  }, [chatBotVisible])

  const handleMaximize = () => {
    setMaximize(!maximize)
  }

  useEffect(() => {}, [])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "user",
        text: input,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }
    ])
    setInput("")
    // Optionally, add a bot response after a delay for prototyping.
  }

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend()
    }

    const keysToBlock = [
      "k", // play
      "m", // mute
      // " ", // play/pause
      "f", // fullscreen
      "j", // previous frame
      "l", // next frame
      "ArrowLeft", // previous video
      "ArrowRight", // next video
      "ArrowUp", // volume up
      "ArrowDown", // volume down
      "0", // volume 0
      "1", // volume 25
      "2", // volume 50
      "3", // volume 75
      "4", // volume 100
      "5", // volume 150
      "6" // volume 200
    ]

    if (keysToBlock.includes(e.key)) {
      e.stopImmediatePropagation()
      e.stopPropagation()
      e.preventDefault()
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
            className={`absolute top-24 left-24 ${maximize ? "w-4/6 h-5/6" : "w-1/5 h-2/3"} max-w-full bg-neutral-900 text-white rounded-2xl shadow-2xl pointer-events-auto flex flex-col transition-all duration-200`}>
            {/* Header */}
            <div className="chatbot-dialog-title cursor-move select-none bg-neutral-800 px-5 py-3 rounded-t-2xl flex items-center justify-between font-semibold text-lg">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Strater AI"
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
                <h1 className="text-2xl">Strater AI</h1>
              </div>
              <div className="options flex gap-3">
                <Tooltip title={`${maximize ? "Minimize" : "Maximize"}`}>
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
                  <Eye size={18} className="cursor-pointer" />
                </Tooltip>
                <Tooltip title="Close">
                  <X
                    size={18}
                    className="cursor-pointer"
                    onClick={() => setChatBotVisible(!chatBotVisible)}
                  />
                </Tooltip>
              </div>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-neutral-950 scroll-smooth thin-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "bot" && (
                    <img
                      src={logo}
                      alt="Bot"
                      className="h-7 w-7 rounded-full mr-2 self-end border border-neutral-700"
                    />
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl text-lg shadow
                      ${
                        msg.sender === "user"
                          ? "bg-[#29060f] text-white rounded-br-md"
                          : "bg-neutral-800 text-white rounded-bl-md"
                      }
                    `}>
                    {msg.text}
                    <div className="text-xs text-neutral-400 mt-1 text-right">
                      {msg.time}
                    </div>
                  </div>
                  {msg.sender === "user" && (
                    <div className="h-7 w-7 ml-2" /> // Placeholder for user avatar if needed
                  )}
                </div>
              ))}
            </div>
            {/* Input */}
            <div className="px-4 py-3 bg-neutral-900 rounded-b-2xl flex items-center gap-2 border-t border-neutral-800">
              {/* Optionally add emoji/attachment icons here */}
              <input
                type="text"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="flex-1 bg-neutral-800 text-white px-4 py-2 rounded-lg focus:outline-none border text-lg border-neutral-700"
              />
              <button
                onClick={handleSend}
                className="bg-[#FF0042] hover:bg-[#e6003b] text-white px-4 py-2 rounded-full flex items-center justify-center transition">
                <Forward size={18} />
              </button>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  )
}

export default ChatBotDialog
