// src/pages/kdg/KdgAuthLanding.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useKeycloak } from "@react-keycloak/web";

export default function KdgAuthLanding() {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();

    useEffect(() => {
        if (!initialized) return;

        if (!keycloak.authenticated) {
            keycloak.login({ redirectUri: window.location.origin + "/kdg" });
        } else {
            navigate("/kdg");
        }
    }, [keycloak, initialized, navigate]);

    return (
        <Box
            minHeight="80vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={3}
        >
            <CircularProgress size={60} />
            <Typography variant="h5" color="text.secondary">
                Redirecting to KDG Admin login...
            </Typography>
        </Box>
    );
}
