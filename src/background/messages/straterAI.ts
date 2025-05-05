import type { PlasmoMessaging } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";
import callAPI from "utils/api";
import { API_ROUTES } from "~constants";

interface bodySend {
    prompt: string, 
    action: string, 
    videoID: string
    type: string
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
                const dbResponse = await callAPI(`${API_ROUTES.NOTES}?videoId=${body.videoID}&type=${body.type}`, {method: "GET"});
                if (dbResponse.success) {
                    console.log("Got the response from the API", JSON.parse(dbResponse.data).response.content)
                    res.send({success: true, data: JSON.parse(dbResponse.data).response.content});                    
                } 
                if (!dbResponse.success) {
                    console.log("Not found the summary in the DB now calling Strater AI API")
                    const response = await callAPI(API_ROUTES.STRATER_AI, {method: "POST", body: body});
                    console.log("This body will pass in the API call: ", body);
                    if (response) {
                        console.log("Got the response from the API", JSON.parse(response.data).response.content)
                        res.send({success: true, data: JSON.parse(response.data).response.content});
                    }
                }
            } catch (error) {
                res.send({success: false, error: (error as Error).message});
            }
            break;
        case "flashcard_gen":
            try {
                const response = await callAPI(API_ROUTES.STRATER_AI, {method: "POST", body: body});
                console.log("This body will pass in the API call (flash): ", body);
                if (response) {
                    console.log("Got the response from the API", JSON.parse(response.data).response);
                    res.send({success: true, data: JSON.parse(response.data).response});
                }
            } catch (error) {
                res.send({success: false, error: (error as Error).message});
            }
            break;
        case "quiz_gen":
            try {
                const response = await callAPI(API_ROUTES.STRATER_AI, {method: "POST", body: body});
                console.log("This body will pass in the API call (quiz_gen): ", body);
                if (response) {
                    console.log("Got the response from the API", JSON.parse(response.data).response);
                    res.send({success: true, data: JSON.parse(response.data).response});
                }
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