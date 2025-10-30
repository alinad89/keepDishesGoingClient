// src/lib/axiosClient.ts
import axios from "axios";
import keycloak from "../keycloak";

const axiosClient = axios.create({
    baseURL: import.meta.env?.VITE_API_URL ?? "http://localhost:8080/api",
    withCredentials: true, // needed to send cookies to :8080
});

function ensureAnonCookie() {
    // Only set if not already present
    if (typeof document === "undefined") return;
    const hasCookie = document.cookie.includes("anonCustomerId=");
    if (!hasCookie) {
        const id = localStorage.getItem("anonCustomerId");
        if (id) {
            // minimal cookie, same rules you had before
            document.cookie = `anonCustomerId=${id};path=/;SameSite=Lax`;
        }
    }
}

let attached = false;
function attachAuthInterceptor() {
    if (attached) return;
    attached = true;

    axiosClient.interceptors.request.use(async (config) => {
        // Make sure the cookie is present for any backend hit (esp. /orders/…)
        ensureAnonCookie();

        // only add auth for our API calls
        const target = (config.baseURL ?? "") + (config.url ?? "");
        const isOurApi =
            target.startsWith("http://localhost:8080/api") ||
            (import.meta.env?.VITE_API_URL
                ? target.startsWith(String(import.meta.env.VITE_API_URL))
                : false);

        if (isOurApi && keycloak?.authenticated) {
            try {
                await keycloak.updateToken(30);
            } catch {}
            const token = keycloak.token;
            if (token) {
                config.headers = config.headers ?? {};
                (config.headers as any).Authorization = `Bearer ${token}`;
            }
        }
        return config;
    });

    axiosClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                console.error("API Error Response:", {
                    status: error.response.status,
                    data: error.response.data,
                    url: error.config?.url,
                    method: error.config?.method,
                });
                const message =
                    error.response.data?.message ||
                    error.response.data?.error ||
                    `Server error: ${error.response.status}`;
                error.message = message;
            } else if (error.request) {
                console.error("No response from server:", error.request);
                error.message = "No response from server";
            }
            return Promise.reject(error);
        }
    );
}

attachAuthInterceptor();
export default axiosClient;
