import { Tooltip } from "antd"
import { useMainContext } from "contextAPI/MainContext"
import { SquareArrowOutUpRight } from "lucide-react"
import React, { useEffect } from "react"
import { MdArrowUpward } from "react-icons/md"

// @ts-ignore
import logo from "../assets/icon.png"
import Providers from "./Providers"

const StraterAI = () => {
  const { chatBotVisible, setChatBotVisible } = useMainContext()

  return (
    <div>
      {!chatBotVisible && (
        // <Tooltip title={"AI Campanion"} placement="left">
        //   <div className="fixed bottom-0 right-0 mb-6 mr-6">
        //     <button
        //       className="bg-gradient-to-r from-[#FF0042] to-[#FF0042]/90 hover:from-[#FF0042] hover:to-[#FF0042]/70 text-white rounded-full p-4 drop-shadow-md transition-all"
        //       onClick={() => setChatBotVisible(!chatBotVisible)}>
        //       <img
        //         src={logo}
        //         alt="Strater AI"
        //         className="h-8 w-8 rounded-full border-2 border-white"
        //       />
        //     </button>
        //   </div>
        // </Tooltip>

        <div className="fixed bottom-0 right-0 mr-6">
          <div
            className="chatbot-dialog-title cursor-pointer select-none bg-neutral-800 px-5 py-3 rounded-t-2xl flex items-center justify-between font-semibold text-lg text-white gap-6"
            onClick={() => setChatBotVisible(!chatBotVisible)}>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Strater AI"
                className="h-6 w-6 rounded-full border-2 border-white"
              />
              <h1 className="text-xl">Strater AI</h1>
            </div>
            <div className="options flex gap-3">
              <Tooltip title="Open AI Campanion">
                <SquareArrowOutUpRight
                  size={18}
                  className="cursor-pointer"
                  onClick={() => setChatBotVisible(!chatBotVisible)}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StraterAI
