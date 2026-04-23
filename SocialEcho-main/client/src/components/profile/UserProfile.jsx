import { useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserAction } from "../../redux/actions/userActions";
import PostOnProfile from "../post/PostOnProfile";
import OwnProfileCard from "./OwnProfileCard";
import CommonLoading from "../loader/CommonLoading";
import OwnInfoCard from "./OwnInfoCard";
import NoPost from "../../assets/nopost.jpg";

const UserProfile = ({ userData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user?.user);
  const posts = user?.posts;

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      await dispatch(getUserAction(userData._id));
    };
    fetchUser().then(() => setLoading(false));
  }, [dispatch, userData._id]);

  const MemoizedPostOnProfile = memo(PostOnProfile);

  let postToShow;

  postToShow = posts?.map((post) => (
    <MemoizedPostOnProfile key={post._id} post={post} />
  ));

  return (
    <div className="space-y-8 pb-20">
      {loading || !user || !posts ? (
        <div className="flex justify-center items-center h-[60vh]">
          <CommonLoading />
        </div>
      ) : (
        <>
          <div className="space-y-6">
            <OwnProfileCard user={user} />
            <OwnInfoCard user={user} />
          </div>

          <div className="mt-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em] whitespace-nowrap">
                Your Posts
              </h3>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </div>

            {postToShow?.length === 0 ? (
              <div className="text-center py-24 px-10 rounded-[48px] border border-dashed border-white/10 bg-white/[0.01] backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-v-cyan/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-v-cyan/20 rounded-full blur-2xl animate-pulse" />
                    <img
                      className="relative w-48 h-48 rounded-full grayscale opacity-40 mix-blend-screen"
                      src={NoPost}
                      alt="no post"
                    />
                  </div>
                </div>
                <p className="text-sm font-black text-white/20 uppercase tracking-[0.4em]">
                  No Posts Found
                </p>
                <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest mt-2">
                  Share something with the community to see it here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {postToShow}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
