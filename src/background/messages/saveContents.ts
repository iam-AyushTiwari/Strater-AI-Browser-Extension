import callAPI from "utils/api"

import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { API_ROUTES } from "~constants"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { body, type } = req.body

  switch (type) {
    case "videoSummary_Generate":
      console.log("Saved action for video summary!", type, body)
      try {
        const response = await callAPI(API_ROUTES.SUMMARY, {
          method: "POST",
          body: body
        })
        if (response.success) {
          res.send({ success: true, message: "Summary Saved Successfully!" })
        }
      } catch (error) {
        res.send({ success: false, error: error })
      }
      break
    case "quiz_gen":
      console.log("Saved action for video quiz!", type, body)
      try {
        const response = await callAPI(API_ROUTES.QUIZ, {
          method: "POST",
          body: body
        })
        if (response.success) {
          res.send({ success: true, message: "Quiz Saved Successfully!" })
        }
      } catch (error) {
        res.send({ success: false, error: error })
      }
      break
    case "flashcard_gen":
      console.log("Saved action for video flashcards!", type, body)
      try {
        const response = await callAPI(API_ROUTES.FLASHCARD, {
          method: "POST",
          body: body
        })
        if (response.success) {
          res.send({ success: true, message: "Flashcard Saved Successfully!" })
        }
      } catch (error) {
        res.send({ success: false, error: error })
      }
      break
  }
}

export default handler
