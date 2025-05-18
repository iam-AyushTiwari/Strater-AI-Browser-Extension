import callAPI from "utils/api"

import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { API_ROUTES } from "~constants"

interface bodySend {
  prompt: string
  action: string
  videoID: string
  type: string
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { body } = req.body as { body: bodySend }

  switch (body.action) {
    case "null":
      try {
        const response = await callAPI(API_ROUTES.STRATER_AI, {
          method: "POST",
          body: body
        })
        console.log("This body will pass in the API call: ", body)
        if (response) {
          console.log(
            "Got the response from the API",
            JSON.parse(response.data).response
          )
          res.send({ success: true, data: JSON.parse(response.data).response })
        }
      } catch (error) {
        res.send({ success: false, error: (error as Error).message })
      }
      break
    case "videoSummary_Generate":
      try {
        const dbResponse = await callAPI(
          `${API_ROUTES.SUMMARY}?videoId=${body.videoID}&type=${body.type}`,
          { method: "GET" }
        )
        if (dbResponse.success) {
          console.log(
            "Got the response from the API ===> DB",
            dbResponse.data.response,
            dbResponse
          )
          res.send({
            success: true,
            data:
              dbResponse.data.response ||
              JSON.parse(dbResponse.data.response).response.content,
            source: "db"
          })
        }
        if (!dbResponse.success) {
          console.log(
            "Not found the summary in the DB now calling Strater AI API"
          )
          const response = await callAPI(API_ROUTES.STRATER_AI, {
            method: "POST",
            body: body
          })
          console.log("This body will pass in the API call: ", body)
          if (response) {
            console.log(
              "Got the response from the API ===> AI",
              JSON.parse(response.data).response.content
            )
            res.send({
              success: true,
              data: JSON.parse(response.data).response.content,
              source: "ai"
            })
          }
        }
      } catch (error) {
        res.send({ success: false, error: (error as Error).message })
      }
      break
    case "flashcard_gen":
      try {
        const dbResponse = await callAPI(
          `${API_ROUTES.FLASHCARD}?videoId=${body.videoID}`,
          { method: "GET" }
        )
        if (dbResponse.success) {
          console.log("Fresh Response ==> ", dbResponse.data)
          console.log("Got the response from the API", dbResponse.data.response)
          res.send({
            success: true,
            data: dbResponse.data.response,
            source: "db"
          })
        }
        if (!dbResponse.success) {
          console.log(
            "Not found the flashcard in the DB now calling Strater AI API"
          )
          const response = await callAPI(API_ROUTES.STRATER_AI, {
            method: "POST",
            body: body
          })
          console.log("This body will pass in the API call (flash): ", body)
          if (response) {
            console.log(
              "Got the response from the API",
              JSON.parse(response.data).response
            )
            res.send({
              success: true,
              data: JSON.parse(response.data).response,
              source: "ai"
            })
          }
        }
      } catch (error) {
        res.send({ success: false, error: (error as Error).message })
      }
      break
    case "quiz_gen":
      try {
        const dbResponse = await callAPI(
          `${API_ROUTES.QUIZ}?videoId=${body.videoID}`,
          { method: "GET" }
        )
        if (dbResponse.success) {
          console.log("Fresh Response ==> ", dbResponse.data)
          console.log(
            "Got the response from the API ==> DB",
            dbResponse.data.response
          )
          res.send({
            success: true,
            data: dbResponse.data.response,
            source: "db"
          })
        }
        if (!dbResponse.success) {
          console.log("Not found the quiz in the DB now calling Strater AI API")
          const response = await callAPI(API_ROUTES.STRATER_AI, {
            method: "POST",
            body: body
          })
          console.log(
            "This body will pass in the API call (quiz_gen): ==> AI",
            body
          )
          if (response) {
            console.log(
              "Got the response from the API",
              JSON.parse(response.data).response
            )
            res.send({
              success: true,
              data: JSON.parse(response.data).response,
              source: "ai"
            })
          }
        }
      } catch (error) {
        res.send({ success: false, error: (error as Error).message })
      }
      break
    default:
      res.send({ success: false, error: "Unknown action" })
      break
  }
}

export default handler

// https://www.youtube.com/watch?v=KCrXgy8qtjM&t
