import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import {
  getPublicUsersAction,
  followUserAndFetchData,
} from "../../redux/actions/userActions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import JoinModal from "../modals/JoinModal";
import { BsPersonPlusFill } from "react-icons/bs";
import { IoIosPeople, IoMdPeople } from "react-icons/io";
import placeholder from "../../assets/placeholder.png";

const Rightbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [joinModalVisibility, setJoinModalVisibility] = useState({});
  const [notJoinedCommunitiesFetched, setNotJoinedCommunitiesFetched] =
    useState(false);
  const [publicUsersFetched, setPublicUsersFetched] = useState(false);

  const currentUser = useSelector((state) => state.auth?.userData);

  const recommendedUsers = useSelector((state) => state.user?.publicUsers);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getNotJoinedCommunitiesAction());
      setNotJoinedCommunitiesFetched(true);
      await dispatch(getPublicUsersAction());
    };

    fetchData().then(() => {
      setPublicUsersFetched(true);
    });
  }, [dispatch]);

  const notJoinedCommunities = useSelector(
    (state) => state.community?.notJoinedCommunities
  );

  const [visibleCommunities, remainingCount] = useMemo(() => {
    const visibleCommunities = notJoinedCommunities?.slice(0, 4) || [];
    const remainingCount = Math.max((notJoinedCommunities?.length || 0) - 4, 0);
    return [visibleCommunities, remainingCount];
  }, [notJoinedCommunities]);

  const [followLoading, setFollowLoadingState] = useState({});

  const followUserHandler = useCallback(
    async (toFollowId) => {
      setFollowLoadingState((prevState) => ({
        ...prevState,
        [toFollowId]: true,
      }));

      await dispatch(followUserAndFetchData(toFollowId, currentUser));

      setFollowLoadingState((prevState) => ({
        ...prevState,
        [toFollowId]: false,
      }));

      navigate(`/user/${toFollowId}`);
    },
    [dispatch, currentUser, navigate]
  );

  const toggleJoinModal = useCallback((communityId, visible) => {
    setJoinModalVisibility((prev) => ({
      ...prev,
      [communityId]: visible,
    }));
  }, []);

  const currentLocation = useLocation().pathname;

  return (
    <div className="rightbar flex flex-col gap-6 pr-2 no-scrollbar min-h-[calc(100vh-160px)]">
      {/* Recommended Communities Module */}
      {currentLocation !== "/communities" && (
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-7 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] space-y-6">
          <div className="flex items-end justify-between px-2">
            <h5 className="font-black text-[10px] uppercase tracking-[0.4em] text-white/20">Discovery</h5>
            {remainingCount > 0 && (
              <Link
                className="text-[10px] font-black text-v-red hover:underline transition-colors uppercase tracking-widest"
                to="/communities"
              >
                All ({remainingCount})
              </Link>
            )}
          </div>

          {notJoinedCommunitiesFetched && visibleCommunities.length === 0 && (
            <div className="text-center text-sm text-white/20 py-4">
              No new communities to join.
            </div>
          )}
          <ul className="flex flex-col gap-3">
            {visibleCommunities?.map((community) => (
              <li
                key={community._id}
                className="flex items-center justify-between bg-white/5 border border-white/10 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all"
              >
                <div className="flex items-center">
                  <img
                    src={community.banner || placeholder}
                    className="h-8 w-8 rounded-full mr-4 object-cover border border-white/10"
                    alt="community"
                  />
                  <div className="text-sm font-bold flex flex-col">
                    <p className="line-clamp-1 text-white"> {community.name}</p>
                    <p className="text-[10px] text-white/40 flex items-center gap-1">
                      <IoMdPeople />
                      {community.members.length} members
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleJoinModal(community._id, true)}
                  className="bg-v-yellow text-v-ink rounded-lg py-1.5 px-4 text-xs font-bold hover:scale-[1.02] transition-transform"
                >
                  Join
                </button>
                <JoinModal
                  show={joinModalVisibility[community._id] || false}
                  onClose={() => toggleJoinModal(community._id, false)}
                  community={community}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* People to Follow Module */}
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-7 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] space-y-6">
        <h5 className="px-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Sync Network</h5>

        {publicUsersFetched && recommendedUsers?.length === 0 && (
          <div className="text-center text-[10px] font-black uppercase tracking-widest text-white/10 py-8">
            Network Idle
          </div>
        )}

        <div className="flex flex-col gap-4">
          {recommendedUsers?.length > 0 &&
            recommendedUsers.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center group transition-all"
              >
                <div className="flex items-center min-w-0">
                  <div className="relative">
                    <img
                      className="h-10 w-10 rounded-full shrink-0 object-cover border border-white/10 group-hover:border-v-red transition-all"
                      src={user.avatar?.url || placeholder}
                      alt={user.name}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full" />
                  </div>
                  <div className="ml-4 min-w-0">
                    <Link
                      to={`/user/${user._id}`}
                      className="text-[11px] font-black text-white hover:text-v-red transition-all uppercase tracking-wider line-clamp-1"
                    >
                      {user.name}
                    </Link>
                    <div className="text-[9px] text-white/20 font-black uppercase tracking-tighter">
                      {user.followerCount || 0} Synced
                    </div>
                  </div>
                </div>

                <button
                  disabled={followLoading[user._id]}
                  onClick={() => followUserHandler(user._id)}
                  className="p-2.5 rounded-full bg-white/5 text-white/20 hover:bg-v-red hover:text-white transition-all shadow-lg"
                >
                  <BsPersonPlusFill size={16} />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
