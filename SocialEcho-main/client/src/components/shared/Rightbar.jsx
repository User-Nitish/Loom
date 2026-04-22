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
    <div className="rightbar overflow-auto space-y-8 pr-2 no-scrollbar">
      {currentLocation !== "/communities" && (
        <div className="space-y-4">
          <div className="flex items-end justify-between px-2">
            <h5 className="font-bold text-[11px] uppercase tracking-wide text-white/30">Recommended Communities</h5>
            {remainingCount > 0 && (
              <Link
                className="text-xs font-bold text-v-yellow hover:underline transition-colors"
                to="/communities"
              >
                See all ({remainingCount})
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

      <div className="space-y-4">
        <h5 className="px-2 text-[11px] font-bold uppercase tracking-wide text-white/30">Who to follow</h5>

        {publicUsersFetched && recommendedUsers?.length === 0 && (
          <div className="text-center text-sm text-white/20 py-4 bg-white/5 rounded-2xl">
            No suggestions right now.
          </div>
        )}
        
        <ul className="flex flex-col gap-3">
          {recommendedUsers?.length > 0 &&
            recommendedUsers.map((user) => (
              <li
                key={user._id}
                className="flex justify-between items-center bg-white/5 border border-white/10 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all"
              >
                <div className="flex items-center min-w-0">
                  <img
                    className="h-9 w-9 rounded-full shrink-0 object-cover border border-white/10"
                    src={user.avatar}
                    alt={user.name}
                  />
                  <div className="ml-3 min-w-0">
                    <Link
                      to={`/user/${user._id}`}
                      className="text-sm font-bold text-white hover:text-v-yellow transition-colors line-clamp-1"
                    >
                      {user.name}
                    </Link>
                    <div className="text-[10px] text-white/40 font-medium">
                      {user.followerCount} followers
                    </div>
                  </div>
                </div>
                
                <button
                  disabled={followLoading[user._id]}
                  onClick={() => followUserHandler(user._id)}
                  className="flex-shrink-0 ml-3 text-v-yellow hover:text-white transition-colors text-xs font-bold"
                >
                  {followLoading[user._id] ? (
                    "..."
                  ) : (
                    "Follow"
                  )}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Rightbar;
