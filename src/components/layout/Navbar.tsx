import {
    AppBar, Toolbar, Box, IconButton, Typography, Drawer, List,
    ListItemButton, ListItemText, alpha, Button, useMediaQuery, Divider
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { styled, useTheme } from "@mui/material/styles";
import { NavLink, Link, Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { useMemo, useState } from "react";
import Badge from "@mui/material/Badge";
import { useBasket } from "../../hooks/customer/useBasket.ts";

const GlassAppBar = styled(AppBar)(() => ({
    position: "fixed", // pinned and non-floating
    top: 0,
    left: 0,
    right: 0,
    background: "rgba(15, 18, 17, 0.75)", // semi-transparent charcoal
    backdropFilter: "blur(20px) saturate(180%)", // strong blur + subtle vibrance
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    transition: "background 0.3s ease, box-shadow 0.3s ease",
}));


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

const NavLinkStyled = styled(NavLink)(({ theme }) => ({
    color: alpha(theme.palette.common.white, 0.85),
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: 999,
    fontWeight: 600,
    "&.active": {
        color: "#0b0f0e",
        background: alpha(theme.palette.primary.main, 0.85),
    },
    "&:hover": {
        color: theme.palette.common.white,
        background: alpha(theme.palette.common.white, 0.08),
    },
}));

export default function Navbar() {
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
    const [open, setOpen] = useState(false);
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // Determine if user is viewing customer area
    const inCustomer =
        pathname.startsWith("/customer") || pathname === "/" || pathname.startsWith("/restaurants");

    // 🔹 Check if logged-in user is an owner
    const isOwner = initialized && keycloak?.authenticated && keycloak.hasRealmRole("owner");

    // Fetch basket only in customer area and not for owners
    const { basket } = useBasket({ enabled: inCustomer && !isOwner });

    const count = useMemo(
        () => (basket?.items ?? []).reduce((sum, it: any) => sum + (it.quantity ?? 0), 0),
        [basket?.items]
    );

    const login = () => keycloak.login();
    const logout = () => keycloak.logout();

    const RightCtas = (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {initialized && keycloak?.authenticated ? (
                <>
                    <Button variant="contained" color="primary" onClick={logout}>
                        Logout
                    </Button>

                    {/* 👑 Only show Owner Console if the user has the owner role */}
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
                </>
            ) : (
                <Button variant="contained" color="primary" onClick={login}>
                    Login
                </Button>
            )}
        </Box>
    );

    return (
        <>
            <GlassAppBar>
                <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 3 }, gap: 2 }}>
                    {/* left: brand */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                        <Brand to="/">
                            <AccentDot />
                            <Typography variant="h6" sx={{ color: "#eaf6ef" }}>
                                Keep Dishes Going
                            </Typography>
                        </Brand>
                    </Box>

                    {/* center navigation */}
                    {!isMdDown && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mx: 2 }}>
                            <NavLinkStyled to="/" end>Home</NavLinkStyled>
                            <NavLinkStyled to="/customer">Restaurants</NavLinkStyled>
                            <NavLinkStyled to="/about">Process</NavLinkStyled>
                            <NavLinkStyled to="/contact">Contact</NavLinkStyled>
                        </Box>
                    )}

                    <Box sx={{ flexGrow: 1 }} />


                    {!isOwner && (
                        <IconButton
                            component={RouterLink}
                            to="/customer/checkout"
                            color="inherit"
                            aria-label="Basket"
                            sx={{ mr: 1 }}
                        >
                            <Badge badgeContent={count} color="primary" showZero max={99}>
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    )}

                    {RightCtas}
                </Toolbar>
            </GlassAppBar>

            {/* 📱 mobile drawer */}
            <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 270, p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                        <AccentDot />
                        <Typography fontWeight={800}>Keep Dishes Going</Typography>
                    </Box>
                    <Divider sx={{ mb: 1.5 }} />

                    <List>
                        {(
                            [
                                { to: "/", label: "Home" },
                                { to: "/customer", label: "Restaurants" },
                                { to: "/about", label: "Process" },
                                { to: "/contact", label: "Contact" },
                                // 🧺 Show basket only if NOT owner
                                !isOwner ? { to: "/customer/checkout", label: "Basket" } : null,
                            ].filter(
                                (item): item is { to: string; label: string } => !!item
                            )
                        ).map((item) => (
                            <ListItemButton
                                key={item.to}
                                component={RouterLink}
                                to={item.to}
                                onClick={() => setOpen(false)}
                            >
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}
