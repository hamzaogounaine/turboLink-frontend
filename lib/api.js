import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
  baseURL: `${base_url}/api`,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// A separate, standard axios instance for the refresh token call.
// Must include withCredentials to send the HTTP-only cookie.
const refreshInstance = axios.create({
  baseURL: base_url,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403) {
      console.error("🚫 403 Forbidden. User lacks necessary permissions.");

      // You might clear the token and redirect to login, or just redirect to a
      // specific 'Access Denied' page, depending on your app's flow.
      localStorage.removeItem("accessToken");

      if (typeof window !== "undefined") {
        // Redirect to /login or a dedicated /access-denied page
        window.location.href = "/login";
      }

      // Stop execution and reject the promise
      return Promise.reject(error);
    }
    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Attempting token refresh...");

        // Call refresh endpoint - cookie is sent automatically due to withCredentials
        const response = await refreshInstance.post("/api/refresh-token");

        console.log("✅ Token refresh successful");

        const { accessToken } = response.data;

        if (!accessToken) {
          throw new Error("No access token in response");
        }

        // Store new access token
        localStorage.setItem("accessToken", accessToken);

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);

        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
