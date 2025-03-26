const endPoint = "https://strater-app.vercel.app/api"
const host = "https://strater-app.vercel.app"
const extensionId = "gfhnlccpnfdhijelnhcmcnjgjfeoolih"
// const endPoint = "http://localhost:3000/api"
// const host = "http://localhost:3000"
export const API_ENDPOINT = endPoint
export const HOST_LINK = host
export const EXTENSION_ID = extensionId

export const API_ROUTES = {
    FETCH_USER: `${endPoint}/User/fetch_me`,
    FETCH_CAPSULES: `${endPoint}/Capsules/fetch_capsules`,
    CREATE_CAPSULE: `${endPoint}/Capsules/create_capsule`,
    UPDATE_CAPSULE: `${endPoint}/Capsules/update_capsule`,
    DELETE_CAPSULE: `${endPoint}/Capsules/delete_capsule`,
    FETCH_ALLCASPULEVIDEOS : `${endPoint}/VideoContent/fetch_video`
  };
  
  export const DEFAULT_VALUES = {
    USER: null,
    CAPSULES: [],
    NOTES: [],
    SCHEDULES: [],
  };
  