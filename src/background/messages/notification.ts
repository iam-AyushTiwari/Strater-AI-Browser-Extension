import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from "dayjs/plugin/utc"
import { API_ROUTES } from "~constants"
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Storage } from "@plasmohq/storage";

dayjs.extend(utc);
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime)

const storage = new Storage()

// Utility: Send a browser notification using chrome.notifications API
const fetchSchedules = async () =>{
  const token = await storage.get("token");
  const res = await fetch(API_ROUTES.FETCH_SCHEDULE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch schedules");
  }

  const json = await res.json();
  const data = json.schedules;
  //filter today schedules
  const today = dayjs().utc().startOf("day"); // Start of today's date in UTC

  const filteredSchedules = data.filter((schedule: any) => {
    const scheduleDate = dayjs(schedule.date).utc().startOf("day"); // Start of the schedule's date in UTC
    return scheduleDate.isSame(today, "day"); // Compare only the "day" unit
  });
  await storage.set("cachedSchedules", filteredSchedules);

  // Reset the update indicator
  await storage.set("scheduleUpdated", false);
  return filteredSchedules;
}
const notify = (title: string, message: string) => {
  if (chrome && chrome.notifications) {
    chrome.notifications.create({
      type: "basic",
      title,
      message,
      iconUrl: "https://strater-app.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FStrater-logo.568de61c.png&w=96&q=75", // Replace with the path to your icon file
    });
  } else {
    console.warn("Notifications are not supported in this environment.");
  }
};

const sentNotifications = new Set<string>();

// Fetch and check schedules
const checkSchedule = async () => {
  

  try {
    console.log("Interval hitted........")
    const notificationPermission = (await storage.get("notification"))
    if(notificationPermission === undefined){
      await storage.set("notification", false); // Initialize the flag
    }
    // api call happen in first run only 
    if (!notificationPermission) {
      console.log("Notification permission not granted")
      return
    }
    const scheduleUpdated = await storage.get("scheduleUpdated")
    if (scheduleUpdated === undefined) {
      await storage.set("scheduleUpdated", true); // Initialize the flag
    }
    console.log("Schedule updated:", scheduleUpdated)

    let schedules;
    if (scheduleUpdated) {
      // Fetch updated schedules from the API
      console.log("from api>>>")
      schedules = await fetchSchedules();
    } else {
      // Use cached schedules
      console.log("from cache>>>")
      schedules = (await storage.get("cachedSchedules")) || [];
    }

    console.log("Schedule data:", schedules);

    const now = dayjs().utc();

    schedules.forEach((schedule) => {
      const scheduleTime = dayjs(
        `${schedule.date.split("T")[0]} ${schedule.time}`,
        "YYYY-MM-DD HH:mm"
      ).utc();

      if (now.isSame(scheduleTime, "minute")) {
        const notificationId = `${schedule._id}-${scheduleTime.toISOString()}`;


        if (!sentNotifications.has(notificationId)) {
          notify("Task Reminder!! 🎯", schedule.title || "Your scheduled session is starting!");
          sentNotifications.add(notificationId);
        }
      }
    });
   } catch (e) {
      console.error("Error checking schedule:", e);
    }
  };
   

// Run every minute
setInterval(checkSchedule, 60000)
checkSchedule() // Initial call

export default checkSchedule
