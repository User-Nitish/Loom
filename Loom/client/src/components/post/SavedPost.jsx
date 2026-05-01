import { useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlineChatBubbleOvalLeft, HiOutlineArrowLeft } from "react-icons/hi2";
import Like from "./Like";
import { motion } from "framer-motion";

const SavedPost = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.auth?.userData);

  const { content, fileUrl, user, community, createdAt, comments } = post;

  const isImageFile = useMemo(() => {
    const validExtensions = [".jpg", ".png", ".jpeg", ".gif", ".webp", ".svg"];
    const fileExtension = fileUrl?.slice(fileUrl.lastIndexOf("."));
    return validExtensions.includes(fileExtension);
  }, [fileUrl]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <motion.div 
      className="glass-card p-8 rounded-[40px] border border-white/5 bg-v-ink/40 w-full shadow-2xl relative group overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-v-yellow/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-8">
        <motion.button 
          onClick={handleBack}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-v-yellow hover:bg-v-yellow hover:text-v-ink transition-all shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <HiOutlineArrowLeft className="text-xl" />
        </motion.button>
        
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            {new Date(createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <img
            className="w-14 h-14 rounded-full border-2 border-v-yellow/30 p-0.5 object-cover"
            src={userData?.avatar || user.avatar}
            alt="user avatar"
            loading="lazy"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-v-yellow rounded-full border-4 border-v-ink flex items-center justify-center p-0.5" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white tracking-tight uppercase">{user.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-v-yellow bg-v-yellow/10 px-2 py-0.5 rounded-full border border-v-yellow/20">
              {community.name}
            </span>
          </div>
        </div>
      </div>

      <div
        className="cursor-pointer group/content"
        onClick={() => {
          navigate(`/post/${post._id}`, {
            state: { from: location.pathname },
          });
        }}
      >
        <p className="text-lg font-medium text-white/90 leading-relaxed mb-6 selection:bg-v-yellow selection:text-v-ink">
          {content}
        </p>
        
        {fileUrl && (
          <div className="relative rounded-3xl overflow-hidden border border-white/5 shadow-inner">
            {isImageFile ? (
              <img
                className="w-full max-h-[600px] object-cover transition-transform duration-700 group-hover/content:scale-105"
                src={fileUrl}
                alt={content}
                loading="lazy"
              />
            ) : (
              <video
                className="w-full max-h-[600px] object-cover"
                src={fileUrl}
                controls
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-v-ink/40 to-transparent pointer-events-none" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/5">
        <div className="flex items-center gap-8">
          <Like post={post} />
          
          <Link to={`/post/${post._id}`} className="flex items-center gap-2 group/comment">
            <div className="p-3 rounded-2xl bg-white/5 group-hover/comment:bg-v-cyan/10 transition-all">
              <HiOutlineChatBubbleOvalLeft className="text-2xl text-white/40 group-hover/comment:text-v-cyan" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-white/30 group-hover/comment:text-v-cyan">
              {comments.length} Comments
            </span>
          </Link>
        </div>
        
        <div className="p-1 px-3 rounded-full border border-white/5 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
          Restricted Data
        </div>
      </div>
    </motion.div>
  );
};

export default SavedPost;
