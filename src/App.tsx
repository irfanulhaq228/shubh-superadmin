import "./App.css";
import "aos/dist/aos.css";

import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import Login from "./pages/Auth/Login";

import Admins from "./pages/Admins/page";
import Profile from "./pages/profile/page";
import BetsResults from "./pages/Bets-Result";
import Games from "./pages/GamesConfiguration/page";
import BetsResult from "./pages/Bets-Result/bets-result";

function App() {
  const darkTheme = useSelector((state: any) => state.dashboardDarkTheme);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Profile darkTheme={darkTheme} />} />
      <Route path="/admins" element={<Admins darkTheme={darkTheme} />} />
      <Route path="/games" element={<Games darkTheme={darkTheme} />} />
      <Route path="/bets-result" element={<BetsResult darkTheme={darkTheme} />} />
      <Route path="/bets-results" element={<BetsResults darkTheme={darkTheme} />} />
    </Routes>
  );
}

export default App;
