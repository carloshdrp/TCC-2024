import "./index.css";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/Profile.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PrivateRoutes } from "./utils/PrivateRoute.jsx";
import { PublicRoutes } from "./utils/PublicRoute.jsx";
import Questions from "./pages/Questions.jsx";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />

        <Route path="forum" element={<Questions />} />

        <Route element={<PublicRoutes />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
