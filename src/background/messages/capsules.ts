import type { PlasmoMessaging } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";
import { API_ROUTES } from "~constants";

const storage = new Storage();

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { action, data } = req.body;

  const token = await storage.get("token");

  const fetchCapsulesFromApi = async (): Promise<any[]> => {
    try {
      console.log("Background function is called for fetching capsules");
      const response = await fetch(API_ROUTES.FETCH_CAPSULES, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      return responseData;
    } catch (error) {
      console.error("Error fetching capsules:", error);
      return [];
    }
  };

  const addCapsulesToApi = async (capsule: any): Promise<any> => {
    try {
      const response = await fetch(API_ROUTES.CREATE_CAPSULE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(capsule),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData: any = await response.json();

      return responseData;
    } catch (error) {
      console.error("Error adding capsule:", error);
      throw error;
    }
  };

  const updateCapsuleInApi = async (capsule: any): Promise<any> => {
    try {
      const response = await fetch(API_ROUTES.UPDATE_CAPSULE, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(capsule),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData: any = await response.json();

      return responseData;
    } catch (error) {
      console.error("Error updating capsule:", error);
      throw error; 
    }
  };

  const deleteCapsuleFromApi = async (capsuleId: string): Promise<void> => {
    try {
      const response = await fetch(API_ROUTES.DELETE_CAPSULE, {
        credentials: "include",
        method: "DELETE",
        body: JSON.stringify({ capsuleId: capsuleId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting capsule:", error);
      throw error; 
    }
  };

  switch (action) {
    case "ADD_CAPSULES":
      try {
        // Optimistically update local storage
        const capsules: any[] = (await storage.getItem("capsules")) || [];
        capsules.push(data);
        await storage.setItem("capsules", capsules);
        res.send({ success: true, data: capsules });

        // Then sync with the backend
        try {
          await addCapsulesToApi(data);
        } catch (apiError) {
          console.error("API error adding capsule, reverting local storage:", apiError);
          // Revert local storage if API call fails
          const updatedCapsules = capsules.filter((capsule) => capsule.id !== data.id);
          await storage.setItem("capsules", updatedCapsules);

          // Notify the client of the failure
          res.send({ success: false, error: (apiError as Error).message });
          return;
        }
      } catch (error) {
        res.send({ success: false, error: (error as Error).message });
      }
      break;
    case "GET_CAPSULES":
      try {
        // Get capsules from local storage
        console.log("GET CAPSULES event will be handled");
        let capsules: any[] = (await storage.getItem("capsules")) || [];

        console.log("Capsules in Local storage: ", capsules);

        // If local storage is empty, fetch from API and update local storage
        if (capsules.length === 0) {
          try {
            capsules = await fetchCapsulesFromApi();
            await storage.setItem("capsules", capsules);
            console.log("Capsules from Backend server: ", capsules);
          } catch (apiError) {
            console.error("API error fetching capsules:", apiError);
            // If API call fails, return an empty array from local storage
            res.send({ success: true, data: [] });
            return;
          }
        }

        res.send({ success: true, data: capsules });
      } catch (error) {
        res.send({ success: false, error: (error as Error).message });
      }
      break;
    case "UPDATE_CAPSULE":
      try {
        // Optimistically update local storage
        const capsules: any[] = (await storage.getItem("capsules")) || [];
        const index = capsules.findIndex((capsule) => capsule.id === data.id);
        if (index === -1) {
          res.send({ success: false, error: "Capsule not found" });
          return;
        }
        capsules[index] = data;
        await storage.setItem("capsules", capsules);
        res.send({ success: true });

        // Then sync with the backend
        try {
          await updateCapsuleInApi(data);
        } catch (apiError) {
          console.error("API error updating capsule, reverting local storage:", apiError);
          // Revert local storage if API call fails
          const updatedCapsules = [...capsules];
          updatedCapsules[index] = capsules[index]; // Revert to old data
          await storage.setItem("capsules", updatedCapsules);

          // Notify the client of the failure
          res.send({ success: false, error: (apiError as Error).message });
          return;
        }
      } catch (error) {
        res.send({ success: false, error: (error as Error).message });
      }
      break;
    case "DELETE_CAPSULE":
      try {
        // Optimistically update local storage
        const capsules: any[] = (await storage.getItem("capsules")) || [];
        const index = capsules.findIndex((capsule) => capsule.id === data.id);
        if (index === -1) {
          res.send({ success: false, error: "Capsule not found" });
          return;
        }
        capsules.splice(index, 1);
        await storage.setItem("capsules", capsules);
        res.send({ success: true, data: capsules });

        // Then sync with the backend
        try {
          await deleteCapsuleFromApi(data.id);
        } catch (apiError) {
          console.error("API error deleting capsule, reverting local storage:", apiError);
          // Revert local storage if API call fails
          capsules.splice(index, 0, data); // Add back the deleted item
          await storage.setItem("capsules", capsules);

          // Notify the client of the failure
          res.send({ success: false, error: (apiError as Error).message });
          return;
        }
      } catch (error) {
        res.send({ success: false, error: (error as Error).message });
      }
      break;
    default:
      res.send({ success: false, error: "Invalid action" });
  }
};

export default handler;

