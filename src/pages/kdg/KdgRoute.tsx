// src/pages/kdg/KdgRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";
import { useEnsureKdg } from "../../hooks/kdg/useEnsureKdg";

export default function KdgRoute() {
    const { keycloak, initialized } = useKeycloak();
    const { ensureKdgAccount } = useEnsureKdg();

    useEffect(() => {
        if (initialized && keycloak.authenticated) {
            ensureKdgAccount();
        }
    }, [initialized, keycloak.authenticated, ensureKdgAccount]);

    if (!initialized) {
        return (
            <Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (!keycloak.authenticated) {
        return <Navigate to="/start-kdg" replace />;
    }

    return <Outlet />;
}
