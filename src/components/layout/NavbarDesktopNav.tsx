import { Box, alpha } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";

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

type NavbarDesktopNavProps = {
    isOwner: boolean;
    isKdg: boolean;
};

export default function NavbarDesktopNav({ isOwner, isKdg }: NavbarDesktopNavProps) {
    const { pathname } = useLocation();
    const inCustomer = pathname.startsWith("/customer") || pathname.startsWith("/restaurants");

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mx: 2 }}>
            <NavLinkStyled to="/" end>Home</NavLinkStyled>
            {inCustomer && !isOwner && !isKdg && (
                <>
                    <NavLinkStyled to="/customer">Restaurants</NavLinkStyled>
                    <NavLinkStyled to="/customer/orders">My Orders</NavLinkStyled>
                </>
            )}
            {isOwner && (
                <>
                    <NavLinkStyled to="/owner/orders/pending">Pending Orders</NavLinkStyled>
                    <NavLinkStyled to="/owner/orders/accepted">Preparing Orders</NavLinkStyled>
                </>
            )}
            {isKdg && (
                <>
                    <NavLinkStyled to="/kdg/price-bands">Price Bands</NavLinkStyled>
                    <NavLinkStyled to="/kdg/price-evolution">Price Evolution</NavLinkStyled>
                </>
            )}
            <NavLinkStyled to="/about">Process</NavLinkStyled>
            <NavLinkStyled to="/contact">Contact</NavLinkStyled>
        </Box>
    );
}
