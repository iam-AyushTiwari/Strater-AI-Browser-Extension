import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { API_ROUTES } from "~constants"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const storage = new Storage()

  try {
    // const token = await storage.get("authToken")
    const response = await fetch(API_ROUTES.FETCH_USER, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response && response.status === 404) {
      const authStatus = response.headers.get("X-Clerk-Auth-Status");

      if (authStatus === "signed-out") {
        storage.getItem("user").then((user) => {
          if (user) {
            storage.setItem("user", null);
            console.log("setting the user null because not signed in");
          }
        })
        res.send({
          success: false,
          isLoggedIn: false,
          error: "User is not signed in"
        });
        return
      }
    } else if (!response.ok) {
      throw new Error('Failed to fetch user data')
    } else {
      console.log("Data Received", response)
    }

    const userData = await response.json()
    console.log("userData Here it is", userData.data)
    await storage.set("user", userData.data)

    res.send({
      success: true,
      isLoggedIn: true,
      user: userData.data
    })
  } catch (error) {
    res.send({
      success: false,
      error: error.message
    })
  }
}

export default handler
