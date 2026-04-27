import { useEffect, useState, memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import {
  savePostAction,
  unsavePostAction,
  getSavedPostsAction,
  increaseSavedByCount,
  decreaseSavedByCount,
} from "../../redux/actions/postActions";

const Save = ({ postId }) => {
  const dispatch = useDispatch();

  const savedPosts = useSelector((state) => state.posts?.savedPosts || []);
  const savedPostsIds = useMemo(() => savedPosts.map((post) => post?._id || post), [savedPosts]);
  
  const isInitiallySaved = savedPostsIds.includes(postId);
  const [saved, setSaved] = useState(isInitiallySaved);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSaved(isInitiallySaved);
  }, [isInitiallySaved]);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (isSaving) return;
    try {
      setIsSaving(true);
      setSaved(true); // Optimistic update
      await dispatch(savePostAction(postId));
      dispatch(increaseSavedByCount(postId));
    } catch (error) {
      setSaved(false); // Rollback
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnsave = async (e) => {
    e.stopPropagation();
    if (isSaving) return;
    try {
      setIsSaving(true);
      setSaved(false); // Optimistic update
      await dispatch(unsavePostAction(postId));
      dispatch(decreaseSavedByCount(postId));
    } catch (error) {
      setSaved(true); // Rollback
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={saved ? handleUnsave : handleSave}
      disabled={isSaving}
      className={`p-3 rounded-2xl transition-all duration-300 ${
        saved 
          ? 'bg-v-cyan/10 text-v-cyan shadow-[0_0_20px_rgba(27,206,220,0.2)]' 
          : 'bg-white/[0.03] text-white/20 hover:text-white hover:bg-white/10'
      }`}
    >
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"
          />
        ) : saved ? (
          <motion.div
            key="saved"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
          >
            <BookmarkCheck size={20} className="fill-current" />
          </motion.div>
        ) : (
          <motion.div
            key="unsaved"
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <Bookmark size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default memo(Save);
