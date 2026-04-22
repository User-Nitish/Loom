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
    <div className={`fixed inset-y-0 left-0 z-40 w-72 transition-transform duration-500 transform ${showLeftbar ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:flex flex-col pt-24 md:pt-0`}>
      <div className="flex flex-col h-full glass-card border-r border-white/5 p-6 space-y-8">
        
        {/* Navigation Group */}
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-white/30 mb-4 px-2 uppercase tracking-wide">Main Menu</p>
          {navLinks.map((link) => {
            if (link.role && user?.role !== link.role) return null;
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            
            return (
              <Link
                key={link.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-v-yellow text-v-ink" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                to={link.href}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Communities Group */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-[11px] font-bold text-white/30 uppercase tracking-wide">Communities</p>
            <Link to="/my-communities" className="text-[10px] font-medium text-v-yellow hover:underline transition-colors">
              Manage
            </Link>
          </div>

          <div className="space-y-1">
            {communityLinks && communityLinks.length > 0 ? (
              communityLinks.map((community) => (
                <Link
                  key={community.href}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all truncate group"
                  to={community.href}
                >
                  <Hash size={14} className="text-white/20 group-hover:text-v-yellow transition-colors" />
                  <span className="text-sm font-medium truncate">{community.label}</span>
                </Link>
              ))
            ) : (
              <div className="px-4 py-2 text-xs text-white/20">No communities joined</div>
            )}
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="pt-4 mt-auto border-t border-white/5">
          <Link
            to="/communities"
            className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/5 text-white/80 font-medium hover:bg-white/10 transition-all border border-white/10"
          >
            <Compass size={18} />
            <span className="text-sm">Discover</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(Leftbar);
