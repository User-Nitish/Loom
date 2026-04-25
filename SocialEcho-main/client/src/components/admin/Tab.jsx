import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/actions/adminActions";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { 
  LogOut, 
  Settings, 
  Activity, 
  Users 
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
  ];

  return (
    <div className="sticky top-4 left-0 z-40 flex justify-center mb-12">
      <div className="flex items-center gap-1 bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-2 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 group ${
                isActive
                  ? "bg-v-red text-white shadow-[0_10px_20px_rgba(250,38,38,0.2)]"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} className={isActive ? "animate-pulse" : "opacity-40 group-hover:opacity-100"} />
              <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          );
        })}

        <div className="w-[1px] h-6 bg-white/10 mx-2" />

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 px-6 py-3 rounded-full text-white/40 hover:text-v-red hover:bg-v-red/10 transition-all duration-300 group"
        >
          {loggingOut ? (
            <ButtonLoadingSpinner />
          ) : (
            <>
              <LogOut size={16} className="opacity-40 group-hover:opacity-100 group-hover:text-v-red" />
              <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Tab;
