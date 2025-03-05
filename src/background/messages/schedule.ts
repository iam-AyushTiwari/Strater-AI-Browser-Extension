import type { PlasmoMessaging } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";

const storage = new Storage();

interface ScheduleItems {
  id: string
  title: string
  time: string
  duration: number
  status: string
  date: string
}

const handler: PlasmoMessaging.MessageHandler = async (req, res)=>{
    const { action,data} = req.body as {action: string; data: ScheduleItems};

    switch(action){
        case "ADD_SCHEDULE":
            try{
                const schedules : ScheduleItems[] = (await storage.getItem("schedules"))|| []
                schedules.push(data)
                await storage.setItem("schedules",schedules)
                res.send({success: true, data: schedules})
            }
            catch(error){
                res.send({success: false, error: (error as Error).message})
            }
            break;
    
    case "GET_SCHEDULES":
        try {
            const schedules: ScheduleItems[] = (await storage.getItem("schedules")) || [];
            console.log("Message recieved for get_schedule")
            res.send({ success: true, data: schedules });
        } catch (error) {
            console.log("Error in getting schedules", error)
            res.send({ success: false, error: (error as Error).message });
        }
        break;
    case "UPDATE_SCHEDULE":
        try {
            const schedules: ScheduleItems[] = (await storage.getItem("schedules")) || [];
            const index = schedules.findIndex((schedule) => schedule.id === data.id);
            //if schedule not found then : 
            if (index === -1){
                res.send({ success: false, error: "Schedule not found" });
                return;
            }
            schedules[index] = data;
            await storage.setItem("schedules", schedules);
            res.send({ success : true, data: schedules})

        } catch (error:any) {
            console.log("Error in updating schedules", error?.message)
            res.send({ success: false, error: (error as Error).message})
        }
        break;

        case "DELETE_SCHEDULE":
         try {
            const schedules: ScheduleItems[] = await storage.getItem("schedules") || [];
            const index = schedules.findIndex((schedule) => schedule.id === data.id);
            if (index === -1) {
                res.send({ success: false, error: "Schedule not found" });
                return;
            }
            schedules.splice(index, 1);
            await storage.setItem("schedules", schedules);
            res.send({ success: true, data: schedules });
         } catch (error:any) {
            console.log("Error in deleting schedules", error?.message)
            res.send({ success: false, error: (error as Error).message });
         }
         break;
        default:
            res.send({ success: false, error: "Invalid action" });
    }     
}

export default handler;