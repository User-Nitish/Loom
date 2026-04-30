import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Search from "./Search";
import { memo } from "react";
import { logoutAction } from "../../redux/actions/authActions";
import NotificationDropdown from "../layout/NotificationDropdown";
import {
  Home,
  Compass,
  Bookmark,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Search as SearchIcon,
  Bell,
  MessageCircle,
  ShieldAlert,
  Plus,
} from "lucide-react";
import { openCreatePostModalAction } from "../../redux/actions/uiActions";
import { io } from "socket.io-client";

const Navbar = ({ userData, toggleLeftbar, showLeftbar }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { unreadCount } = useSelector((state) => state.notifications);
  const socket = useRef(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    // Initialize Socket.io
    const SOCKET_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
    socket.current = io(SOCKET_URL);

    if (userData?._id) {
      socket.current.emit("join_user", userData._id);
      if (userData.role === "admin") {
        socket.current.emit("join_admin");
      }
    }

    socket.current.on("new_notification", (notification) => {
      dispatch({ type: "NEW_NOTIFICATION", payload: notification });
    });

    socket.current.on("moderation_alert", (report) => {
      // If the user is on the AdminReports page, we can refresh it or show a toast
      console.log("Moderation Alert:", report);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [userData, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (!event.target.closest(".notification-trigger")) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const logout = async () => {
    setLoggingOut(true);
    await dispatch(logoutAction());
    setLoggingOut(false);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/communities", label: "Explore" },
    { path: "/saved", label: "Saved" },
    { path: "/following", label: "Network" },
  ];

  // Mobile Nav Items
  const mobileNavItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/communities", icon: Compass, label: "Explore" },
    { path: "CREATE_POST", icon: Plus, label: "Create", special: true },
    { path: "/saved", icon: Bookmark, label: "Saved" },
    { path: "/following", icon: Users, label: "Network" },
  ];

  return (
    <>
      {/* 1. MOBILE TOP HEADER (Fixed Top) */}
      <motion.div 
        className="md:hidden fixed top-0 left-0 right-0 h-16 z-[100] flex items-center justify-between px-6 pointer-events-auto rounded-b-[32px]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          background: "rgba(10, 10, 10, 0.6)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        {(location.pathname !== "/" && location.pathname !== "/home") ? (
          <button
            className="p-2 rounded-xl bg-white/5 text-white/60 active:scale-95 transition-all"
            onClick={toggleLeftbar}
          >
            {showLeftbar ? <X size={20} /> : <Menu size={20} />}
          </button>
        ) : (
          <Link to="/" className="flex items-center p-2 group">
            <img src="/loom.png" alt="L" className="h-7 w-auto object-contain" />
            <span className="text-2xl font-black tracking-tighter text-white leading-none -ml-1">oom</span>
          </Link>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-white/40 active:scale-90 transition-all"
          >
            <SearchIcon size={20} />
          </button>
          
          <div className="relative notification-trigger">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-white/40 active:scale-90 transition-all"
            >
              <Bell size={20} className={unreadCount > 0 ? "animate-wiggle" : ""} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-v-red" />
              )}
            </button>
          </div>

          <Link to="/profile" className="relative h-8 w-8 rounded-full border border-white/20 overflow-hidden active:scale-90 transition-all">
            <img src={userData.avatar} alt="" className="w-full h-full object-cover" />
          </Link>
        </div>
      </motion.div>

      {/* 2. MOBILE BOTTOM COMMAND DOCK (Fixed Bottom) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-[100] pointer-events-none">
        <motion.nav 
          className="w-full h-16 rounded-[32px] flex items-center justify-around px-2 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          style={{
            background: "rgba(15, 15, 15, 0.6)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            if (item.special) {
              return (
                <button
                  key={item.label}
                  onClick={() => dispatch(openCreatePostModalAction())}
                  className="relative -mt-12 w-14 h-14 rounded-2xl bg-v-red text-white flex items-center justify-center shadow-[0_0_30px_rgba(250,38,38,0.4)] active:scale-90 transition-all"
                >
                  <Icon size={28} strokeWidth={3} />
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 p-2 transition-all active:scale-90"
              >
                <Icon 
                  size={20} 
                  className={isActive ? "text-v-red" : "text-white/30"} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? "text-v-red" : "text-white/20"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </motion.nav>
      </div>

      {/* 3. DESKTOP/TABLET NAVIGATION (Fixed Top) */}
      <div className="hidden md:flex fixed bottom-0 md:fixed md:top-0 md:bottom-auto left-0 w-full z-50 justify-center pb-6 md:pt-6 md:pb-0 px-6 pointer-events-none">
        <motion.header
          className="pointer-events-auto flex items-center justify-between gap-2 lg:gap-8 px-6 h-14 rounded-2xl w-full max-w-5xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: isScrolled ? "rgba(18, 8, 6, 0.35)" : "rgba(18, 8, 6, 0.15)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img src="/loom.png" alt="L" className="h-8 w-auto object-contain" />
            <span className="text-[28px] font-bold tracking-tighter text-white hidden sm:block leading-none -ml-1.5">oom</span>
          </Link>

          {/* Navigation */}
          {location.pathname === "/" || location.pathname === "/home" ? (
            <nav className="hidden md:flex items-center gap-1 ml-4 lg:ml-12">
              {navItems.map(({ path, label }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      color: isActive ? "#120806" : "rgba(255,255,255,0.7)",
                      background: isActive ? "#FADB17" : "transparent",
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-3 ml-4 lg:ml-12">
              <div className="h-1 w-1 rounded-full bg-v-cyan animate-pulse" />
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.6em]">
                {location.pathname.includes("profile") ? "Profile" : 
                 location.pathname.includes("communities") ? "Explore" :
                 location.pathname.includes("saved") ? "Saved" :
                 location.pathname.includes("following") ? "Network" : "Loom"}
              </span>
              <div className="h-1 w-1 rounded-full bg-v-cyan animate-pulse delay-75" />
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/50">
              <SearchIcon size={18} />
            </button>

            <button
              onClick={() => dispatch(openCreatePostModalAction())}
              className="flex items-center justify-center p-2 rounded-xl bg-v-cyan/10 text-v-cyan hover:bg-v-cyan hover:text-black transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
            >
              <Plus size={18} />
            </button>

            <Link to="/chat" className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/50">
              <MessageCircle size={18} />
            </Link>

            {userData.role === "admin" && (
              <Link to="/admin/reports" className="p-2 rounded-full hover:bg-white/5 transition-colors text-v-red/70 hover:text-v-red">
                <ShieldAlert size={18} />
              </Link>
            )}

            <div className="relative notification-trigger">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-xl transition-all duration-300 relative group ${
                  showNotifications ? "bg-white/10 text-indigo-400" : "hover:bg-white/5 text-white/50 hover:text-white"
                }`}
              >
                <Bell size={20} className={unreadCount > 0 ? "animate-wiggle" : ""} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500 border border-[#0a0a0a]"></span>
                  </span>
                )}
              </button>
              {!isMobile && (
                <NotificationDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleProfileClick}
                className="group relative flex items-center gap-2 p-0.5 rounded-full border border-white/10 hover:border-v-cyan/50 transition-all duration-300"
              >
                <div className="relative h-8 w-8 rounded-full overflow-hidden border border-black/50 ring-2 ring-white/5 group-hover:ring-v-cyan/30 transition-all">
                  <img src={userData.avatar} alt="profile" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-black text-white/60 hidden lg:block pr-3 uppercase tracking-widest">
                  {userData.name.split(" ")[0]}
                </span>
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className="absolute right-0 bottom-full md:top-full md:bottom-auto mb-3 md:mt-3 w-48 rounded-xl overflow-hidden shadow-2xl"
                    style={{ background: "rgba(18, 8, 6, 0.4)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  >
                    <div className="p-2">
                      <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors text-xs" onClick={() => setShowDropdown(false)}>
                        <User size={14} /> <span>Profile</span>
                      </Link>
                      <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors text-xs" onClick={() => setShowDropdown(false)}>
                        <Settings size={14} /> <span>Settings</span>
                      </Link>
                      <div className="my-1 border-t border-white/5" />
                      <button onClick={logout} disabled={loggingOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors text-xs">
                        <LogOut size={14} /> <span>{loggingOut ? "Signing out..." : "Sign out"}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>
      </div>

      {/* SEARCH OVERLAY (Integrated) */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-start justify-center pt-24 px-6 md:pt-32 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto" onClick={() => setShowSearch(false)} />
            <motion.div
              className="w-full max-w-2xl pointer-events-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <div className="bg-v-ink/80 backdrop-blur-3xl rounded-[32px] border border-white/10 p-2 shadow-2xl">
                <Search onClose={() => setShowSearch(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && (
        <div className="notification-trigger">
          <NotificationDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>
      )}
    </>
  );
};

export default memo(Navbar);
