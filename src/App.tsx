
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Navbar from "./component/Navbar.tsx";

const queryClient = new QueryClient()

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#247329" },
        secondary: { main: "#579F5A" },
        background: {
            default: "#f1f8f6",
            paper: "#ffffff",
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        h1: { fontSize: "3rem", fontWeight: 700, color: "#1f7025" },
        h2: { fontSize: "2.25rem", fontWeight: 600, color: "#155819" },
        h6: { fontSize: "1.45rem", fontWeight: 600, color: "#2f773d" },
        body1: { fontSize: "1.1rem", fontWeight: 400, color: "#124314" },
        button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                    transition: "all 0.3s ease",
                },
                containedPrimary: {
                    backgroundColor: "rgba(36, 115, 41, 0.1)",
                    color: "#247329",
                    "&:hover": {
                        backgroundColor: "#247329",
                        color: "#fff",
                    },
                },
                containedSecondary: {
                    backgroundColor: "rgba(87, 159, 90, 0.1)",
                    color: "#579F5A",
                    "&:hover": {
                        backgroundColor: "#579F5A",
                        color: "#fff",
                    },
                },
            },
        },
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
                        <Route path="/" element={<HomePage/>} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default App