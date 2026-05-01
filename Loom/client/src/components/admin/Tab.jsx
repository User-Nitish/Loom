import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/actions/adminActions";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { 
  LogOut, 
  Settings, 
  Activity, 
  Users,
  ShieldAlert
} from "lucide-react";

const Tab = ({ activeTab, handleTabClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await dispatch(logoutAction()).then(() => {
      navigate("/admin/signin");
    });
    setLoggingOut(false);
  };

  const tabs = [
    { id: "logs", label: "Activity Logs", icon: Activity },
    { id: "settings", label: "System Settings", icon: Settings },
    { id: "Community Management", label: "Communities", icon: Users },
    { id: "reports", label: "Moderation", icon: ShieldAlert },
  ];

  return (
    <div className="lg:sticky lg:top-10 z-40 w-full">
      <div className="flex lg:flex-col items-center lg:items-stretch gap-2 bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-3 rounded-[32px] lg:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-x-auto no-scrollbar-mobile">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group shrink-0 lg:shrink ${
                isActive
                  ? "bg-v-red text-white shadow-[0_10px_20px_rgba(250,38,38,0.2)]"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} className={isActive ? "animate-pulse" : "opacity-40 group-hover:opacity-100"} />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}

        <div className="w-[1px] lg:w-full h-6 lg:h-[1px] bg-white/5 mx-2 lg:mx-0 lg:my-4 shrink-0" />

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 px-6 py-4 rounded-2xl text-white/40 hover:text-v-red hover:bg-v-red/10 transition-all duration-300 group shrink-0 lg:shrink"
        >
          {loggingOut ? (
            <ButtonLoadingSpinner />
          ) : (
            <>
              <LogOut size={18} className="opacity-40 group-hover:opacity-100 group-hover:text-v-red" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Logout</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Tab;
