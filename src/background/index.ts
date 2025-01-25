// console.log("HELLO WORLD FROM BGSCRIPTS")

// const fetchData = async () => {
//   try {
//     const response = await fetch("https://strater-app.vercel.app/api/User/fetch_me", {
//       method: "GET",
//       credentials: "include"
//     })
//     const data = await response?.json()
//     // Assuming setUser is defined elsewhere
//     console.log("user ******", data)
//   } catch (error) {
//     console.error("Error fetching user data:", error)
//   }
// }
 
// fetchData()


import type { PlasmoMessaging } from "@plasmohq/messaging";
import { apiRequest } from "../../utils/api";

export type RequestBody = {
  action: string; // Action to perform
  url: string; // API endpoint
  method?: "GET" | "POST" | "PUT" | "DELETE"; // HTTP method
  body?: Record<string, any>; // Optional request payload
};

export type ResponseBody = {
  success: boolean; // Indicates success
  data?: any; // Response data
  error?: string; // Error message (if any)
};

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {
  const { action, url, method, body } = req.body;

  if (action === "callApi") {
    try {
      const response = await apiRequest({
        url,
        method,
        body,
      });

      if (response.success) {
        res.send({
          success: true,
          data: response.data,
        });
      } else {
        res.send({
          success: false,
          error: response.error,
        });
      }
    } catch (err) {
      res.send({
        success: false,
        error: `Unexpected Error: ${err.message}`,
      });
    }
  } else {
    res.send({
      success: false,
      error: "Invalid action",
    });
  }
};

export default handler;



