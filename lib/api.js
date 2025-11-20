import axios from "axios";

// NOTE: The Access Token is managed EXCLUSIVELY in memory via the AuthContext 
// and the setAuthToken bridge. The Refresh Token MUST be in an HTTP-only cookie.

const base_url = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
  baseURL: `${base_url}/api`,
  timeout: 6000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Separate instance used ONLY for the /refresh-token endpoint.
// Must be exported for the AuthContext to use it for Session Resurrection.
export const refreshInstance = axios.create({
  baseURL: base_url,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// --- 1. STATE BRIDGE: In-memory store for the Access Token ---
let currentAccessToken = null;

// Exported function to be called by AuthContext to sync state with Axios
export const setAuthToken = (token) => {
  currentAccessToken = token;
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : null;
}


// --- 2. Concurrency Control ---
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

// --- Request Interceptor: Attach Access Token from MEMORY ---
api.interceptors.request.use(
  (config) => {
    if (currentAccessToken) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 403) {
      return Promise.reject(error); 
    }

    if (status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
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
        const response = await refreshInstance.post("/api/refresh-token"); 

        const { accessToken } = response.data;
        if (!accessToken) {
          throw new Error("Refresh endpoint returned no access token.");
        }

        setAuthToken(accessToken); 
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        return api(originalRequest);
        
      } catch (refreshError) {
        setAuthToken(null);
        processQueue(refreshError, null);
        
        // if (typeof window !== "undefined") {
        //   window.location.href = "/login"; 
        // }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;