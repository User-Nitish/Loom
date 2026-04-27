import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPostAction,
  clearCreatePostFail,
} from "../../redux/actions/postActions";
import InappropriatePostModal from "../modals/InappropriatePostModal";
import TopicConflictModal from "../modals/TopicConflictModal";
import EligibilityDetectionFailModal from "../modals/EligibilityDetectionFailModal";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon, 
  Video, 
  X, 
  Send, 
  Plus, 
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";

const PostForm = ({ communityId, communityName, minimal = false }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const uniqueId = `file-${communityId || 'global'}`;
  
  const [showInappropriateContentModal, setShowInappropriateContentModal] =
    useState(false);
  const [showTopicConflictModal, setShowTopicConflictModal] = useState(false);
  const [
    showEligibilityDetectionFailModal,
    setShowEligibilityDetectionFailModal,
  ] = useState(false);

  const [formData, setFormData] = useState({
    content: "",
    file: null,
    error: "",
    loading: false,
    success: false,
  });

  const { isPostInappropriate, postCategory, confirmationToken } = useSelector(
    (state) => ({
      isPostInappropriate: state.posts?.isPostInappropriate,
      postCategory: state.posts?.postCategory,
      confirmationToken: state.posts?.confirmationToken,
    })
  );

  const handleContentChange = (event) => {
    setFormData({
      ...formData,
      content: event.target.value,
      success: false,
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size <= 50 * 1024 * 1024) {
        setFormData({
          ...formData,
          file: selectedFile,
          error: "",
          success: false,
        });
      } else {
        setFormData({
          ...formData,
          file: null,
          error: "System_Error: File exceeds 50MB limit.",
          success: false,
        });
      }
    }
  };

  useEffect(() => {
    if (isPostInappropriate) setShowInappropriateContentModal(true);
    if (postCategory) setShowTopicConflictModal(true);
    if (confirmationToken) setShowEligibilityDetectionFailModal(true);
  }, [isPostInappropriate, postCategory, confirmationToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { content, file, loading } = formData;
    if (loading) return;

    if (!content && !file) {
      setFormData({
        ...formData,
        error: "Please enter a message or select a file.",
      });
      return;
    }

    // New validation: if no file, content must be >= 10 chars
    if (!file && content.length < 10) {
      setFormData({
        ...formData,
        error: "Your post is too short. Share more of your thoughts! (Min 10 chars)",
      });
      return;
    }

    const newPost = new FormData();
    newPost.append("content", content);
    newPost.append("communityId", communityId);
    newPost.append("communityName", communityName);
    newPost.append("file", file);

    setFormData({
      ...formData,
      loading: true,
      error: "",
    });

    try {
      await dispatch(createPostAction(newPost));
      setFormData({
        content: "",
        file: null,
        error: "",
        loading: false,
        success: true,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Auto hide success message after 5 seconds
      setTimeout(() => {
        setFormData(prev => ({ ...prev, success: false }));
      }, 5000);
    } catch (error) {
      setFormData({
        ...formData,
        loading: false,
        error: "Failed to broadcast post. Please try again.",
      });
    }
  };

  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      file: null,
      error: "",
      success: false,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <InappropriatePostModal
        closeInappropriateContentModal={() => {
          setShowInappropriateContentModal(false);
          dispatch(clearCreatePostFail());
        }}
        showInappropriateContentModal={showInappropriateContentModal}
        contentType={"post"}
      />

      <TopicConflictModal
        closeTopicConflictModal={() => {
          setShowTopicConflictModal(false);
          dispatch(clearCreatePostFail());
        }}
        showTopicConflictModal={showTopicConflictModal}
        communityName={postCategory?.community}
        recommendedCommunity={postCategory?.recommendedCommunity}
      />

      <EligibilityDetectionFailModal
        closeEligibilityDetectionFailModal={() => {
          setShowEligibilityDetectionFailModal(false);
          dispatch(clearCreatePostFail());
        }}
        showEligibilityDetectionFailModal={showEligibilityDetectionFailModal}
        confirmationToken={confirmationToken}
      />

      <div className={`${minimal ? 'p-0 bg-transparent border-none' : 'glass-card p-8 rounded-[40px] border border-white/5 bg-v-ink/40 shadow-2xl backdrop-blur-3xl'} relative overflow-hidden group`}>
        {/* Decorative corner elements */}
        {!minimal && (
          <>
            <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/10 rounded-tr-[40px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-white/10 rounded-bl-[40px] pointer-events-none" />
          </>
        )}

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className={`flex items-center gap-4 ${minimal ? 'mb-6' : 'mb-8'}`}>
            <div className="w-10 h-10 rounded-2xl bg-v-cyan/10 flex items-center justify-center border border-v-cyan/20">
              <Plus size={20} className="text-v-cyan" />
            </div>
            <div>
              <span className="text-[10px] font-black text-v-cyan uppercase tracking-[0.4em] mb-1 block">New Post</span>
              <p className="text-sm font-black text-white/40 uppercase tracking-widest">Share with {communityName}</p>
            </div>
          </div>

          <div className={`relative ${minimal ? 'mb-6' : 'mb-8'}`}>
            <textarea
              className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-white placeholder:text-white/10 focus:outline-none focus:border-v-cyan/30 transition-all resize-none min-h-[220px] text-lg font-medium selection:bg-v-cyan/30"
              name="content"
              id="content"
              placeholder="What's on the frequency?"
              value={formData.content}
              onChange={handleContentChange}
              maxLength={3000}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                name="file"
                type="file"
                id={uniqueId}
                accept="image/*, video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor={uniqueId}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border cursor-pointer transition-all group/btn ${
                  formData.file 
                    ? "bg-v-cyan/10 border-v-cyan/30 text-v-cyan" 
                    : "bg-white/5 border-white/5 text-white/30 hover:border-white/20 hover:text-white/60"
                }`}
              >
                {formData.file ? (
                  formData.file.type.startsWith('video') ? <Video size={16} /> : <ImageIcon size={16} />
                ) : (
                  <Plus size={16} className="group-hover/btn:rotate-90 transition-transform" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {formData.file ? "Change_Media" : "Add_Media"}
                </span>
              </label>

              <AnimatePresence>
                {formData.file && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -10 }}
                    className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5"
                  >
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest max-w-[120px] truncate">
                      {formData.file.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-white/20 hover:text-v-red transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              className={`relative group px-12 py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] transition-all overflow-hidden ${
                formData.loading || (!formData.content && !formData.file)
                  ? "bg-white/5 text-white/10 cursor-not-allowed"
                  : "bg-v-cyan text-v-ink hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              }`}
              type="submit"
              disabled={formData.loading || (!formData.content && !formData.file)}
            >
              <div className="relative z-10 flex items-center gap-3">
                {formData.loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Post</span>
                  </>
                )}
              </div>
            </button>
          </div>

          <AnimatePresence>
            {formData.error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 flex items-center gap-3 text-v-red bg-v-red/5 p-4 rounded-2xl border border-v-red/10"
              >
                <AlertCircle size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{formData.error}</span>
              </motion.div>
            )}

            {formData.success && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 flex items-center gap-3 text-v-cyan bg-v-cyan/5 p-4 rounded-2xl border border-v-cyan/10 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
              >
                <CheckCircle2 size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Broadcast transmitted successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </>
  );
};

export default PostForm;
