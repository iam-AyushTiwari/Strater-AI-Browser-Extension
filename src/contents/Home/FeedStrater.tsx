import { NotesFolder } from "components/feed/NotesFolder"
import { TodaySchedule } from "components/feed/TodaySchedule"
import Providers from "components/Providers"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId
} from "plasmo"
import React, { useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getStyle = () => {
  let updatedCssText = tailwindcss.replaceAll(":root", ":host(plasmo-csui)")
  const style = document.createElement("style")
  style.textContent = antdResetCssText + updatedCssText
  return style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.querySelectorAll(
    "#primary .ytd-two-column-browse-results-renderer"
  )[0],
  insertPosition: "afterend"
})

export const getShadowHostId: PlasmoGetShadowHostId = () => "feed-strater-csui"

const FeedStrater = () => {
  useEffect(() => {
    const shadowRoot = document
      .querySelector("#feed-strater-csui")
      .shadowRoot.querySelector("#plasmo-shadow-container")
    if (shadowRoot) {
      console.log("got the shadow root", shadowRoot)
      // @ts-ignore
      shadowRoot.style.zIndex = "inherit"
    } else {
      console.log("shadowRoot not found")
    }
  }, [])
  return (
    <Providers>
      <div
        className="w-full p-8 bg-none text-white flex justify-center items-center mb-0"
        style={{ height: "calc(100vh - 70px)" }}>
        <div className="grid grid-cols-2 w-full marker:gap-8">
          <div className="w-full p-4">
            <TodaySchedule />
          </div>
          <div className="w-full p-40 text-white flex justify-center items-center text-4xl font-extrabold">
            Coming Soon..
          </div>
          <div className="w-full p-4">
            <NotesFolder />
          </div>
          <div className="w-full p-40 text-white flex justify-center items-center text-4xl font-extrabold">
            Coming Soon..
          </div>
        </div>
      </div>
    </Providers>
  )
}

export default FeedStrater
