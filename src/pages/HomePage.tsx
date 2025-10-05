import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";

const cardBaseStyles = {
    flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 30%" },
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    p: 3,
    textAlign: "center",
    borderRadius: 3,
    backdropFilter: "blur(4px)",
    bgcolor: "rgba(255, 255, 255, 0.75)",
};

function CenteredIcon({ children }: { children: React.ReactNode }) {
    return <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>{children}</Box>;
}

export default function HomePage() {
    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "calc(100vh - 64px)",
                width: "100%",
                px: { xs: 2, md: 8 },
                backgroundImage: `url("./dish.jpg")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >

            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "rgba(241, 248, 233, 0.75)",
                    zIndex: 1,
                }}
            />

            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
                <Box textAlign="center" mb={6}>
                    <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
                        Welcome to Keep Dishes Going
                    </Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={600}>
                        Choose how you want to continue
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
                    <Card elevation={6} sx={cardBaseStyles}>
                        <CenteredIcon>
                            <PersonIcon sx={{ fontSize: 60, color: "primary.main" }} />
                        </CenteredIcon>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Customer
                            </Typography>
                            <Typography color="text.secondary">
                                Explore restaurants and order your favorite meals.
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "center" }}>
                            <Button variant="contained" color="primary" size="large" component={Link} to="/customer">
                                Continue as Customer
                            </Button>
                        </CardActions>
                    </Card>

                    <Card elevation={6} sx={cardBaseStyles}>
                        <CenteredIcon>
                            <StoreIcon sx={{ fontSize: 60, color: "secondary.main" }} />
                        </CenteredIcon>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Owner
                            </Typography>
                            <Typography color="text.secondary">
                                Manage your restaurant, menu and track orders.
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "center" }}>
                            <Button variant="contained" color="secondary" size="large" component={Link} to="/owner">
                                Continue as Owner
                            </Button>
                        </CardActions>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}
