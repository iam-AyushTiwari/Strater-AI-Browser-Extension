import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { API_ROUTES } from "~constants"

const storage = new Storage()

interface ScheduleItems {
  _id: string
  title: string
  time: string
  duration: number
  status: string
  date: string
  videoId:string
  isCompleted: boolean
}

const setUpdateIndicator = async () => {
  await storage.set("scheduleUpdated", true); // Set the flag to true
};

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { action, data } = req.body as { action: string; data: ScheduleItems }
  const token = await storage.get("token");
  switch (action) {
    case "ADD_SCHEDULE":
      try {
        console.log("called for add task")
        // const scheduleData: ScheduleItems[] = (await storage.getItem("schedules")) || []
        const response = await fetch(API_ROUTES.CREATE_SCHEDULE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(data),
        });

        const res_data = await response.json();
        console.log("Update res_data ====>", res_data, response.ok)

        if (response.ok) {
          // if (scheduleData && scheduleData.length > 0) {
          //   const updatedScheduleData = [...scheduleData, res_data.data]
          //   try {
          //     await storage.setItem("schedules", updatedScheduleData)
          //   } catch (storageError) {
          //     console.error("Failed to save schedules to local storage", storageError);
          //   }
          // } else {
          //   try {
          //     await storage.setItem("schedules", [res_data.data])
          //   } catch (storageError) {
          //     console.error("Failed to save schedules to local storage", storageError);
          //   }
          // }
          console.log("Schedule created successfully", res_data.data);

          await setUpdateIndicator(); // Set the update indicator to true for notification api fetch on update
          
          res.send({ success: true, data: res_data.data });
        } else {
          console.log("Failed to create schedule", res_data.error);
          res.send({ success: false, error: res_data.error });
        }
      } catch (error) {
        res.send({ success: false, error: (error as Error).message })
      }
      break

    case "GET_SCHEDULES":
      try {
        // const scheduleData: ScheduleItems[] = (await storage.getItem("schedules")) || []
        // if (scheduleData && scheduleData.length > 0) {
        //   console.log("Schedule data from storage", scheduleData)
        //   res.send({ success: true, data: scheduleData })
        //   return
        // }
        const response = await fetch(API_ROUTES.FETCH_SCHEDULE, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        });
        const data = await response.json();
        console.log("data====>", data,data.schedules)

        if (response.ok) {
          console.log(
            "Schedule data fetched and data",
            data.schedules,
            // dayjs(data.schedules[0].date).utc().format("YYYY-MM-DD")
          );
          if (data.schedules && data.schedules.length > 0) {
           try { await storage.setItem("schedules", data.schedules);
          } catch (storageError) {
            console.error("Failed to save schedules to local storage", storageError);
          }
          res.send({ success: true, data: data.schedules });
          }
          else {
            res.send({ success: true, data: [] });
          }
        } else {
          console.error("Failed to fetch schedule from Api", data.error);
        }
      } catch (error:any) {
        console.error("Error fetching schedule", error);
        res.send({ success: false, error: (error as Error).message })
      }
      break
    case "UPDATE_SCHEDULE":
      try {
        // const scheduleData: ScheduleItems[] = (await storage.getItem("schedules")) || []

        console.log("called for update task in background",data)
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
          }),
        });
        console.log("response ====>", response)
        const res_data = await response.json();
        console.log("Update res_data ====>", res_data, response.ok)
        if(response.ok) {
          // if((scheduleData && scheduleData.length > 0) && res_data.data) {
          //   const updatedScheduleData = scheduleData.filter((item) => item._id !== res_data._id? item : res_data.data)
          //   try{
          //   await storage.setItem("schedules", updatedScheduleData)
          //   }
          //   catch (storageError) {
          //     console.error("Failed to save schedules to local storage", storageError);
          //   }
          // }
          console.log("Schedule updated successfully", res_data.data);

          await setUpdateIndicator(); // Set the update indicator to true for notification api fetch on update

          res.send({ success: true, data: res_data.data });
        }
        else {
          console.log("Failed to update schedule", res_data.error);
          res.send({ success: false, error: res_data.error });
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
          body: JSON.stringify({ _id: data._id }),
        });
        const res_data = await response.json();
        console.log("data====>", data)
        if (response.ok) {
          // const scheduleData: ScheduleItems[] = (await storage.getItem("schedules")) || []
          // if (scheduleData && scheduleData.length > 0) {
          //   const updatedScheduleData = scheduleData.filter((item) => item._id !== res_data._id)
          //   try {
          //     await storage.setItem("schedules", updatedScheduleData)
          //   } catch (storageError) {
          //     console.error("Failed to save schedules to local storage", storageError);
          //   }
          // }
          console.log("Schedule deleted successfully", res_data.data);

          await setUpdateIndicator(); // Set the update indicator to true for notification api fetch on update

          res.send({ success: true, data: res_data.data });
        } else {
          console.error("Failed to delete schedule", res_data.error);
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
    default:
      res.send({ success: false, error: "Invalid action" })
  }
}

export default handler
