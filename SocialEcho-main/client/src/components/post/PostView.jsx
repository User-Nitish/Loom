import { useEffect, useState } from "react";
import { HiOutlineArchiveBox, HiOutlineChatBubbleLeftRight, HiOutlineArrowLeft } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getCommunityAction } from "../../redux/actions/communityActions";
import Save from "./Save";
import Like from "./Like";
import CommentForm from "../form/CommentForm";
import DeleteModal from "../modals/DeleteModal";
import CommonLoading from "../loader/CommonLoading";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import ReportPostModal from "../modals/ReportPostModal";
import { VscReport } from "react-icons/vsc";
import { motion } from "framer-motion";
import formatCreatedAt from "../../utils/timeConverter";
import CommentList from "./CommentList";

const PostView = ({ post, userData }) => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    content,
    fileUrl,
    fileType,
    user,
    community,
    createdAt,
    comments,
    savedByCount,
    isReported,
  } = post;

  useEffect(() => {
    dispatch(getCommunityAction(community.name)).then(() => setLoading(false));
  }, [dispatch, community.name]);

  const [showModal, setShowModal] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportedPost, setIsReportedPost] = useState(isReported);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoading />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto py-12 px-4 md:px-0"
    >
      <button 
        onClick={() => navigate(location.state?.from || "/")}
        className="group flex items-center gap-3 text-white/40 hover:text-white transition-all mb-8"
      >
        <div className="p-3 rounded-full border border-white/5 bg-white/[0.02] group-hover:bg-white/10 transition-all">
          <HiOutlineArrowLeft size={20} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Feed</span>
      </button>

      <div className="glass-card rounded-[48px] border border-white/10 bg-[#0d0d0d]/60 backdrop-blur-3xl overflow-hidden shadow-2xl">
        {/* Main Content Area */}
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-4">
              <Link to={`/user/${user._id}`} className="relative">
                <div className="absolute inset-0 bg-v-cyan/20 rounded-full blur-xl" />
                <img
                  className="relative w-16 h-16 rounded-full object-cover border-2 border-white/10 shadow-2xl"
                  src={user.avatar || "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg"}
                  alt={user.name}
                />
              </Link>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Link to={`/user/${user._id}`} className="text-lg font-black text-white uppercase tracking-wider hover:text-v-cyan transition-colors">
                    {user.name}
                  </Link>
                  <span className="w-1.5 h-1.5 rounded-full bg-v-cyan/40" />
                  <Link to={`/community/${community.name}`} className="text-xs font-black text-v-yellow uppercase tracking-[0.2em] hover:text-white transition-colors">
                    {community.name}
                  </Link>
                </div>
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mt-2">
                  {formatCreatedAt(createdAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {userData?._id === post.user._id && (
                <button
                  onClick={() => setShowModal(true)}
                  className="p-4 rounded-3xl bg-v-red/5 text-v-red border border-v-red/10 hover:bg-v-red hover:text-black transition-all duration-300"
                >
                  <HiOutlineArchiveBox size={24} />
                </button>
              )}
              <button 
                onClick={() => setIsReportModalOpen(true)}
                className={`p-4 rounded-3xl transition-all duration-300 ${isReportedPost ? 'bg-v-orange/10 text-v-orange' : 'bg-white/5 text-white/20 hover:text-white hover:bg-white/10'}`}
              >
                <VscReport size={24} />
              </button>
            </div>
          </div>

          {/* Text Content */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl font-medium text-white leading-relaxed tracking-tight">
              {content}
            </p>
          </div>

          {/* Media Content */}
          {fileUrl && (
            <div className="mb-12 rounded-[40px] overflow-hidden border border-white/5 bg-black/40">
              {fileType === "image" ? (
                <PhotoProvider>
                  <PhotoView src={fileUrl}>
                    <img
                      src={fileUrl}
                      alt={content}
                      className="w-full h-auto max-h-[1000px] object-contain cursor-zoom-in hover:scale-[1.01] transition-transform duration-700"
                    />
                  </PhotoView>
                </PhotoProvider>
              ) : (
                <video
                  className="w-full max-h-[800px] object-contain"
                  src={fileUrl}
                  controls
                />
              )}
            </div>
          )}

          {/* Engagement Stats */}
          <div className="flex items-center justify-between py-8 border-y border-white/5">
            <div className="flex items-center gap-8">
              <Like post={post} />
              <div className="flex items-center gap-3 text-white/20">
                <HiOutlineChatBubbleLeftRight size={24} />
                <span className="text-sm font-black uppercase tracking-widest">{comments.length} Comments</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 text-v-cyan">
                <Save postId={post._id} />
                <span className="text-xs font-black uppercase tracking-widest">{savedByCount} Saves</span>
              </div>
            </div>
          </div>

          {/* Comment Form */}
          <div className="mt-12">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.5em] mb-8">Join the conversation</h3>
            <CommentForm communityId={community._id} postId={post._id} />
          </div>

          {/* Comment List */}
          <div className="mt-12">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.5em] mb-8">Comments</h3>
            <CommentList comments={comments} />
          </div>
        </div>
      </div>

      <DeleteModal
        showModal={showModal}
        postId={post._id}
        onClose={() => setShowModal(false)}
        prevPath={location.state?.from || "/"}
      />

      <ReportPostModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        postId={post._id}
        communityId={community._id}
        setReportedPost={setIsReportedPost}
      />
    </motion.div>
  );
};

export default PostView;
