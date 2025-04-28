import type { PlasmoMessaging } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";
import { API_ROUTES } from "~constants";

interface bodySend {
    prompt: string, 
    action: string, 
    videoID: string
    type: string
}

const storage = new Storage();

const callAPI = async <T = any>(url: string, options: {method?: string, body?: any} = {}) => {
    const token = await storage.get("token");

    const response = await fetch(url, {
        method: options.method || "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = (await response.json()) as T;

    return data;
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const {body} = req.body as {body: bodySend};

    switch(body.action) {
        case "null":
            try {
                const response = await callAPI(API_ROUTES.STRATER_AI, {method: "POST", body: body});
                console.log("This body will pass in the API call: ", body);
                if (response) {
                    console.log("Got the response from the API", JSON.parse(response.data).response);
                    res.send({success: true, data: JSON.parse(response.data).response});
                }
            } catch (error) {
                res.send({success: false, error: (error as Error).message});
            }
            break;
        case "videoSummary_Generate":
            try {
                const response = await callAPI(API_ROUTES.STRATER_AI, {method: "POST", body: body});
                console.log("This body will pass in the API call: ", body);
                if (response) {
                    console.log("Got the response from the API", JSON.parse(response.data).response.content)
                    res.send({success: true, data: JSON.parse(response.data).response.content});
                }
            } catch (error) {
                res.send({success: false, error: (error as Error).message});
            }
            break;
        case "flashcard_gen":
            try {
                console.log("This body will pass in the API call: ", body);
                res.send({success: true, data: "Hello World! Got your flashcard here!"});
            } catch (error) {
                res.send({success: false, error: (error as Error).message});
            }
            break;
        case "quiz_gen":
            try {
                console.log("This body will pass in the API call: ", body);
                res.send({success: true, data: "Hello World! Got your quiz here!"});
            } catch (error) {
                res.send({success: false, error: (error as Error).message});
            }
            break;
        default:
            res.send({success: false, error: "Unknown action"});
            break;
    }

}

export default handler