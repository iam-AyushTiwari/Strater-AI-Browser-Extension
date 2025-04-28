// import type { PlasmoMessaging } from "@plasmohq/messaging";
// import { Storage } from "@plasmohq/storage";
// import { API_ENDPOINT, API_ROUTES, SUMMARY_TYPE } from "~constants";

// const storage = new Storage();

// const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
//     console.log("Notes section script is called");

//     const { action, videoID } = req.body;

//     switch (action) {
//         case "GET_SUMMARY":
//             console.log("Fetching notes for videoID:", videoID);
//             try {
//                 const noteInStorage = await storage.getItem(videoID);
//                 // @ts-ignore
//                 if (noteInStorage && noteInStorage.data !== null) {
//                     console.log("Note retrieved from storage for videoID:", videoID);
//                     res.send({ success: true, data: noteInStorage });
//                     return;
//                 }

//                 const summaryResponse = await fetch(API_ROUTES.STRATER_AI, {
//                     method: "POST",
//                     body: JSON.stringify({
//                         "prompt" : SUMMARY_TYPE.DETAILED_SUMMARY,
//                         "action" : "null",
//                         "videoID": videoID
//                     }),
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 if (!summaryResponse.ok) {
//                     throw new Error(`HTTP error! Status: ${summaryResponse.status} - ${summaryResponse.statusText}`);
//                 }

//                 const summary = await summaryResponse.json();
//                 console.log("Summary fetched from API for videoID:", videoID);

//                 await storage.setItem(videoID, summary.data);
//                 console.log("Summary stored in storage for videoID:", videoID);

//                 res.send({ success: true, data: summary.data });
//             } catch (error) {
//                 console.error("Error in getting notes for videoID:", videoID, error);
//                 res.send({ success: false, error: (error as Error).message });
//             }
//             break;
//         default:
//             console.log("Unknown action from Notes Section:", action);
//             res.send({ success: false, error: "Unknown action" });
//             break;
//     }
// };

// export default handler;
