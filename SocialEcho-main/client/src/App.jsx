/**
 * Project Name: Loom
 * Description: A social networking platform with automated content moderation and context-based authentication system.
 */

import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import FallbackLoading from "./components/loader/FallbackLoading";
import { publicRoutes, privateRoutes } from "./routes";

import PrivateRoute from "./PrivateRoute";
import SignIn from "./pages/SignIn";

import CinematicBackground from "./components/shared/CinematicBackground";
import SmoothScroll from "./components/layout/SmoothScroll";
import PageTransition from "./components/layout/PageTransition";

const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminSignIn = lazy(() => import("./pages/AdminSignIn"));

const App = () => {
  const userData = useSelector((state) => state.auth?.userData);
  const adminAccessToken = JSON.parse(
    localStorage.getItem("admin")
  )?.accessToken;

  const location = useLocation();

  return (
    <SmoothScroll>
      <CinematicBackground />
      <Suspense fallback={<FallbackLoading />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route element={<PrivateRoute userData={userData} />}>
              {privateRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>

            {publicRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            <Route
              path="/signin"
              element={userData ? <Navigate to="/" /> : <SignIn />}
            />

            <Route
              path="/admin/signin"
              element={
                adminAccessToken ? <Navigate to="/admin" /> : <AdminSignIn />
              }
            />

            <Route
              path="/admin"
              element={
                adminAccessToken ? <AdminPanel /> : <Navigate to="/admin/signin" />
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </SmoothScroll>
  );
};

export default App;
