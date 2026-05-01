import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Trash2, X } from "lucide-react";

const InappropriatePostModal = ({
  closeInappropriateContentModal,
  showInappropriateContentModal,
  contentType,
}) => {
  return (
    <AnimatePresence>
      {showInappropriateContentModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeInappropriateContentModal}
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
              <div className="w-20 h-20 rounded-3xl bg-v-red/10 border border-v-red/20 flex items-center justify-center mb-6">
                <ShieldAlert size={32} className="text-v-red" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                Inappropriate Content
              </h2>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                Automated protocols triggered
              </p>
            </div>

            {/* Body */}
            <div className="mb-10 text-center">
              <p className="text-white/60 font-medium leading-relaxed">
                System analysis has detected potential violations of community standards in your {contentType}. This frequency cannot be transmitted as it contains content that may be harmful or inappropriate.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              <button
                className="px-12 py-4 rounded-2xl bg-v-red text-white text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 shadow-[0_0_24px_rgba(239,68,68,0.2)] transition-all flex items-center justify-center gap-3"
                onClick={closeInappropriateContentModal}
              >
                <Trash2 size={14} />
                Discard_Content
              </button>
            </div>

            {/* Close */}
            <button
              onClick={closeInappropriateContentModal}
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

export default InappropriatePostModal;
