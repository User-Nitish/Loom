import * as types from "../constants/userConstants";
import { DELETE_POST_SUCCESS, CREATE_POST_SUCCESS } from "../constants/postConstants";
import { LOGOUT } from "../constants/authConstants";

const initialState = {
  user: {},
  publicUsers: [],
  publicUserProfile: {},
  followingUsers: [],
  isFollowing: null,
  userError: null,
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGOUT:
      return {
        ...state,
        user: {},
        publicUsers: [],
        publicUserProfile: {},
        followingUsers: [],
        isFollowing: null,
        userError: null,
      };

    case CREATE_POST_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          posts: [payload, ...(state.user?.posts || [])],
          totalPosts: (state.user?.totalPosts || 0) + 1,
        },
      };

    case types.GET_USER_SUCCESS:
    case types.UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: { ...state.user, ...payload },
        userError: null,
      };

    case types.GET_USER_FAIL:
      return { ...state, userError: payload };

    case DELETE_POST_SUCCESS:
      return {
        ...state,
        user: state.user?.posts
          ? {
              ...state.user,
              posts: state.user.posts.filter((post) => post._id !== payload),
              totalPosts: (state.user.totalPosts || 1) - 1,
            }
          : state.user,
        publicUserProfile: state.publicUserProfile?.posts
          ? {
              ...state.publicUserProfile,
              posts: state.publicUserProfile.posts.filter(
                (post) => post._id !== payload
              ),
              totalPosts: (state.publicUserProfile.totalPosts || 1) - 1,
            }
          : state.publicUserProfile,
      };

    case types.GET_PUBLIC_USERS_SUCCESS:
      return {
        ...state,
        publicUsers: payload || [],
        userError: null,
      };

    case types.GET_PUBLIC_USERS_FAIL:
      return { ...state, userError: payload };

    case types.GET_PUBLIC_USER_PROFILE_SUCCESS:
      return {
        ...state,
        publicUserProfile: payload || {},
        userError: null,
        isFollowing: payload?.isFollowing ?? null,
      };

    case types.GET_PUBLIC_USER_PROFILE_FAIL:
      return { ...state, userError: payload };

    case types.CHANGE_FOLLOW_STATUS_SUCCESS:
      return {
        ...state,
        isFollowing: payload ? payload.isFollowing : null,
        userError: null,
      };

    case types.CHANGE_FOLLOW_STATUS_FAIL:
      return { ...state, userError: payload };

    case types.GET_FOLLOWING_USERS_SUCCESS:
      return { ...state, followingUsers: payload, userError: null };

    case types.GET_FOLLOWING_USERS_FAIL:
      return { ...state, userError: payload };

    default:
      return state;
  }
};

export default userReducer;
