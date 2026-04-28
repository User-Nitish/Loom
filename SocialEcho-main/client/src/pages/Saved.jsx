import { getSavedPostsAction } from "../redux/actions/postActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import SavedPost from "../components/post/SavedPost";
import { motion } from "framer-motion";
import { HiOutlineBookmarkSquare, HiOutlineArchiveBoxXMark } from "react-icons/hi2";

const Saved = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSavedPostsAction());
  }, [dispatch]);

  const savedPosts = useSelector((state) => state.posts?.savedPosts);

  return (
    <div className="space-y-12 pb-24">
      {/* Cinematic Header Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative pt-12 pb-8 border-b border-white/5"
      >
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-v-cyan/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-v-cyan/10 text-v-cyan border border-v-cyan/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            <HiOutlineBookmarkSquare size={24} />
          </div>
          <span className="text-[10px] font-black text-v-cyan uppercase tracking-[0.5em]">Vault_Storage</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
          Saved<span className="text-v-cyan">.</span>
        </h1>
        <p className="text-white/30 text-xs font-black uppercase tracking-[0.4em]">
          Archived transmissions and secured data segments
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-[1400px] mx-auto px-6">
        {savedPosts && savedPosts.length > 0 ? (
          <>
            {[...savedPosts].reverse().map((post, idx) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="w-full"
              >
                <SavedPost post={post} />
              </motion.div>
            ))}
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-32 text-center rounded-[60px] border border-dashed border-white/5 bg-white/[0.01] backdrop-blur-sm"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
              <HiOutlineArchiveBoxXMark className="text-white/10 text-4xl" />
            </div>
            <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.4em] mb-2">
              The Vault is Empty
            </h3>
            <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest">
              Save some posts to secure them in this section
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Saved;
