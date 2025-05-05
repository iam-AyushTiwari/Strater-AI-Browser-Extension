import React from "react"

const Loader = ({ eventText }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-10 transition-opacity duration-300">
      <div className="relative w-16 h-16 mb-5">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FF0042]/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[#FF0042] rounded-full animate-spin"></div>
      </div>
      <p className="text-neutral-300 font-medium text-xl">{eventText}</p>
    </div>
  )
}

export default Loader
