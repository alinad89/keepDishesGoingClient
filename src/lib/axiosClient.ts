// src/lib/axiosClient.ts
import axios from "axios";
import keycloak from "../keycloak"; // same instance you pass to ReactKeycloakProvider

const axiosClient = axios.create({
    baseURL: import.meta.env?.VITE_API_URL ?? "http://localhost:8080/api",
    withCredentials: true,
});

// Attach Keycloak token to every API request
let attached = false;
function attachAuthInterceptor() {
    if (attached) return;
    attached = true;

    axiosClient.interceptors.request.use(async (config) => {
        // only add auth for our API calls
        const target = (config.baseURL ?? "") + (config.url ?? "");
        const isOurApi =
            target.startsWith("http://localhost:8080/api") ||
            (import.meta.env?.VITE_API_URL
                ? target.startsWith(String(import.meta.env.VITE_API_URL))
                : false);

        if (isOurApi && keycloak?.authenticated) {
            try {
                await keycloak.updateToken(30); // refresh if expiring in <30s
            } catch {

            }
            const token = keycloak.token;
            if (token) {
                config.headers = config.headers ?? {};
                (config.headers as any).Authorization = `Bearer ${token}`;
            }
        }
        return config;
    });
}

attachAuthInterceptor();

export default axiosClient;
