const endPoint = "https://strater-app.vercel.app/api"
export const API_ENDPOINT = endPoint

export const API_ROUTES = {
    FETCH_USER: `${endPoint}/User/fetch_me`,
    FETCH_CAPSULES: `${endPoint}/Capsules/fetch_capsules`,
    CREATE_CAPSULE: `${endPoint}/Capsules/create_capsule`,
    UPDATE_CAPSULE: `${endPoint}/Capsules/update_capsule`,
    DELETE_CAPSULE: `${endPoint}/Capsules/delete_capsule`,
  };
  
  export const DEFAULT_VALUES = {
    USER: null,
    CAPSULES: [],
    NOTES: [],
    SCHEDULES: [],
  };
  