import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getServicePreferencesAction,
  updateServicePreferencesAction,
} from "../../redux/actions/adminActions";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";

const Settings = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const servicePreferences = useSelector(
    (state) => state.admin?.servicePreferences
  );
  const [usePerspectiveAPI, setUsePerspectiveAPI] = useState(false);
  const [
    categoryFilteringServiceProvider,
    setCategoryFilteringServiceProvider,
  ] = useState("");
  const [categoryFilteringRequestTimeout, setCategoryFilteringRequestTimeout] =
    useState(0);

  useEffect(() => {
    dispatch(getServicePreferencesAction());
  }, [dispatch]);

  useEffect(() => {
    if (servicePreferences) {
      setUsePerspectiveAPI(servicePreferences.usePerspectiveAPI);
      setCategoryFilteringServiceProvider(
        servicePreferences.categoryFilteringServiceProvider
      );
      setCategoryFilteringRequestTimeout(
        servicePreferences.categoryFilteringRequestTimeout
      );
      setIsLoading(false);
    }
  }, [servicePreferences]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setIsSuccess(false);
    try {
      await dispatch(
        updateServicePreferencesAction({
          usePerspectiveAPI,
          categoryFilteringServiceProvider,
          categoryFilteringRequestTimeout,
        })
      );
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !servicePreferences) {
    return (
      <div className="flex items-center justify-center py-20 text-v-cyan font-black uppercase tracking-[0.4em] animate-pulse">
        Polling_Config...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="glass-card !bg-black/60 border border-white/5 shadow-2xl p-10 relative overflow-hidden group text-white">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-v-cyan via-v-teal to-v-red opacity-50" />
        
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black tracking-tighter uppercase font-display mb-2">
            Service Config_Registry
          </h2>
          <p className="text-v-cyan text-[10px] font-black uppercase tracking-[0.4em]">
            Parameter Group: CONTENT_MODERATION
          </p>
        </div>

        {isSuccess && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-black uppercase tracking-widest p-4 mb-8 rounded-xl text-center">
            Preferences synchronized successfully
          </div>
        )}

        <div className="space-y-8">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="space-y-1">
              <p className="text-sm font-bold text-white/90 uppercase tracking-tight">AI Moderation Bridge</p>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Toggle Perspective_API Logic</p>
            </div>
            <div className="ml-auto">
              <input
                className="w-5 h-5 bg-black/40 border-white/10 rounded accent-v-cyan cursor-pointer"
                type="checkbox"
                checked={usePerspectiveAPI}
                onChange={(e) => setUsePerspectiveAPI(e.target.checked)}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-bold text-white/90 uppercase tracking-tight">Filtering Provider</p>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Select Signal Processor</p>
            </div>
            <div className="md:ml-auto w-full md:w-64">
              <select
                className="w-full bg-black/60 border border-white/10 text-white text-xs font-mono rounded-xl p-3 outline-none appearance-none cursor-pointer"
                value={categoryFilteringServiceProvider}
                onChange={(e) =>
                  setCategoryFilteringServiceProvider(e.target.value)
                }
              >
                <option value="" className="bg-v-ink">NULL_PROVIDER</option>
                <option value="TextRazor" className="bg-v-ink">TEXT_RAZOR</option>
                <option value="InterfaceAPI" className="bg-v-ink">INTERFACE_CORE</option>
                <option value="ClassifierAPI" className="bg-v-ink">GENESIS_CLASSIFIER</option>
                <option value="disabled" className="bg-v-ink">SYSTEM_DISABLE</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-bold text-white/90 uppercase tracking-tight">API Latency Cap</p>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Timeout Millis (MAX_WAIT)</p>
            </div>
            <div className="md:ml-auto w-full md:w-64">
              <input
                className="w-full bg-black/60 border border-white/10 text-v-cyan text-xs font-mono rounded-xl p-3 outline-none"
                type="number"
                value={categoryFilteringRequestTimeout}
                min={0}
                required
                onChange={(e) => {
                  setCategoryFilteringRequestTimeout(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex justify-end">
          <button
            className="px-10 py-4 bg-v-cyan text-v-ink font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-v-yellow hover:scale-105 transition-all shadow-[0_10px_20px_rgba(27,206,220,0.2)] disabled:opacity-50"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <span className="flex items-center gap-2">
                <ButtonLoadingSpinner />
                Syncing...
              </span>
            ) : (
              "Apply Config"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
