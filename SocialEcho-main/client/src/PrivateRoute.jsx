import { useMemo, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setInitialAuthState } from "./redux/actions/authActions";
import Navbar from "./components/shared/Navbar";
import Leftbar from "./components/shared/Leftbar";
import Rightbar from "./components/shared/Rightbar";
import Hero from "./components/home/Hero";
import { motion, AnimatePresence } from "framer-motion";

import CommunityRightbar from "./components/community/Rightbar";
import ModeratorRightbar from "./components/moderator/Rightbar";
import { getSavedPostsAction } from "./redux/actions/postActions";

const noRightbarRoutes = [
  /\/post\/[^/]+$/,
  /\/community\/[^/]+\/report$/,
  /\/community\/[^/]+\/reported-post$/,
  /\/community\/[^/]+\/moderator$/,
  /\/communities\/create$/,
  /\/chat$/,
].map((regex) => new RegExp(regex));

const PrivateRoute = ({ userData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isCommunityPage = location.pathname.startsWith("/community/");
  
  const isAuthenticated = useMemo(() => {
    return (userData, accessToken) => {
      return userData && accessToken;
    };
  }, []);

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
  const isChat = location.pathname === "/chat";

  const [showLeftbar, setShowLeftbar] = useState(false);

  // Auto-close mobile sidebar on navigation
  useEffect(() => {
    setShowLeftbar(false);
  }, [location.pathname]);

  const toggleLeftbar = () => {
    setShowLeftbar(!showLeftbar);
  };

  return isAuthenticated(userData, accessToken) ? (
    <div className="min-h-screen relative text-white selection:bg-vintage-cyan/30 scroll-smooth">
      {/* Fixed Atmosphere Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-v-red/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[1000px] h-[1000px] bg-v-cyan/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3" />
      </div>

      <Navbar
        userData={userData}
        toggleLeftbar={toggleLeftbar}
        showLeftbar={showLeftbar}
      />

      {/* The Mega Frosted Glass Window */}
      <div className={`relative z-10 w-full max-w-[1600px] mx-auto pt-20 md:pt-24 ${location.pathname === '/' || location.pathname === '/home' ? 'bg-transparent border-none shadow-none' : 'bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-t-[40px] md:rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.7)]'} flex flex-col min-h-[calc(100vh-64px)] ${location.pathname === '/chat' ? 'pb-24 md:pb-0' : 'pb-32 md:pb-20'} overflow-visible`}>
        <div className="flex-1 w-full relative">
          {isHome && <Hero />}

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {showLeftbar && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleLeftbar}
                className="md:hidden fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              />
            )}
          </AnimatePresence>

          {/* Mobile Drawer - Floating on top */}
          <div className={`md:hidden fixed inset-y-0 left-0 w-80 z-[110] pt-24 px-4 transition-all duration-500 transform ${showLeftbar ? 'translate-x-0' : '-translate-x-full invisible'}`}>
            <Leftbar showLeftbar={true} />
          </div>

          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-12 mt-8 relative">
            {/* Desktop Leftbar Sidebar - Hidden on Home and Chat (for tablet spacing) */}
            {!isHome && !isChat && (
              <div className="hidden md:block md:col-span-4 lg:col-span-3">
                <div className="sticky top-8">
                  <Leftbar showLeftbar={false} />
                </div>
              </div>
            )}

            {/* Main Content Area - Responsive Spans for Tablet and PC */}
            <div className={
              isHome || isChat
                ? 'md:col-span-12 lg:col-span-9 w-full' 
                : (showRightbar ? 'md:col-span-8 lg:col-span-6 w-full' : 'md:col-span-8 lg:col-span-9 w-full')
            }>
              <Outlet />
            </div>

            {/* Right Sidebar - PC only */}
            {showRightbar ? (
              <div className="hidden lg:block lg:col-span-3">
                <div className="sticky top-8">
                  {isCommunityPage ? <CommunityRightbar /> : (currentUserIsModerator ? <ModeratorRightbar /> : <Rightbar />)}
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
