import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  getComMembersAction,
  unbanUserAction,
} from "../../redux/actions/communityActions";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, Loader2, UserCheck } from "lucide-react";

const UnbanUserModal = ({ show, onClose, userId, communityName }) => {
  const [unbanning, setUnbanning] = useState(false);
  const dispatch = useDispatch();

  const unbanHandler = async () => {
    setUnbanning(true);
    await dispatch(unbanUserAction(communityName, userId));
    await dispatch(getComMembersAction(communityName));
    setUnbanning(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-v-ink/80 border border-white/10 rounded-[48px] p-10 shadow-[0_32px_128px_rgba(0,0,0,1)] backdrop-blur-3xl overflow-hidden"
          >
            {/* Header/Icon */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-v-cyan/20 blur-2xl rounded-full group-hover:bg-v-cyan/30 transition-all duration-500" />
                <div className="relative w-20 h-20 rounded-3xl bg-v-cyan/10 border border-v-cyan/20 flex items-center justify-center mb-6 rotate-3 group-hover:rotate-6 transition-transform duration-500">
                  <ShieldCheck size={32} className="text-v-cyan" />
                </div>
              </div>
              
              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                Unban User
              </h3>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                Restoring Connection
              </p>
            </div>

            {/* Content */}
            <div className="mb-10 text-center">
              <p className="text-white/60 font-medium leading-relaxed">
                This node will be allowed to re-synchronize with <span className="text-v-cyan font-black">{communityName}</span>. All previous transmission restrictions for this ID will be purged.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="flex-1 px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/[0.05] hover:text-white transition-all order-2 sm:order-1"
                onClick={onClose}
                disabled={unbanning}
              >
                Abort
              </button>
              <button
                type="button"
                className="flex-1 px-8 py-4 rounded-2xl bg-v-cyan text-v-ink text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 shadow-[0_0_24px_rgba(34,211,238,0.2)] transition-all order-1 sm:order-2 flex items-center justify-center gap-2"
                onClick={unbanHandler}
                disabled={unbanning}
              >
                {unbanning ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <UserCheck size={14} />
                    Confirm_Unban
                  </>
                )}
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-8 right-8 p-2 rounded-xl hover:bg-white/5 text-white/10 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UnbanUserModal;
