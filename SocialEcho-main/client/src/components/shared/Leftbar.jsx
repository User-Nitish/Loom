import { useMemo, useEffect, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import {
  Home,
  User,
  Bookmark,
  Users,
  Compass,
  Globe,
  PlusCircle,
  Hash
} from "lucide-react";

const Leftbar = ({ showLeftbar }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state) => state.auth?.userData);
  const joinedCommunities = useSelector(
    (state) => state.community?.joinedCommunities
  );

  useEffect(() => {
    dispatch(getJoinedCommunitiesAction());
  }, [dispatch]);

  const visibleCommunities = useMemo(() => {
    return joinedCommunities?.slice(0, 8);
  }, [joinedCommunities]);

  const communityLinks = useMemo(() => {
    return visibleCommunities?.map((community) => ({
      href: `/community/${community.name}`,
      label: community.name,
    }));
  }, [visibleCommunities]);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/saved", label: "Saved", icon: Bookmark },
    { href: "/following", label: "Following", icon: Users, role: "general" },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-40 w-72 transition-all duration-500 transform ${showLeftbar ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:flex flex-col pt-24 md:pt-4 px-4 gap-6`}>
      {/* Navigation Capsule */}
      <div className="flex flex-col bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        <p className="text-[10px] font-black text-white/20 mb-6 px-2 uppercase tracking-[0.4em]">Main</p>
        <div className="space-y-1">
          {navLinks.map((link) => {
            if (link.role && user?.role !== link.role) return null;
            const Icon = link.icon;
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                    ? "bg-v-red text-white shadow-[0_10px_20px_rgba(250,38,38,0.3)]"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                to={link.href}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[11px] font-black uppercase tracking-widest">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Communities Capsule */}
      <div className="flex flex-col flex-1 bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] min-h-0">
        <div className="flex items-center justify-between px-2 mb-6">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Nodes</p>
          <Link to="/my-communities" className="text-[10px] font-black text-v-red hover:underline transition-colors uppercase tracking-widest">
            Edit
          </Link>
        </div>

        <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 -mx-2 px-2 scroll-smooth touch-pan-y">
          {communityLinks && communityLinks.length > 0 ? (
            communityLinks.map((community) => (
              <Link
                key={community.href}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all truncate group"
                to={community.href}
              >
                <Hash size={14} className="text-white/10 group-hover:text-v-red transition-colors" />
                <span className="text-[11px] font-bold line-clamp-2 leading-tight">{community.label}</span>
              </Link>
            ))
          ) : (
            <div className="px-4 py-2 text-[10px] font-bold text-white/10 uppercase tracking-widest">No nodes</div>
          )}
        </div>

        <div className="pt-6 mt-4 border-t border-white/5">
          <Link
            to="/communities"
            className="flex items-center gap-4 px-5 py-4 rounded-3xl bg-v-red text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:scale-105 transition-all mb-3"
          >
            <Compass size={18} />
            <span>Discover</span>
          </Link>
          
          <Link
            to="/admin/signin"
            className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white/30 hover:text-white/60 font-black uppercase tracking-widest text-[9px] transition-all"
          >
            <Hash size={14} />
            <span>Admin Terminal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(Leftbar);
