// api/axiosInstance.ts
import axios, { AxiosInstance } from "axios";

let apiInstance: AxiosInstance;

export function getApi(): AxiosInstance {
  if (!apiInstance) {
    apiInstance = axios.create({
      baseURL: (window as any)._env_.API_BASE_URL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // so cookies get sent
    });

    // Response interceptor
    apiInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // hit refresh endpoint
            const { data } = await apiInstance.post("/v1/users/refresh");
            if (data.accessToken) {
              // set new token in headers
              apiInstance.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.accessToken}`;
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${data.accessToken}`;
            }

            return apiInstance(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token failed", refreshError);
            // Redirect to login if refresh fails
            window.location.href = "/login";
          }
        }

        return Promise.reject(error);
      }
    );
  }
  return apiInstance;
}
