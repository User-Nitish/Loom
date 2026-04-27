import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  confirmPostAction,
  rejectPostAction,
} from "../../redux/actions/postActions";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Send, Trash2, X, Loader2 } from "lucide-react";

const EligibilityDetectionFailModal = ({
  closeEligibilityDetectionFailModal,
  showEligibilityDetectionFailModal,
  confirmationToken,
}) => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDiscard = async () => {
    setIsProcessing(true);
    await dispatch(rejectPostAction(confirmationToken));
    setIsProcessing(false);
    closeEligibilityDetectionFailModal();
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    await dispatch(confirmPostAction(confirmationToken));
    setIsProcessing(false);
    closeEligibilityDetectionFailModal();
  };

  return (
    <AnimatePresence>
      {showEligibilityDetectionFailModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEligibilityDetectionFailModal}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-v-ink/80 border border-white/10 rounded-[48px] p-10 shadow-[0_32px_128px_rgba(0,0,0,1)] backdrop-blur-3xl overflow-hidden"
          >
            {/* Decorative Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-3xl bg-v-yellow/10 border border-v-yellow/20 flex items-center justify-center mb-6">
                <AlertCircle size={32} className="text-v-yellow" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                Eligibility Unknown
              </h2>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                Post failed automated screening
              </p>
            </div>

            {/* Body */}
            <div className="mb-10 text-center">
              <p className="text-white/60 font-medium leading-relaxed">
                Our system couldn't determine if this broadcast aligns with community protocols. You may proceed, but be aware that moderators may purge content that violates the frequency standards.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/[0.05] hover:text-white transition-all flex items-center justify-center gap-2"
                onClick={handleDiscard}
                disabled={isProcessing}
              >
                <Trash2 size={14} />
                Discard
              </button>
              <button
                className="flex-1 px-8 py-4 rounded-2xl bg-v-cyan text-v-ink text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 shadow-[0_0_24px_rgba(34,211,238,0.2)] transition-all flex items-center justify-center gap-2"
                onClick={handleProcess}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Post Anyway
                  </>
                )}
              </button>
            </div>

            {/* Close */}
            <button
              onClick={closeEligibilityDetectionFailModal}
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

export default EligibilityDetectionFailModal;
