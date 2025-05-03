import Markdown from "utils/markdown"

// @ts-ignore
import logo from "../../../assets/icon.png"

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mt-3 mb-4">
      <div className="h-8 w-8 rounded-full flex-shrink-0 border border-neutral-800 overflow-hidden shadow-md">
        <img
          src={logo || "/placeholder.svg"}
          alt="Bot"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="max-w-[87%] bg-[#1A1A1A] px-4 py-3 rounded-2xl rounded-bl-sm border border-neutral-800 shadow-md">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="h-3.5 w-3.5 bg-[#FF0042] rounded-full animate-pulse" />
            <div
              className="h-3.5 w-3.5 bg-[#FF0042] mx-1 rounded-full animate-pulse"
              style={{ animationDelay: "300ms" }}
            />
            <div
              className="h-3.5 w-3.5 bg-[#FF0042] rounded-full animate-pulse"
              style={{ animationDelay: "600ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
