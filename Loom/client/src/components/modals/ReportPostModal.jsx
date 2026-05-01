import { useState } from "react";
import { reportPostAction } from "../../redux/actions/communityActions";
import { useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, X, Loader2, AlertCircle } from "lucide-react";

const ReportPostModal = ({
  isOpen,
  onClose,
  postId,
  communityId,
  setReportedPost,
}) => {
  const [reportReason, setReportReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleReportSubmit = async () => {
    setIsLoading(true);
    try {
      await dispatch(
        reportPostAction({
          postId,
          reportReason,
          communityId,
        })
      );
      setIsLoading(false);
      setReportedPost(true);
      onClose();
    } catch (error) {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[200]"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0 scale-95 translate-y-8"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-8"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-[48px] bg-v-ink/80 border border-white/10 p-10 text-left shadow-[0_32px_128px_rgba(0,0,0,1)] transition-all sm:my-8 sm:w-full sm:max-w-lg backdrop-blur-3xl">
                {/* Header/Icon */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-v-red/20 blur-2xl rounded-full group-hover:bg-v-red/30 transition-all duration-500" />
                    <div className="relative w-20 h-20 rounded-3xl bg-v-red/10 border border-v-red/20 flex items-center justify-center mb-6 rotate-3 group-hover:rotate-6 transition-transform duration-500">
                      <Flag size={32} className="text-v-red" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                    Report Content
                  </h3>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                    Submit for Protocol Review
                  </p>
                </div>

                {/* Input Area */}
                <div className="mb-10 space-y-4">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">
                    Reason_For_Report
                  </label>
                  <textarea
                    className="block w-full text-sm rounded-[24px] h-32 resize-none p-6 bg-white/[0.02] border border-white/5 text-white placeholder-white/10 focus:outline-none focus:border-v-red/30 focus:bg-white/[0.04] transition-all"
                    placeholder="Describe the violation of community standards..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest px-2">
                    <AlertCircle size={10} />
                    False reports may result in node suspension.
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    className="flex-1 px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/[0.05] hover:text-white transition-all order-2 sm:order-1"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isLoading || !reportReason}
                    type="button"
                    className={`flex-1 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all order-1 sm:order-2 flex items-center justify-center gap-2 ${
                      isLoading || !reportReason
                        ? "bg-white/5 text-white/10 border border-white/5 cursor-not-allowed"
                        : "bg-v-red text-white hover:scale-105 active:scale-95 shadow-[0_0_24px_rgba(239,68,68,0.2)]"
                    }`}
                    onClick={handleReportSubmit}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Flag size={14} />
                        Submit_Report
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ReportPostModal;
