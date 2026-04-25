import { useState, useEffect } from "react";
import Tab from "../components/admin/Tab";
import Logs from "../components/admin/Logs";
import Settings from "../components/admin/Settings";
import CommunityManagement from "../components/admin/CommunityManagement";
import { useSelector, useDispatch } from "react-redux";
import { logoutAction } from "../redux/actions/adminActions";
import { useNavigate } from "react-router-dom";
const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("logs");
  const adminPanelError = useSelector((state) => state.admin?.adminPanelError);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (adminPanelError === "Unauthorized") {
      dispatch(logoutAction()).then(() => {
        navigate("/admin/signin");
      });
    }
  }, [adminPanelError, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Sleek Technical Background */}
      <div 
        className="fixed inset-0 z-0 opacity-20 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/admin_bg.png')" }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-12">
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
          <div>
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Admin Dashboard</h1>
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Platform Management Console</p>
          </div>
          <button 
            onClick={() => dispatch(logoutAction()).then(() => navigate("/admin/signin"))}
            className="px-6 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-v-red hover:bg-v-red/10 hover:border-v-red/20 transition-all"
          >
            Logout
          </button>
        </div>
  
        <Tab activeTab={activeTab} handleTabClick={handleTabClick} />
  
        <div className="bg-white/[0.01] backdrop-blur-3xl rounded-[40px] border border-white/5 p-8 min-h-[60vh]">
          {activeTab === "logs" && <Logs />}
          {activeTab === "settings" && <Settings />}
          {activeTab === "Community Management" && <CommunityManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
