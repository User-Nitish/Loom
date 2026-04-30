import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import createAppStore from "./redux/store";
import axios from "axios";
import CommonLoading from "./components/loader/CommonLoading";
import App from "./App";
import { getTitleFromRoute } from "./utils/docTitle";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const ErrorComponent = ({ errorMessage }) => {
  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] max-w-md mx-4">
      <div className="w-16 h-16 bg-v-red/20 rounded-full flex items-center justify-center">
        <span className="text-v-red text-3xl">!</span>
      </div>
      <div className="text-center">
        <h3 className="text-white font-black uppercase tracking-widest mb-2">Connection Issue</h3>
        <p className="text-white/60 text-sm leading-relaxed">{errorMessage}</p>
      </div>
      <button 
        onClick={handleReset}
        className="px-8 py-3 bg-v-red text-white font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all text-xs"
      >
        Reset Session
      </button>
    </div>
  );
};

const AppContainer = () => {
  const location = useLocation();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. Check Server Status using relative or absolute API URL
        const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";
        await axios.get(`${apiBaseUrl}/server-status`);

        // 2. Initialize Redux Store
        const appStore = await createAppStore();
        setStore(appStore);
      } catch (err) {
        console.error("Initialization error:", err);
        setError(err.message || "Failed to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <CommonLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <ErrorComponent errorMessage={error} />
      </div>
    );
  }

  return (
    <Provider store={store}>
      <Helmet>
        <title>{getTitleFromRoute(location.pathname)}</title>
      </Helmet>
      <App />
    </Provider>
  );
};

export default AppContainer;
