import type { PlasmoMessaging } from "@plasmohq/messaging";
import callAPI from "utils/api";
import { API_ROUTES } from "~constants";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const body: any = req.body;

    if (!body) {
        res.send({success: false, error: "No body found"});
        return;
    } else if (!body.action) {
        res.send({success: false, error: "No action found"});
        return;
    }

    switch(body.action) {
        case "saveChanges":
            console.log("Got bg script called for =>> saveChanges", body.notes)
            try {
                const reqBody = {
                    videoId: body.videoId,
                    snippets: body.notes
                }
                console.log("reqBody for save notes changes ===>", reqBody)
                const response = await callAPI(API_ROUTES.NOTES, {method: "POST", body: reqBody});
                if (response) {
                    console.log("saved notes changes response ===>", response)
                    res.send({success: true, data: "Your Notes Saved Succesfully"});
                }
            } catch (error) {
                res.send({success: false, error: (error as Error).message});
            }
            break;
        case "getAllNotes":
            console.log("Got bg script called for =>> getAllNotes")
            try {
                const response = await callAPI(API_ROUTES.NOTES, {method: "GET"});
                if (response) {
                    console.log("got all notes response ===>", response)
                    res.send({success: true, data: response});
                }
            } catch (error) {
                res.send({success: false, error: (error as Error).message});
            }
            break;
        case "getVideoNotes":
            console.log("Got bg script called for =>> getVideoNotes")
            try {
                const response = await callAPI(`${API_ROUTES.NOTES}?videoId=${body.videoId}`, {method: "GET"});
                if (response) {
                    console.log("got video notes response ===>", response)
                    res.send({success: true, data: response.data});
                }
            } catch (error) {
                res.send({success: false, error: (error as Error).message});
            }
            break;
        case "test":
            console.log("Got bg script called for =>> test", body.videoId + " ** " + body.action)
            res.send({success: true, data: "Dumy response for testing"});
            break;
        default:
            res.send({success: false, error: "Unknown action"});
            break;
    }
}

export default handler
