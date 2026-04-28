import { useState, useEffect } from "react";
import Tab from "../components/admin/Tab";
import Logs from "../components/admin/Logs";
import Settings from "../components/admin/Settings";
import CommunityManagement from "../components/admin/CommunityManagement";
import Reports from "../components/admin/Reports";
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
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-2">Nexus Console</h1>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Platform Management Interface</p>
          </div>
          <button
            onClick={() => dispatch(logoutAction()).then(() => navigate("/admin/signin"))}
            className="w-full md:w-auto px-8 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-v-red hover:bg-v-red/10 hover:border-v-red/20 transition-all shadow-xl"
          >
            Terminal Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Bento Sidebar - Tabs */}
          <div className="lg:col-span-3 mb-12 lg:mb-0">
            <Tab activeTab={activeTab} handleTabClick={handleTabClick} />
          </div>

          {/* Bento Content Area */}
          <div className="lg:col-span-9 bg-white/[0.01] backdrop-blur-3xl rounded-[40px] border border-white/5 p-4 md:p-8 min-h-[70vh] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            {activeTab === "logs" && <Logs />}
            {activeTab === "settings" && <Settings />}
            {activeTab === "Community Management" && <CommunityManagement />}
            {activeTab === "reports" && <Reports />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
