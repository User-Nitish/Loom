import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Search from "./Search";
import { memo } from "react";
import { logoutAction } from "../../redux/actions/authActions";
import NotificationDropdown from "../layout/NotificationDropdown";
import { useSelector } from "react-redux";
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

const Navbar = ({ userData, toggleLeftbar, showLeftbar }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useSelector((state) => state.notifications);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 px-6 pointer-events-none">
      <motion.header
        className="pointer-events-auto flex items-center justify-between gap-8 px-6 h-14 rounded-2xl w-full max-w-5xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: isScrolled
            ? "rgba(18, 8, 6, 0.35)"
            : "rgba(18, 8, 6, 0.15)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="/loom.png"
            alt="L"
            className="h-8 w-auto object-contain"
          />
          <span className="text-[28px] font-bold tracking-tighter text-white hidden sm:block leading-none -ml-1.5">oom</span>
        </Link>

        {/* Navigation - Conditional Rendering */}
        {location.pathname === "/" || location.pathname === "/home" ? (
          <nav className="hidden md:flex items-center gap-1">
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
          <div className="hidden md:flex items-center gap-3">
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/50"
          >
            <SearchIcon size={18} />
          </button>

          {/* New Create Post Button */}
          <button
            onClick={() => dispatch(openCreatePostModalAction())}
            className="flex items-center justify-center p-2 rounded-xl bg-v-cyan/10 text-v-cyan hover:bg-v-cyan hover:text-black transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
            title="Create New Post"
          >
            <Plus size={18} />
          </button>

          <Link
            to="/chat"
            className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/50"
          >
            <MessageCircle size={18} />
          </Link>

          {userData.role === "admin" && (
            <Link
              to="/admin/reports"
              className="p-2 rounded-full hover:bg-white/5 transition-colors text-v-red/70 hover:text-v-red"
              title="Moderation Queue"
            >
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
              <Bell size={18} className={`${unreadCount > 0 ? "animate-wiggle" : ""}`} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500 border border-[#0a0a0a]"></span>
                </span>
              )}
            </button>
            <NotificationDropdown 
              isOpen={showNotifications} 
              onClose={() => setShowNotifications(false)} 
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 p-1 rounded-full border border-white/5 hover:bg-white/5 transition-colors"
            >
              <img
                src={userData.avatar}
                alt="profile"
                className="w-7 h-7 rounded-full object-cover opacity-90"
              />
              <span className="text-xs font-medium text-white/80 hidden lg:block pr-2">
                {userData.name.split(" ")[0]}
              </span>
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className="absolute right-0 top-full mt-3 w-48 rounded-xl overflow-hidden shadow-2xl"
                  style={{
                    background: "rgba(18, 8, 6, 0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(16px)",
                  }}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                >
                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors text-xs"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User size={14} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors text-xs"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings size={14} />
                      <span>Settings</span>
                    </Link>
                    <div className="my-1 border-t border-white/5" />
                    <button
                      onClick={logout}
                      disabled={loggingOut}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors text-xs"
                    >
                      <LogOut size={14} />
                      <span>{loggingOut ? "Signing out..." : "Sign out"}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className="md:hidden p-2 rounded-full text-white/60"
            onClick={toggleLeftbar}
          >
            {showLeftbar ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      {/* Integrated Search Dropdown */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="absolute top-full right-0 w-full max-w-lg mt-4 px-6 md:px-0 pointer-events-auto"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-black/40 backdrop-blur-[60px] rounded-[40px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-3 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-20" />
              <div className="relative z-10">
                <Search onClose={() => setShowSearch(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(Navbar);
