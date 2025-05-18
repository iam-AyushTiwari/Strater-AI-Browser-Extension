import { Forward, Paperclip, Smile } from "lucide-react"
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent
} from "react"

interface ChatInputBoxProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  disabled?: boolean
  maxRows?: number
  className?: string
  showAttachmentButton?: boolean
  showEmojiButton?: boolean
}

export default function ChatInputBox({
  value,
  onChange,
  onSend,
  placeholder = "Ask a question...",
  disabled = false,
  maxRows = 5,
  className = "",
  showAttachmentButton = false,
  showEmojiButton = false
}: ChatInputBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [rows, setRows] = useState(1)

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto"

      // Calculate the number of rows based on scrollHeight and line height
      const lineHeight = Number.parseInt(
        getComputedStyle(textareaRef.current).lineHeight
      )
      const paddingTop = Number.parseInt(
        getComputedStyle(textareaRef.current).paddingTop
      )
      const paddingBottom = Number.parseInt(
        getComputedStyle(textareaRef.current).paddingBottom
      )
      const contentHeight =
        textareaRef.current.scrollHeight - paddingTop - paddingBottom

      // Calculate rows (minimum 1, maximum maxRows)
      const calculatedRows = Math.min(
        Math.max(Math.ceil(contentHeight / lineHeight), 1),
        maxRows
      )
      setRows(calculatedRows)

      // Set the height based on scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value, maxRows])

  // Handle key press events (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled) {
        onSend()
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div
      className={`relative flex items-end bg-[#0F0F0F] rounded-xl border border-neutral-800 ${className}`}>
      {/* Left buttons (optional) */}
      {(showAttachmentButton || showEmojiButton) && (
        <div className="flex items-center pl-3 pb-3">
          {showAttachmentButton && (
            <button
              type="button"
              className="p-1.5 text-neutral-400 hover:text-neutral-200 transition-colors"
              disabled={disabled}
              aria-label="Attach file">
              <Paperclip size={18} />
            </button>
          )}
          {showEmojiButton && (
            <button
              type="button"
              className="p-1.5 text-neutral-400 hover:text-neutral-200 transition-colors"
              disabled={disabled}
              aria-label="Insert emoji">
              <Smile size={18} />
            </button>
          )}
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className="flex-1 bg-transparent text-white px-4 py-3 resize-none focus:outline-none text-base placeholder-neutral-500 overflow-auto scrollbar-none"
        style={{ maxHeight: `${maxRows * 1.5}rem` }}
      />

      {/* Send button */}
      <div className="pr-3 pb-3 pl-2">
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className={`bg-gradient-to-r from-[#FF0042] to-[#FF2D60] hover:from-[#e6003b] hover:to-[#e62857] text-white p-2.5 rounded-lg flex items-center justify-center transition-all shadow-md ${
            disabled || !value.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-[0_0_10px_rgba(255,0,66,0.3)]"
          }`}
          aria-label="Send message">
          <Forward size={16} />
        </button>
      </div>
    </div>
  )
}
