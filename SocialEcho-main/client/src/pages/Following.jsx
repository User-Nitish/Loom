import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFollowingUsersAction } from "../redux/actions/userActions";
import PublicProfileCard from "../components/profile/PublicProfileCard";
import CommonLoading from "../components/loader/CommonLoading";
import noFollow from "../assets/nofollow.jpg";

const Following = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const followingUsers = useSelector((state) => state.user?.followingUsers);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      setLoading(true);
      await dispatch(getFollowingUsersAction());
      setLoading(false);
    };

    fetchFollowingUsers();
  }, [dispatch]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="text-left pt-6 pb-2 border-b border-white/5">
        <h1 className="text-4xl font-bold text-white mb-2">
          Following
        </h1>
        <div className="flex items-center gap-3">
          <p className="text-white/40 text-sm font-medium">
            People you follow
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <CommonLoading />
        </div>
      ) : (
        <div className="p-8">
          {followingUsers?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {followingUsers.map((user) => (
                <PublicProfileCard key={user._id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 flex justify-center items-center flex-col">
              <p className="text-white/40 text-xl font-medium mb-10">
                You're not following anyone yet.
              </p>
              <img src={noFollow} alt="no post" className="max-w-md w-full opacity-40 rounded-3xl grayscale" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Following;
