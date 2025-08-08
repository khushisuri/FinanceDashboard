import { useMemo } from "react";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { themeSettings } from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./layout/Navbar";
import { Box } from "@mui/material";
import Dashboard from "./pages/Dashboard";

function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box p={"1rem 2rem"} height={"100%"}>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Dashboard/>}></Route>
            <Route
              path="/predictions"
              Component={<div>Predictions</div>}
            ></Route>
          </Routes>
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
