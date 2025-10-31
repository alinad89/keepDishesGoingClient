import { AppBar, Toolbar, Box, IconButton, useMediaQuery, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { styled, useTheme } from "@mui/material/styles";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { useState } from "react";
import { useBasket } from "../../hooks/customer/useBasket.ts";
import NavbarBrand from "./NavbarBrand.tsx";
import NavbarDesktopNav from "./NavbarDesktopNav.tsx";
import NavbarRightCtas from "./NavbarRightCtas.tsx";
import NavbarMobileMenu from "./NavbarMobileMenu.tsx";

const GlassAppBar = styled(AppBar)(() => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    background: "rgba(15, 18, 17, 0.75)",
    backdropFilter: "blur(20px) saturate(180%)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    transition: "background 0.3s ease, box-shadow 0.3s ease",
}));

export default function Navbar() {
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
    const [open, setOpen] = useState(false);
    const { keycloak, initialized } = useKeycloak();
    const { pathname } = useLocation();

    // Determine if user is viewing customer area (exclude homepage)
    const inCustomer =
        pathname.startsWith("/customer") || pathname.startsWith("/restaurants");

    // Check if logged-in user is an owner or KDG admin
    const isOwner = Boolean(initialized && keycloak?.authenticated && keycloak.hasRealmRole("owner"));
    const isKdg = Boolean(initialized && keycloak?.authenticated && keycloak.hasRealmRole("kdg"));

    // Fetch basket only in customer area and not for owners/kdg
    const { basket } = useBasket({ enabled: inCustomer && !isOwner && !isKdg });

    const availableItems = basket?.availableItems ?? [];
    const blockedItems = basket?.blockedItems ?? [];
    const allItems = [...availableItems, ...blockedItems];
    const count = allItems.reduce((sum, it) => sum + (it.quantity ?? 0), 0);

    return (
        <>
            <GlassAppBar>
                <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 3 }, gap: 2 }}>
                    <NavbarBrand />

                    {!isMdDown && <NavbarDesktopNav isOwner={isOwner} isKdg={isKdg} />}

                    <Box sx={{ flexGrow: 1 }} />

                    {inCustomer && !isOwner && !isKdg && (
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

                    <NavbarRightCtas isOwner={isOwner} isKdg={isKdg} />
                </Toolbar>
            </GlassAppBar>

            <NavbarMobileMenu open={open} onClose={() => setOpen(false)} isOwner={isOwner} />
        </>
    );
}
