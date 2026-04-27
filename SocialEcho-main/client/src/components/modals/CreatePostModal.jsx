import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Users, Search, ChevronRight } from "lucide-react";
import { getJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import { closeCreatePostModalAction } from "../../redux/actions/uiActions";
import PostForm from "../form/PostForm";

const CreatePostModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isCreatePostModalOpen);
  const [step, setStep] = useState(1); // 1: Select Community, 2: Write Post
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const onClose = () => {
    dispatch(closeCreatePostModalAction());
  };

  const joinedCommunities = useSelector(
    (state) => state.community?.joinedCommunities || []
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(getJoinedCommunitiesAction());
      setStep(1);
      setSelectedCommunity(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, dispatch]);

  const filteredCommunities = joinedCommunities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCommunity = (community) => {
    setSelectedCommunity(community);
    setStep(2);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden pt-12 md:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-[#0d0d0d] rounded-[48px] border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,1)] h-fit max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-v-cyan/10 flex items-center justify-center border border-v-cyan/20">
                  <Plus size={20} className="text-v-cyan" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                    {step === 1 ? "Select Community" : `Post to ${selectedCommunity?.name}`}
                  </h2>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                    {step === 1 ? "Where would you like to share?" : "Broadcasting to the frequency"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-2xl hover:bg-white/5 text-white/20 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto custom-scrollbar p-6">
              {step === 1 ? (
                <div className="space-y-6">
                  {/* Search */}
                  <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-v-cyan transition-colors" size={18} />
                    <input
                      type="text"
                      placeholder="Search your communities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-v-cyan/30 transition-all font-medium"
                    />
                  </div>

                  {/* Community List */}
                  <div className="grid grid-cols-1 gap-3">
                    {filteredCommunities.length > 0 ? (
                      filteredCommunities.map((community) => (
                        <motion.button
                          key={community._id}
                          whileHover={{ scale: 1.01, x: 5 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectCommunity(community)}
                          className="flex items-center justify-between p-4 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-v-cyan/30 hover:bg-v-cyan/5 transition-all group text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                              <img 
                                src={community.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${community.name}`} 
                                alt="" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-white uppercase tracking-wider group-hover:text-v-cyan transition-colors">
                                {community.name}
                              </h4>
                              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">
                                {community.members?.length || 0} Members
                              </p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-white/10 group-hover:text-v-cyan transition-colors" />
                        </motion.button>
                      ))
                    ) : (
                      <div className="py-20 text-center bg-white/[0.01] rounded-[32px] border border-dashed border-white/5">
                        <Users size={32} className="mx-auto text-white/5 mb-4" />
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                          {searchTerm ? "No matching communities" : "Join a community to start posting"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <button 
                    onClick={() => setStep(1)}
                    className="mb-6 text-[10px] font-black text-v-cyan uppercase tracking-widest hover:underline flex items-center gap-2"
                  >
                    ← Back to selection
                  </button>
                  <PostForm 
                    communityId={selectedCommunity?._id} 
                    communityName={selectedCommunity?.name} 
                    minimal={true}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
