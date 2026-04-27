import { Fragment, useRef, useState, memo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { deletePostAction } from "../../redux/actions/postActions";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

const DeleteModal = memo(({ showModal, postId, onClose, prevPath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const cancelButtonRef = useRef(null);

  const deleteHandler = async () => {
    setLoading(true);
    await dispatch(deletePostAction(postId));
    navigate(prevPath ? prevPath : "/");
    setLoading(false);
    onClose();
  };

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[200]"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        {/* Backdrop Overlay */}
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
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0 scale-95 translate-y-8"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-8"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-[48px] bg-v-ink/80 border border-white/10 p-8 text-left shadow-[0_32px_128px_rgba(0,0,0,1)] transition-all sm:my-8 sm:w-full sm:max-w-md backdrop-blur-3xl">
                {/* Header/Icon */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-v-red/20 blur-2xl rounded-full group-hover:bg-v-red/30 transition-all duration-500" />
                    <div className="relative w-20 h-20 rounded-3xl bg-v-red/10 border border-v-red/20 flex items-center justify-center mb-6 rotate-3 group-hover:rotate-6 transition-transform duration-500">
                      <Trash2 size={32} className="text-v-red" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                    Confirm Deletion
                  </h3>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                    This frequency will be lost forever
                  </p>
                </div>

                {/* Content */}
                <div className="mb-10 text-center">
                  <p className="text-white/60 font-medium leading-relaxed">
                    Are you sure you want to delete this broadcast? This action is irreversible and will remove all associated data from the grid.
                  </p>
                </div>

                {/* Warning Banner */}
                <div className="mb-10 p-4 rounded-2xl bg-v-red/5 border border-v-red/10 flex items-start gap-3">
                  <AlertTriangle className="text-v-red shrink-0" size={16} />
                  <p className="text-[10px] font-bold text-v-red uppercase tracking-widest leading-relaxed">
                    Warning: System will purge all metadata associated with this post ID immediately upon confirmation.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    className="flex-1 px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/[0.05] hover:text-white transition-all order-2 sm:order-1"
                    onClick={onClose}
                    disabled={loading}
                    ref={cancelButtonRef}
                  >
                    Abort_Process
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-8 py-4 rounded-2xl bg-v-red text-white text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 shadow-[0_0_24px_rgba(239,68,68,0.2)] transition-all order-1 sm:order-2 flex items-center justify-center gap-2"
                    onClick={deleteHandler}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Purging...
                      </>
                    ) : (
                      "Confirm_Delete"
                    )}
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/5 text-white/10 hover:text-white transition-all"
                >
                  <X size={18} />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
});

export default DeleteModal;
