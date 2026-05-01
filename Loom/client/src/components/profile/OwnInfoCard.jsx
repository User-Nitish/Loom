const OwnInfoCard = ({ user }) => {
  return (
    <div className="rounded-[40px] glass-card border border-white/5 p-10 shadow-2xl backdrop-blur-3xl my-6 relative overflow-hidden group transition-all duration-500">
      {/* Refractive HUD Design Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.02] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-v-yellow/[0.02] via-transparent to-v-cyan/[0.02]" />
      
      {/* Corner Highlights */}
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/10 rounded-tr-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-white/10 rounded-bl-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-v-cyan via-v-yellow to-v-cyan opacity-20" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div>
          <h3 className="text-[10px] font-black text-v-yellow uppercase tracking-[0.4em] mb-1">User Stats</h3>
          <h4 className="text-xl font-black text-white uppercase tracking-tighter">Profile Summary</h4>
        </div>
        <div className="text-[9px] font-black text-white/20 uppercase tracking-widest text-right">
          <span className="text-white/40">Joined:</span><br />
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
        <StatItem label="Total Posts" value={user.totalPosts} sub="Posts" color="v-cyan" />
        <StatItem label="Communities" value={user.totalCommunities} sub="Nodes" color="v-yellow" />
        <StatItem label="Followers" value={user.followers?.length ?? 0} sub="Users" color="white" />
        <StatItem label="Following" value={user.following?.length ?? 0} sub="Users" color="white" />
      </div>

      {user.totalPosts > 0 && (
        <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Post Activity</p>
          <p className="text-[10px] font-black text-v-cyan uppercase tracking-widest">
            {user.totalPosts} Posts in {user.totalPostCommunities} Communities
          </p>
        </div>
      )}
    </div>
  );
};

const StatItem = ({ label, value, sub, color }) => (
  <div className="flex flex-col">
    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className={`text-3xl font-black tracking-tighter text-${color}`}>{value}</span>
      <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest">{sub}</span>
    </div>
  </div>
);

export default OwnInfoCard;
