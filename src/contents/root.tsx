// import tailwindcss from "data-text:~style.css"
// import antdResetCssText from "data-text:antd/dist/reset.css"
// import type { PlasmoGetInlineAnchor } from "plasmo"

import tailwindcss from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"

// export const getStyle = () => {
//   const style = document.createElement("style")
//   style.textContent = antdResetCssText + tailwindcss
//   return style
// }

// export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
//   element: document.querySelector("head"),
//   insertPosition: "beforeend"
// })

/// code for body and apply mutation observer on body for any changes appear such as modal and all

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

const observer = new MutationObserver(() => {
  const modal = document.querySelector(".ant-modal-mask")
  // if (modal) {
  //   // @ts-ignore
  //   // modal.style.zIndex = "9999999999999"
  //   // console.log("modal found")
  // } else {
  //   // console.log("modal not found")
  // }

  const sideBar = document.querySelector(".ant-drawer-body")
  if (sideBar) {
    // @ts-ignore
    const style = document.createElement("style")
    style.textContent = tailwindcss
    sideBar.appendChild(style)
    console.log("sideBar found")
  } else {
    console.log("sideBar not found")
  }
})

observer.observe(document.body, {
  childList: true,
  subtree: true
})
