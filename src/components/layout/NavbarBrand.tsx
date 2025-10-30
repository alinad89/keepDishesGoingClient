import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";

const Brand = styled(Link)({
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "#e8f8ee",
    fontWeight: 800,
    letterSpacing: ".3px",
});

const AccentDot = styled("span")(({ theme }) => ({
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: theme.palette.primary.main,
    boxShadow: `0 0 16px ${alpha(theme.palette.primary.main, 0.9)}`,
}));

export default function NavbarBrand() {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Brand to="/">
                <AccentDot />
                <Typography variant="h6" sx={{ color: "#eaf6ef" }}>
                    Keep Dishes Going
                </Typography>
            </Brand>
        </Box>
    );
}
