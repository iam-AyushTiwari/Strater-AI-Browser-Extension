// const endPoint = "https://strater-app.vercel.app/api"
// const host = "https://strater-app.vercel.app"
const extensionId = "gfhnlccpnfdhijelnhcmcnjgjfeoolih"
const endPoint = "http://localhost:3000/api"
const host = "http://localhost:3000"
export const API_ENDPOINT = endPoint
export const HOST_LINK = host
export const EXTENSION_ID = extensionId

export const API_ROUTES = {
    FETCH_USER: `${endPoint}/User/fetch_me`,
    GET_TOKEN : `${endPoint}/hello`,
    FETCH_CAPSULES: `${endPoint}/Capsules/fetch_capsules`,
    CREATE_CAPSULE: `${endPoint}/Capsules/create_capsule`,
    UPDATE_CAPSULE: `${endPoint}/Capsules/update_capsule`,
    DELETE_CAPSULE: `${endPoint}/Capsules/delete_capsule`,
    FETCH_ALLCASPULEVIDEOS : `${endPoint}/VideoContent/fetch_video`,
    FETCH_SUMMARY: `${endPoint}/video_summary`, 
    STRATER_AI: `${endPoint}/Strater_AI/agent_call`,

    // for user contents constants
    NOTES: `${endPoint}/user_content/notes`,

    // schedules
    CREATE_SCHEDULE: `${endPoint}/Schedule/create_schedule`,
    FETCH_SCHEDULE: `${endPoint}/Schedule/fetch_schedule`,
    DELETE_SCHEDULE: `${endPoint}/Schedule/delete_schedule`,
    UPDATE_SCHEDULE: `${endPoint}/Schedule/update_schedule`,
    FETCH_VIDEOS: `${endPoint}/VideoContent/fetch_video`,
  };
  
  export const DEFAULT_VALUES = {
    USER: null,
    CAPSULES: [],
    NOTES: [],
    SCHEDULES: [],
  };  