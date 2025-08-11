import axios, { AxiosInstance } from "axios";

let apiInstance: AxiosInstance;

export function getApi(): AxiosInstance {
  if (!apiInstance) {
    apiInstance = axios.create({
      baseURL: (window as any)._env_.API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return apiInstance;
}
