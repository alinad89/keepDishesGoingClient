import { Box, Drawer, List, ListItemButton, ListItemText, Typography, Divider, alpha } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";

type NavbarMobileMenuProps = {
    open: boolean;
    onClose: () => void;
    isOwner: boolean;
};

const AccentDot = styled("span")(({ theme }) => ({
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: theme.palette.primary.main,
    boxShadow: `0 0 16px ${alpha(theme.palette.primary.main, 0.9)}`,
}));

export default function NavbarMobileMenu({ open, onClose, isOwner }: NavbarMobileMenuProps) {
    const { pathname } = useLocation();
    const inCustomer = pathname.startsWith("/customer") || pathname.startsWith("/restaurants");

    const menuItems = [
        { to: "/", label: "Home" },
        inCustomer && !isOwner ? { to: "/customer", label: "Restaurants" } : null,
        inCustomer && !isOwner ? { to: "/customer/orders", label: "My Orders" } : null,
        isOwner ? { to: "/owner/orders/pending", label: "Pending Orders" } : null,
        isOwner ? { to: "/owner/orders/accepted", label: "Preparing Orders" } : null,
        { to: "/about", label: "Process" },
        { to: "/contact", label: "Contact" },
        inCustomer && !isOwner ? { to: "/customer/checkout", label: "Basket" } : null,
    ].filter((item): item is { to: string; label: string } => !!item);

    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <Box sx={{ width: 270, p: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                    <AccentDot />
                    <Typography fontWeight={800}>Keep Dishes Going</Typography>
                </Box>
                <Divider sx={{ mb: 1.5 }} />

                <List>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.to}
                            component={RouterLink}
                            to={item.to}
                            onClick={onClose}
                        >
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}
