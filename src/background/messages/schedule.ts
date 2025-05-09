import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { API_ROUTES } from "~constants"

import {
  addSchedule,
  deleteSchedule,
  getAllSchedules,
  updateSchedule
} from "../../../utils/db"

const storage = new Storage()

interface ScheduleItems {
  _id: string
  title: string
  time: string
  duration: number
  status: string
  date: string
  videoId: string
  isCompleted: boolean
}

const setUpdateIndicator = async () => {
  await storage.set("scheduleUpdated", true) // Set the flag to true
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { action, data } = req.body as { action: string; data: ScheduleItems }
  const token =
    "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18ycG5wQnhkZFltMUhzWlhTcFltU29MUlNGZUEiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3ODYxNjQ2NDUsImlhdCI6MTc0NjE2NDY0NSwiaXNzIjoiaHR0cHM6Ly9kZWVwLWRhbmUtMzcuY2xlcmsuYWNjb3VudHMuZGV2IiwianRpIjoiMDliOTE0ZDJiYTI3MGJjMWQ0NjciLCJuYmYiOjE3NDYxNjQ2NDAsInN1YiI6InVzZXJfMnJmRlhmQzg1UGpRdmw5bWRSdHpwRmIwVXVPIn0.VvTQG5Mwj1x5Cmak_DDtQ4xrEJoQChcet5Ti4euKU7FylGIahKD-sViAHP-tj2R5n4dnlQYPDFfihMJzh6XmgB3m2gxTYOnu9WPX76uB7rWfIOnEnvq8cMJ99s0qnPexo0WkF8MJpUazCCZpqwah4CFRE43zSR_F0Ctp52epcXMSwQsz1XZAL0FziVxWqM5uIes553CoA3Nh7DwBgI8u8X3QpBBz9zA_yY3fNt83Ry4XV7mFwH4LbItyS2PPhTPTu11efbIcEPOv1lf3Xwf6L9xCv88BnQ6mV_8AFXb4S-7oQjEpvrQVzx2uNyBXZNibQvPAk-bHRvKDUiGu03oMFQ"
  switch (action) {
    case "ADD_SCHEDULE":
      try {
        console.log("called for add task")
        const response = await fetch(API_ROUTES.CREATE_SCHEDULE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(data)
        })

        const res_data = await response.json()
        console.log("Update res_data ====>", res_data, response.ok)

        if (response.ok) {
          console.log("Schedule created successfully", res_data.data)

          //add schedule to db
          await addSchedule(res_data.data)

          await setUpdateIndicator() // Set the update indicator to true for notification api fetch on update

          res.send({ success: true, data: res_data.data })
        } else {
          console.log("Failed to create schedule", res_data.error)
          res.send({ success: false, error: res_data.error })
        }
      } catch (error) {
        res.send({ success: false, error: (error as Error).message })
      }
      break

    case "GET_SCHEDULES":
      try {
        const cachedSchedules = await getAllSchedules()
        console.log("cachedSchedules====>", cachedSchedules)
        if (cachedSchedules && cachedSchedules.length > 0) {
          console.log("cached schedules found")
          res.send({ success: true, data: cachedSchedules })
          return
        }

        const response = await fetch(API_ROUTES.FETCH_SCHEDULE, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        console.log("data from api====>", data, data.schedules)

        if (response.ok) {
          console.log(
            "Schedule data fetched and data",
            data.schedules
            // dayjs(data.schedules[0].date).utc().format("YYYY-MM-DD")
          )
          // add schedules to the db
          for (const item of data.schedules) {
            await addSchedule(item)
          }

          res.send({ success: true, data: data.schedules })
        } else {
          console.error("Failed to fetch schedule from Api", data.error)
        }
      } catch (error: any) {
        console.error("Error fetching schedule", error)
        res.send({ success: false, error: (error as Error).message })
      }
      break
    case "UPDATE_SCHEDULE":
      try {
        console.log("called for update task in background", data)
        const response = await fetch(API_ROUTES.UPDATE_SCHEDULE, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            _id: data._id,
            title: data.title,
            time: data.time,
            duration: data.duration,
            date: data.date,
            status: data.status,
            videoId: data.videoId,
            isCompleted: data.isCompleted
          })
        })
        console.log("response ====>", response)
        const res_data = await response.json()
        console.log("Update res_data ====>", res_data, response.ok)
        if (response.ok) {
          console.log("Schedule updated successfully", res_data.data)

          // update schedule in the db
          await updateSchedule(res_data.data)

          await setUpdateIndicator() // Set the update indicator to true for notification api fetch on update

          res.send({ success: true, data: res_data.data })
        } else {
          console.log("Failed to update schedule", res_data.error)
          res.send({ success: false, error: res_data.error })
        }
      } catch (error: any) {
        console.log("Error in updating schedules", error?.message)
        res.send({ success: false, error: (error as Error).message })
      }
      break

    case "DELETE_SCHEDULE":
      try {
        const response = await fetch(API_ROUTES.DELETE_SCHEDULE, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ _id: data._id })
        })
        const res_data = await response.json()
        console.log("data====>", data)
        if (response.ok) {
          console.log("Schedule deleted successfully", res_data.data)

          // delete schedule from db
          await deleteSchedule(data._id)

          await setUpdateIndicator() // Set the update indicator to true for notification api fetch on update

          res.send({ success: true, data: res_data.data })
        } else {
          console.error("Failed to delete schedule", res_data.error)
        }
      } catch (error: any) {
        console.log("Error in deleting schedules", error?.message)
        res.send({ success: false, error: (error as Error).message })
      }
      break
    case "FETCH_ALLCASPULEVIDEOS":
      try {
        console.log("Message recieved for get_videos")
        const response = await fetch(API_ROUTES.FETCH_ALLCASPULEVIDEOS, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })

        if (response.ok) {
          const fetchedVideoData = await response.json()
          const videoData = fetchedVideoData.data
          res.send({ success: true, data: videoData })
        }
      } catch (error) {
        console.error("Error fetching video data:", error)
        res.send({ success: false, error: error.message })
      }
      break;
    default:
      res.send({ success: false, error: "Invalid action" })
  }
}

export default handler
