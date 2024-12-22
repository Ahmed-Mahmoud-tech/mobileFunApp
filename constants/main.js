export const ENV_STATUS = "stage"
// export const ENV_STATUS = "production"

export const BACKEND_URL =
  ENV_STATUS == "production"
    ? "https://virtualscene.tech"
    : "http://localhost:5000"
