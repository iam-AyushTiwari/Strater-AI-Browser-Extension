import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { API_ROUTES } from "~constants"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const storage = new Storage()
  let token = await storage.get("token");

  if (!token) {
    console.log("No token found, fetching new token");
    const getTokenResponse = await fetch(API_ROUTES.GET_TOKEN, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!getTokenResponse.ok) {
      throw new Error('Failed to fetch token');
    }
    const tokenData = await getTokenResponse.json();
    token = tokenData.data;
    await storage.set("token", token);
  } else {
    console.log("Token found in storage:", token);
  }

  try {
    const userResponse = await fetch(API_ROUTES.FETCH_USER, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (userResponse.status === 404) {
      const authStatus = userResponse.headers.get("X-Clerk-Auth-Status");
      if (authStatus === "signed-out") {
        await storage.set("user", null);
        console.log("User is not signed in, setting user to null");
        res.send({
          success: false,
          isLoggedIn: false,
          error: "User is not signed in"
        });
        return;
      }
    }

    if (!userResponse.ok) {
      console.log("Error fetching user data, attempting to refresh token");
      const refreshTokenResponse = await fetch(API_ROUTES.GET_TOKEN, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!refreshTokenResponse.ok) {
        throw new Error('Failed to refresh token');
      }

      const newTokenData = await refreshTokenResponse.json();
      token = newTokenData.data;
      await storage.set("token", token);

      const retryUserResponse = await fetch(API_ROUTES.FETCH_USER, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!retryUserResponse.ok) {
        throw new Error('Failed to fetch user data after token refresh');
      }

      const userData = await retryUserResponse.json();
      await storage.set("user", userData.data);

      res.send({
        success: true,
        isLoggedIn: true,
        user: userData.data
      });
    } else {
      const userData = await userResponse.json();
      await storage.set("user", userData.data);

      res.send({
        success: true,
        isLoggedIn: true,
        user: userData.data
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message
    });
  }
}

export default handler
