import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { API_ROUTES } from "~constants"

const storage = new Storage()

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { action, data, forceRefresh } = req.body

  try {
    const token = await storage.get("token")
    if (!token) {
      return res.send({
        success: false,
        error: "Authentication token not found"
      })
    }

    // Helper function to fetch capsules from API
    const fetchCapsulesFromApi = async (): Promise<any> => {
      console.log("Fetching capsules from API")
      try {
        const response = await fetch(API_ROUTES.FETCH_CAPSULES, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const responseData = await response.json()

        // Cache the response
        await storage.set("capsules", responseData.data)
        await storage.set("capsulesCacheTimestamp", Date.now())

        return responseData
      } catch (error) {
        console.error("Error fetching capsules:", error)
        throw error
      }
    }

    // Helper function to add capsule to API
    const addCapsulesToApi = async (capsule: any): Promise<any> => {
      try {
        const response = await fetch(API_ROUTES.CREATE_CAPSULE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(capsule)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const responseData = await response.json()
        return responseData
      } catch (error) {
        console.error("Error adding capsule:", error)
        throw error
      }
    }

    // Helper function to update capsule in API
    const updateCapsuleInApi = async (capsule: any): Promise<any> => {
      try {
        const response = await fetch(API_ROUTES.UPDATE_CAPSULE, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(capsule)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const responseData = await response.json()
        return responseData
      } catch (error) {
        console.error("Error updating capsule:", error)
        throw error
      }
    }

    // Helper function to delete capsule from API
    const deleteCapsuleFromApi = async (capsuleId: string): Promise<any> => {
      try {
        const response = await fetch(API_ROUTES.DELETE_CAPSULE, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ capsuleId })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const responseData = await response.json()
        return responseData
      } catch (error) {
        console.error("Error deleting capsule:", error)
        throw error
      }
    }

    // Handle different actions
    switch (action) {
      case "GET_CAPSULES":
        try {
          // Check if we should force refresh from API
          if (forceRefresh) {
            const apiData = await fetchCapsulesFromApi()
            return res.send({ success: true, data: apiData })
          }

          // Try to get from cache first
          const cachedCapsules = await storage.get("capsules")
          const cacheTimestamp = await storage.get("capsulesCacheTimestamp")

          // Use cache if it exists and is less than 5 minutes old
          if (
            cachedCapsules &&
            cacheTimestamp &&
            // @ts-ignore
            Date.now() - cacheTimestamp < 5 * 60 * 1000
          ) {
            console.log("Using cached capsules data")
            return res.send({
              success: true,
              data: { data: cachedCapsules, fromCache: true }
            })
          }

          // Cache is stale or doesn't exist, fetch from API
          const apiData = await fetchCapsulesFromApi()
          return res.send({ success: true, data: apiData })
        } catch (error) {
          console.error("Error in GET_CAPSULES:", error)

          // If API call fails, try to return cached data as fallback
          const cachedCapsules = await storage.get("capsules")
          if (cachedCapsules) {
            return res.send({
              success: true,
              data: { data: cachedCapsules, fromCache: true },
              warning: "Using cached data due to API error"
            })
          }

          return res.send({
            success: false,
            error: error.message || "Failed to fetch capsules"
          })
        }

      case "ADD_CAPSULES":
        try {
          // Send to API first
          const apiResponse = await addCapsulesToApi(data)

          // If successful, update cache with fresh data from API
          await fetchCapsulesFromApi()

          return res.send({
            success: true,
            data: apiResponse
          })
        } catch (error) {
          return res.send({
            success: false,
            error: error.message || "Failed to add capsule"
          })
        }

      case "UPDATE_CAPSULE":
        try {
          // Send to API first
          const apiResponse = await updateCapsuleInApi(data)

          // If successful, update cache with fresh data from API
          await fetchCapsulesFromApi()

          return res.send({
            success: true,
            data: apiResponse
          })
        } catch (error) {
          return res.send({
            success: false,
            error: error.message || "Failed to update capsule"
          })
        }

      case "DELETE_CAPSULE":
        try {
          // Send to API first
          const apiResponse = await deleteCapsuleFromApi(data.capsuleId)

          // If successful, update cache with fresh data from API
          await fetchCapsulesFromApi()

          return res.send({
            success: true,
            data: apiResponse
          })
        } catch (error) {
          return res.send({
            success: false,
            error: error.message || "Failed to delete capsule"
          })
        }

      default:
        return res.send({ success: false, error: "Invalid action" })
    }
  } catch (error) {
    console.error("Unhandled error in handler:", error)
    return res.send({
      success: false,
      error: error.message || "An unexpected error occurred"
    })
  }
}

export default handler
