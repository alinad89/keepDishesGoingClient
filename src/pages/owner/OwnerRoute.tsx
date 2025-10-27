// src/owner/OwnerRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useKeycloak } from "@react-keycloak/web";

export default function OwnerRoute() {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return (
            <Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (!keycloak.authenticated) {
        return <Navigate to="/start-owner" replace />;
    }

    return <Outlet />;
}
