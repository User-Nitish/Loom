import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  getPublicUserAction,
  getPublicUsersAction,
  unfollowUserAction,
  followUserAction,
} from "../redux/actions/userActions";
import PublicPost from "../components/profile/PublicPost";
import { CiLocationOn } from "react-icons/ci";
import { AiOutlineFieldTime } from "react-icons/ai";
import { FiUsers, FiUser, FiUserMinus, FiUserPlus } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi2";
import CommonLoading from "../components/loader/CommonLoading";
import Tooltip from "../components/shared/Tooltip";

const PublicProfile = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [followLoading, setFollowLoading] = useState(false);
  const [unfollowLoading, setUnfollowLoading] = useState(false);

  const userData = useSelector((state) => state.auth?.userData);
  const userProfile = useSelector((state) => state.user?.publicUserProfile);
  const isUserFollowing = useSelector((state) => state.user?.isFollowing);
  const isModerator = useSelector(
    (state) => state.auth?.userData?.role === "moderator"
  );

  const publicUserId = location.pathname.split("/")[2];

  useEffect(() => {
    dispatch(getPublicUserAction(publicUserId));
  }, [dispatch, isUserFollowing, publicUserId]);

  useEffect(() => {
    if (publicUserId === userData?._id) {
      navigate("/profile", { replace: true });
    }
  }, [publicUserId, userData, navigate]);

  const handleUnfollow = async (publicUserId) => {
    setUnfollowLoading(true);
    await dispatch(unfollowUserAction(publicUserId));
    await dispatch(getPublicUsersAction());
    setUnfollowLoading(false);
  };

  const handleFollow = async (publicUserId) => {
    setFollowLoading(true);
    await dispatch(followUserAction(publicUserId));
    await dispatch(getPublicUsersAction());
    setFollowLoading(false);
  };

  if (!userProfile) {
    return (
      <div className="col-span-2 flex items-center justify-center">
        <CommonLoading />
      </div>
    );
  }

  const {
    name,
    avatar,
    location: userLocation,
    bio,
    role,
    interests,
    totalPosts,
    totalCommunities,
    joinedOn,
    totalFollowers,
    totalFollowing,
    isFollowing,
    followingSince,
    postsLast30Days,
    commonCommunities,
  } = userProfile;

  const Button = ({ loading, onClick, tooltipText, icon, color }) => (
    <button
      onClick={onClick}
      type="button"
      className={`absolute bottom-0 right-0 h-9 w-9 rounded-full border px-2 py-2 text-sm font-semibold ${color} bg-white`}
      disabled={loading}
    >
      {loading ? (
        <span className="text-xs">Wait</span>
      ) : (
        <Tooltip text={tooltipText}>{icon}</Tooltip>
      )}
    </button>
  );

  const FollowButton = ({ loading, onClick, name }) => (
    <Button
      loading={loading}
      onClick={onClick}
      tooltipText={`Follow ${name}`}
      icon={<FiUserPlus />}
      color="text-primary border-primary"
    />
  );

  const UnfollowButton = ({ loading, onClick, name }) => (
    <Button
      loading={loading}
      onClick={onClick}
      tooltipText={`Unfollow ${name}`}
      icon={<FiUserMinus />}
      color="text-red-500 border-red-500"
    />
  );

  return (
    <div className="main-section space-y-8">
      <div className="rounded-[40px] glass-card border border-white/10 px-10 py-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-v-maroon via-v-red via-v-orange via-v-yellow via-v-cyan to-v-teal opacity-50" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-v-cyan to-v-yellow rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <img
              className="relative h-32 w-32 rounded-full object-cover border-4 border-white/10 shadow-xl"
              src={avatar}
              alt="Profile"
              loading="lazy"
            />
            <div className="absolute -bottom-2 -right-2">
              <UnfollowButton
                loading={unfollowLoading}
                onClick={() => handleUnfollow(publicUserId)}
                name={name}
              />
              {!isModerator && !isFollowing && (
                <FollowButton
                  loading={followLoading}
                  onClick={() => handleFollow(publicUserId)}
                  name={name}
                />
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">
              {name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-white/60">
              <p className="flex items-center gap-1.5 font-medium">
                <CiLocationOn className="text-v-yellow text-xl" />
                {userLocation === "" ? "Not specified" : userLocation}
              </p>
              <p className="flex items-center gap-1.5 font-medium">
                <AiOutlineFieldTime className="text-white/40 text-xl" />
                Joined {joinedOn}
              </p>
            </div>
            {role === "moderator" ? (
              <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-lg bg-v-yellow text-v-ink font-bold text-xs">
                Moderator
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <p className="text-2xl font-bold text-white">{totalPosts}</p>
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/30">Posts</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <p className="text-2xl font-bold text-white">{totalFollowers}</p>
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/30">Followers</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <p className="text-2xl font-bold text-white">{totalFollowing}</p>
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/30">Following</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <p className="text-2xl font-bold text-white">{totalCommunities}</p>
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/30">Communities</p>
          </div>
        </div>

        <div className="space-y-6 border-t border-white/5 pt-8">
          {bio && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wide text-white/30 mb-3">About</h4>
              <p className="text-lg text-white/80 leading-relaxed">{bio}</p>
            </div>
          )}

          {isFollowing && role !== "moderator" && (
            <div className="text-white/60 text-sm font-medium">
              Following since {followingSince}
            </div>
          )}

          {commonCommunities?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wide text-white/30 mb-3">Mutual Communities</h4>
              <p className="text-white/70">
                You both share {" "}
                <Link
                  className="font-bold text-v-yellow hover:underline"
                  to={`/community/${commonCommunities[0].name}`}
                >
                  {commonCommunities[0].name}
                </Link>
                {commonCommunities.length > 1 && (
                  <span> and {commonCommunities.length - 1} other {commonCommunities.length - 1 === 1 ? 'community' : 'communities'}</span>
                )}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wide text-white/30 mb-3">Interests</h4>
            {interests ? (
              <div className="flex flex-wrap gap-2">
                {interests.split(",").map((interest, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white/60"
                  >
                    {interest.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-white/20 italic text-sm">{name} hasn't added any interests yet.</p>
            )}
          </div>
        </div>
      </div>
      {isUserFollowing && <PublicPost publicUserId={publicUserId} />}
    </div>
  );
};

export default PublicProfile;
