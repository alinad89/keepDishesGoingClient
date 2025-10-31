import { Box, Button } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

type NavbarRightCtasProps = {
    isOwner: boolean;
    isKdg: boolean;
};

export default function NavbarRightCtas({ isOwner, isKdg }: NavbarRightCtasProps) {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();

    const login = () => keycloak.login();
    const logout = () => keycloak.logout();

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {initialized && keycloak?.authenticated ? (
                <>
                    <Button variant="contained" color="primary" onClick={logout}>
                        Logout
                    </Button>

                    {isOwner && (
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<LaunchIcon />}
                            onClick={() => navigate("/owner")}
                        >
                            Owner Console
                        </Button>
                    )}

                    {isKdg && (
                        <Button
                            variant="contained"
                            color="secondary"
                            endIcon={<LaunchIcon />}
                            onClick={() => navigate("/kdg")}
                        >
                            KDG Admin
                        </Button>
                    )}
                </>
            ) : (
                <Button variant="contained" color="primary" onClick={login}>
                    Login
                </Button>
            )}
        </Box>
    );
}
