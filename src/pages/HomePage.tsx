import { Box, Typography, Paper, Stack, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                p: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    p: 5,
                    textAlign: "center",
                    borderRadius: 3,
                    maxWidth: 500,
                    width: "100%",
                }}
            >
                <Typography variant="h2" gutterBottom color="primary">
                    Keep Dishes Going
                </Typography>
                <Typography variant="h6" gutterBottom color="text.secondary">
                    Fresh, reliable food ordering – anytime, anywhere
                </Typography>

                <Stack spacing={2} direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <Button
                        component={Link}
                        to="/owner"
                        variant="outlined"
                        color="primary"
                        sx={{
                            px: 3,
                            fontWeight: "bold",
                            textDecoration: "none",
                            "&:hover": {
                                backgroundColor: "primary.main",
                                color: "white",
                                borderColor: "primary.main",
                            },
                        }}
                    >
                        Continue as Owner
                    </Button>

                    <Button
                        component={Link}
                        to="/customer"
                        variant="outlined"
                        color="primary"
                        sx={{
                            px: 3,
                            fontWeight: "bold",
                            textDecoration: "none",
                            "&:hover": {
                                backgroundColor: "primary.main",
                                color: "white",
                                borderColor: "primary.main",
                            },
                        }}
                    >
                        Continue as Customer
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
