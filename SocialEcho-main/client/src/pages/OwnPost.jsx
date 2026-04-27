import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { getOwnPostAction } from "../redux/actions/postActions";
import { useNavigate, useParams } from "react-router-dom";
import CommonLoading from "../components/loader/CommonLoading";

import PostView from "../components/post/PostView";
import CommentSidebar from "../components/post/CommentSidebar";

const OwnPost = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth?.userData);

  const joinedCommunities = useSelector((state) =>
    state.community?.joinedCommunities?.map(({ _id }) => _id)
  );

  useEffect(() => {
    dispatch(getOwnPostAction(postId));
  }, [dispatch, postId]);

  const { ownPost: post } = useSelector((state) => state.posts);

  const isAuthorized = useMemo(() => {
    return post && joinedCommunities?.includes(post.community._id);
  }, [post, joinedCommunities]);

  useEffect(() => {
    if (isAuthorized === false) {
      navigate("/access-denied");
    }
  }, [isAuthorized, navigate]);

  if (!post || !joinedCommunities)
    return (
      <div className="col-span-3 flex justify-center items-center h-screen">
        <CommonLoading />
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-[1400px] mx-auto px-6 relative">
      <div className="lg:col-span-3">
        <PostView post={post} userData={userData} />
      </div>
      <div className="lg:col-span-1">
        <CommentSidebar comments={post.comments} />
      </div>
    </div>
  );
};

export default OwnPost;
