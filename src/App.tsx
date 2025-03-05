import "./App.css";
import "aos/dist/aos.css";

import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import Login from "./pages/Auth/Login";

import Profile from "./pages/profile/page";
import Admins from "./pages/Admins/page";
import Games from "./pages/GamesConfiguration/page";

function App() {
  const darkTheme = useSelector((state: any) => state.dashboardDarkTheme);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Profile darkTheme={darkTheme} />} />
      <Route path="/admins" element={<Admins darkTheme={darkTheme} />} />
      <Route path="/games" element={<Games darkTheme={darkTheme} />} />
    </Routes>
  );
}

export default App;
