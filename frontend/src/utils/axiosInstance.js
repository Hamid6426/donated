import axios from "axios";
import useAuthStore from "../stores/authStore"; // assuming you have this for logout

// Create an instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // <-- sends cookies (access + refresh)
});

let isRefreshing = false;
let failedQueue = [];

// Process the queue (resolve/reject)
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error); // Reject the queued promise
    } else {
      prom.resolve(token); // Resolve with the new token
    }
  });
  failedQueue = []; // Clear the queue
};

axiosInstance.interceptors.response.use(
  (res) => res, // Normal response
  async (err) => {
    const originalRequest = err.config;

    // If token expired (401) and not already refreshing
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If a refresh is in progress, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest)) // Retry the request after refresh
          .catch((error) => Promise.reject(error));
      }

      // Start refreshing the token
      isRefreshing = true;

      try {
        // Make a request to refresh the token
        await axiosInstance.get("/auth/refresh-token"); // Assuming this updates access token in cookies

        // Process the queue after refreshing the token
        processQueue(null);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        // If refreshing fails, process the queue with the error
        processQueue(refreshErr, null);
        
        // Trigger logout in case of failure
        const logout = useAuthStore.getState().logout;
        logout(); // Clear the auth state

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false; // Reset the refreshing state
      }
    }

    return Promise.reject(err); // Reject all other errors
  }
);

export default axiosInstance;
