import { lazy } from "react";
import PageTransition from "./components/layout/PageTransition";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Post from "./pages/Post";
import OwnPost from "./pages/OwnPost";
import CommunityHome from "./pages/CommunityHome";
import Saved from "./pages/Saved";
import PublicProfile from "./pages/PublicProfile";
import AllCommunities from "./pages/AllCommunities";
import MyCommunities from "./pages/MyCommunities";
import Following from "./pages/Following";
import SignUp from "./pages/SignUp";
import Chat from "./pages/Chat";
import CreateCommunity from "./pages/CreateCommunity";
import SearchResults from "./pages/SearchResults";
import AdminReports from "./pages/AdminReports";

const ReportedPost = lazy(() => import("./pages/ReportedPost"));
const Moderator = lazy(() => import("./pages/Moderator"));
const DevicesLocations = lazy(() => import("./pages/DevicesLocations"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const EmailVerifiedMessage = lazy(() => import("./pages/EmailVerifiedMessage"));
const BlockDevice = lazy(() => import("./pages/BlockDevice"));
const LoginVerified = lazy(() => import("./pages/LoginVerified"));
const AccessDenied = lazy(() => import("./pages/AccessDenied"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Settings = lazy(() => import("./pages/Settings"));

export const privateRoutes = [
  {
    path: "/",
    element: <PageTransition><Home /></PageTransition>,
  },
  {
    path: "/home",
    element: <PageTransition><Home /></PageTransition>,
  },
  {
    path: "/profile",
    element: <PageTransition><Profile /></PageTransition>,
  },
  {
    path: "/post/:postId",
    element: <PageTransition><Post /></PageTransition>,
  },
  {
    path: "/my/post/:postId",
    element: <PageTransition><OwnPost /></PageTransition>,
  },
  {
    path: "/community/:communityName",
    element: <PageTransition><CommunityHome /></PageTransition>,
  },
  {
    path: "/community/:communityName/reported-post",
    element: <PageTransition><ReportedPost /></PageTransition>,
  },
  {
    path: "/community/:communityName/moderator",
    element: <PageTransition><Moderator /></PageTransition>,
  },
  {
    path: "/saved",
    element: <PageTransition><Saved /></PageTransition>,
  },
  {
    path: "/user/:userId",
    element: <PageTransition><PublicProfile /></PageTransition>,
  },
  {
    path: "/communities",
    element: <PageTransition><AllCommunities /></PageTransition>,
  },
  {
    path: "/my-communities",
    element: <PageTransition><MyCommunities /></PageTransition>,
  },
  {
    path: "/following",
    element: <PageTransition><Following /></PageTransition>,
  },
  {
    path: "/communities/create",
    element: <PageTransition><CreateCommunity /></PageTransition>,
  },
  {
    path: "/search",
    element: <PageTransition><SearchResults /></PageTransition>,
  },
  {
    path: "/admin/reports",
    element: <PageTransition><AdminReports /></PageTransition>,
  },
  {
    path: "/devices-locations",
    element: <PageTransition><DevicesLocations /></PageTransition>,
  },
  {
    path: "/chat",
    element: <PageTransition><Chat /></PageTransition>,
  },
  {
    path: "/settings",
    element: <PageTransition><Settings /></PageTransition>,
  },
];

export const publicRoutes = [
  {
    path: "/signup",
    element: <PageTransition><SignUp /></PageTransition>,
  },

  {
    path: "/auth/verify",
    element: <PageTransition><VerifyEmail /></PageTransition>,
  },
  {
    path: "/email-verified",
    element: <PageTransition><EmailVerifiedMessage /></PageTransition>,
  },
  {
    path: "/block-device",
    element: <PageTransition><BlockDevice /></PageTransition>,
  },
  {
    path: "/verify-login",
    element: <PageTransition><LoginVerified /></PageTransition>,
  },
  {
    path: "/access-denied",
    element: <PageTransition><AccessDenied /></PageTransition>,
  },
  {
    path: "*",
    element: <PageTransition><NotFound /></PageTransition>,
  },
];
