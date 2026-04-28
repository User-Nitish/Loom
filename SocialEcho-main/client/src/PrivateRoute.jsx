import { useMemo, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setInitialAuthState } from "./redux/actions/authActions";
import Navbar from "./components/shared/Navbar";
import Leftbar from "./components/shared/Leftbar";
import Rightbar from "./components/shared/Rightbar";
import Hero from "./components/home/Hero";

import ModeratorRightbar from "./components/moderator/Rightbar";
import { getSavedPostsAction } from "./redux/actions/postActions";

const noRightbarRoutes = [
  /\/post\/[^/]+$/,
  /\/community\/[^/]+$/,
  /\/community\/[^/]+\/report$/,
  /\/community\/[^/]+\/reported-post$/,
  /\/community\/[^/]+\/moderator$/,
  /\/communities\/create$/,
  /\/chat$/,
].map((regex) => new RegExp(regex));

const PrivateRoute = ({ userData }) => {
  const isAuthenticated = useMemo(() => {
    return (userData, accessToken) => {
      return userData && accessToken;
    };
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("profile");
  const accessToken = JSON.parse(token)?.accessToken;

  const currentUserIsModerator = userData?.role === "moderator";

  useEffect(() => {
    if (!isAuthenticated(userData, accessToken)) {
      dispatch(setInitialAuthState(navigate));
    } else {
      dispatch(getSavedPostsAction());
    }
  }, [dispatch, navigate, userData, accessToken, isAuthenticated]);

  const showRightbar = !noRightbarRoutes.some((regex) =>
    regex.test(location.pathname)
  );

  const isHome = location.pathname === "/" || location.pathname === "/home";

  const [showLeftbar, setShowLeftbar] = useState(false);

  const toggleLeftbar = () => {
    setShowLeftbar(!showLeftbar);
  };

  return isAuthenticated(userData, accessToken) ? (
    <div className="min-h-screen relative p-4 md:p-8 bg-gradient-to-br from-vintage-ink via-vintage-maroon to-vintage-teal/80 text-white selection:bg-vintage-cyan/30 scroll-smooth">
      {/* Fixed Atmosphere Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-v-red/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[1000px] h-[1000px] bg-v-cyan/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3" />
      </div>

      {/* The Mega Frosted Glass Window */}
      <div className={`relative z-10 w-full max-w-[1600px] mx-auto pt-24 ${location.pathname === '/' || location.pathname === '/home' ? 'bg-transparent border-none shadow-none' : 'bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.7)]'} flex flex-col min-h-[calc(100vh-64px)] ${location.pathname === '/chat' ? 'pb-0' : 'pb-20'} overflow-visible`}>

        <Navbar
          userData={userData}
          toggleLeftbar={toggleLeftbar}
          showLeftbar={showLeftbar}
        />

        <div className="flex-1 w-full relative">
          {isHome && <Hero />}

          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-12 mt-8 relative">
            {/* Conditional Leftbar - Hidden on Home */}
            {!isHome && (
              <div className="md:block md:col-span-3">
                <div className="sticky top-8">
                  <Leftbar showLeftbar={showLeftbar} />
                </div>
              </div>
            )}

            {showLeftbar && !isHome && (
              <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={toggleLeftbar}>
                <div className="w-3/4 max-w-sm h-full" onClick={e => e.stopPropagation()}>
                  <Leftbar showLeftbar={showLeftbar} />
                </div>
              </div>
            )}

            <div className={isHome ? 'md:col-span-9 w-full' : (showRightbar ? 'md:col-span-6 w-full' : 'md:col-span-9 w-full')}>
              <Outlet />
            </div>

            {showRightbar ? (
              <div className="hidden md:block md:col-span-3">
                <div className="sticky top-8">
                  {currentUserIsModerator ? <ModeratorRightbar /> : <Rightbar />}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/signin" />
  );
};

export default PrivateRoute;
