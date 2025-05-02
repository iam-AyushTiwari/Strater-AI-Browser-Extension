const endPoint = " http://localhost:3000/api"
export const API_ENDPOINT = endPoint

export const API_ROUTES = {
    FETCH_USER: `${endPoint}/User/fetch_me`,
    FETCH_CAPSULES: `${endPoint}/Capsules/fetch_capsules`,
    CREATE_CAPSULE: `${endPoint}/Capsules/create_capsule`,
    UPDATE_CAPSULE: `${endPoint}/Capsules/update_capsule`,
    DELETE_CAPSULE: `${endPoint}/Capsules/delete_capsule`,
    FETCH_ALLCASPULEVIDEOS : `${endPoint}/VideoContent/fetch_video`,
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
  