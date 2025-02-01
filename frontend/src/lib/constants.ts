const insideDocker = false

export const BASE_API_URL = insideDocker ? "http://api/v1" : "http://localhost:8000/v1";
export const BASE_MEDIA_URL = insideDocker ? "http://api" : "http://localhost:8000";
