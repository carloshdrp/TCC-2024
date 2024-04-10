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
import Forum from "./pages/Forum.jsx";
import Logout from "./pages/Logout.jsx";
import Exercises from "./pages/Exercises.jsx";
import ProfileEdit from "./pages/ProfileEdit.jsx";
import { ForumAskCreate } from "./pages/ForumAskCreate.jsx";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />

        <Route path="forum" element={<Forum />} />
        <Route path="exercises" element={<Exercises />} />

        <Route element={<PublicRoutes />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<ProfileEdit />} />

          <Route path="forum/ask" element={<ForumAskCreate />} />

          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
