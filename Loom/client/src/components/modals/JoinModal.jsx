import { useCallback, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { joinCommunityAndFetchData } from "../../redux/actions/communityActions";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, Loader2, PlusCircle } from "lucide-react";

const JoinModal = memo(({ show, onClose, community }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.auth?.userData);
  const cancelButtonRef = useRef(null);

  const joinCommunityHandler = useCallback(
    async (communityName) => {
      try {
        setLoading(true);
        await dispatch(joinCommunityAndFetchData(communityName, userData));
      } finally {
        setLoading(false);
        onClose();
      }
    },
    [dispatch, userData, onClose]
  );

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[200]"
        onClose={onClose}
        initialFocus={cancelButtonRef}
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
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
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-[48px] bg-v-ink/80 border border-white/10 p-10 text-left align-middle shadow-[0_32px_128px_rgba(0,0,0,1)] backdrop-blur-3xl transition-all">
                {/* Header/Icon */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-v-cyan/20 blur-2xl rounded-full group-hover:bg-v-cyan/30 transition-all duration-500" />
                    <div className="relative w-20 h-20 rounded-3xl bg-v-cyan/10 border border-v-cyan/20 flex items-center justify-center mb-6 rotate-3 group-hover:rotate-6 transition-transform duration-500">
                      <Users size={32} className="text-v-cyan" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                    Join Community
                  </h3>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                    New Connection Request
                  </p>
                </div>

                {/* Community Info Card */}
                <div className="mb-10 p-6 rounded-[32px] bg-white/[0.03] border border-white/5 flex items-center gap-4 group/card">
                  <div className="w-12 h-12 rounded-xl bg-v-cyan/10 border border-v-cyan/20 flex items-center justify-center group-hover/card:scale-110 transition-transform">
                    <span className="text-v-cyan font-black text-xl">
                      {community.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">{community.name}</h4>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">
                      {community.members.length} Members Active
                    </p>
                  </div>
                </div>

                <div className="mb-10 text-center">
                  <p className="text-white/60 font-medium leading-relaxed">
                    Ready to synchronize with this frequency? You will be able to share broadcasts and interact with other nodes in this cluster.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    className="flex-1 px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/[0.05] hover:text-white transition-all order-2 sm:order-1"
                    onClick={onClose}
                    ref={cancelButtonRef}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-8 py-4 rounded-2xl bg-v-cyan text-v-ink text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 shadow-[0_0_24px_rgba(34,211,238,0.2)] transition-all order-1 sm:order-2 flex items-center justify-center gap-2"
                    onClick={() => joinCommunityHandler(community.name)}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <PlusCircle size={14} />
                        Join_Cluster
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
    </Transition>
  );
});

export default JoinModal;
