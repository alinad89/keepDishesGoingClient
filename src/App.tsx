// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

import Navbar from "./components/layout/Navbar.tsx";
import HomePage from "./pages/HomePage";
import AuthLanding from "./pages/owner/AuthLanding";
import OwnerRoute from "./pages/owner/OwnerRoute";
import OwnerDashboardPage from "./pages/owner/OwnerDashboardPage";
import CreateRestaurantPage from "./pages/owner/CreateRestaurantPage";
import RestaurantDetailsPage from "./pages/owner/RestaurantDetailsPage";
import CreateDishPage from "./pages/owner/CreateDishPage";
import OwnerDishesPage from "./pages/owner/OwnerDishesPage";
import EditDishDraftPage from "./pages/owner/EditDishDraftPage";
import PendingOrdersPage from "./pages/owner/PendingOrdersPage";
import AcceptedOrdersPage from "./pages/owner/AcceptedOrdersPage";
import CheckoutInfoPage from "./pages/customer/CheckoutInfoPage";
import CustomerApp from "./pages/customer/CustomerApp";
import BrowsePage from "./pages/customer/BrowsePage";
import RestaurantPage from "./pages/customer/RestaurantPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrderTrackingPage from "./pages/customer/OrderTrackingPage";
import CustomerOrdersPage from "./pages/customer/CustomerOrdersPage";
import PaymentSuccessPage from "./pages/customer/PaymentSuccessPage";
import KdgAuthLanding from "./pages/kdg/KdgAuthLanding";
import KdgRoute from "./pages/kdg/KdgRoute";
import KdgDashboardPage from "./pages/kdg/KdgDashboardPage";
import PriceBandsPage from "./pages/kdg/PriceBandsPage";
import PriceEvolutionPage from "./pages/kdg/PriceEvolutionPage";

const queryClient = new QueryClient();

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#22c55e" },
        secondary: { main: "#79d18a" },
        background: { default: "#f1f8f6", paper: "#ffffff" },
        text: { primary: "#0e1211" },
    },
    shape: { borderRadius: 14 },
    typography: {
        fontFamily: '"Inter","Helvetica Neue",Arial,sans-serif',
        h1: { fontSize: "3rem", fontWeight: 800 },
        h2: { fontSize: "2.25rem", fontWeight: 700 },
        button: { textTransform: "none", fontWeight: 700 },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Navbar />

                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/start-owner" element={<AuthLanding />} />
                        <Route path="/start-kdg" element={<KdgAuthLanding />} />

                        <Route path="/owner" element={<OwnerRoute />}>
                            <Route index element={<OwnerDashboardPage />} />
                            <Route path="create-restaurant" element={<CreateRestaurantPage />} />
                            <Route path="restaurants/:id" element={<RestaurantDetailsPage />} />
                            <Route path="restaurants/:id/dishes/new" element={<CreateDishPage />} />
                            <Route path="dishes" element={<OwnerDishesPage />} />
                            <Route path="dishes/:dishId/edit-draft" element={<EditDishDraftPage />} />
                            <Route path="orders/pending" element={<PendingOrdersPage />} />
                            <Route path="orders/accepted" element={<AcceptedOrdersPage />} />
                        </Route>

                        {/* KDG Admin area */}
                        <Route path="/kdg" element={<KdgRoute />}>
                            <Route index element={<KdgDashboardPage />} />
                            <Route path="price-bands" element={<PriceBandsPage />} />
                            <Route path="price-evolution" element={<PriceEvolutionPage />} />
                        </Route>

                        {/* Customer area */}
                        <Route path="/customer" element={<CustomerApp />}>
                            <Route index element={<BrowsePage />} />
                            <Route path="restaurants/:id" element={<RestaurantPage />} />
                            <Route path="checkout" element={<CheckoutPage />} />
                            <Route path="checkout/info" element={<CheckoutInfoPage />} />
                            <Route path="payment/success" element={<PaymentSuccessPage />} />
                            <Route path="orders" element={<CustomerOrdersPage />} />
                            <Route path="orders/:orderId" element={<OrderTrackingPage />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
