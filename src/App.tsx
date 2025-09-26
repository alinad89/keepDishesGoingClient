import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Navbar from "./component/Navbar.tsx";

const queryClient = new QueryClient()

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#2e7d32",
        },
        secondary: {
            main: "#81c784",
        },
        background: {
            default: "#f1f8f6",
            paper: "#ffffff",
        },
        error: {
            main: "#d32f2f",
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: "2.5rem",
            fontWeight: 600,
            color: "#2e7d32",
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 500,
            color: "#388e3c",
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
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