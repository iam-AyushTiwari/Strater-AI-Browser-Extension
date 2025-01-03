// import { useRootContext } from "contextAPI/RootState"
// import { useContext, useEffect } from "react"

// const FocusMode = () => {
//   const { isFocusMode } = useRootContext()

//   useEffect(() => {
//     if (isFocusMode) {
//       const elementsToHide = document.querySelectorAll(
//         ".ytp-title-link, .ytp-time-display, .ytp-button, .ytp-ad-overlay-container, .ytp-sponsorships, .video-ads, #related, #movie_player .ytp-gradient-top, #movie_player .ytp-gradient-bottom, #movie_player .ytp-gradient-left, #movie_player .ytp-gradient-right"
//       )
//       elementsToHide.forEach((element) => {
//         element.style.display = "none"
//       })
//     }
//   }, [isFocusMode])

//   return null
// }

// export default FocusMode
