import { Link } from "react-router-dom";
import { CiEdit, CiLocationOn } from "react-icons/ci";
import { GrContactInfo } from "react-icons/gr";
import { useState } from "react";
import ProfileUpdateModal from "../modals/ProfileUpdateModal";
import Tooltip from "../shared/Tooltip";

const OwnProfileCard = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="rounded-[48px] glass-card border border-white/5 p-12 shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-[40px] overflow-hidden relative group transition-all duration-500">
      {/* Refractive HUD Design Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-v-cyan/5 via-transparent to-v-yellow/5 opacity-50" />

      {/* Corner Highlights */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-v-cyan/20 rounded-tl-[48px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-v-yellow/20 rounded-br-[48px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="absolute top-0 right-0 w-64 h-64 bg-v-cyan/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-v-cyan/20 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-v-yellow/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 group-hover:bg-v-yellow/10 transition-all duration-700" />

      <div
        className="absolute top-8 right-8 cursor-pointer text-xl text-white/20 hover:text-white transition-all hover:scale-110 z-20"
        onClick={handleOpenModal}
      >
        <Tooltip text="Edit Profile">
          <CiEdit />
        </Tooltip>
      </div>

      <div className="flex flex-col items-center relative z-10">
        <div className="relative mb-8">
          {/* Avatar Ring Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-v-cyan via-v-yellow to-v-cyan rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-1000" />
          <div className="relative p-1 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10">
            <img
              className="h-36 w-36 rounded-full object-cover shadow-2xl"
              src={user.avatar}
              alt="Profile"
            />
          </div>

          <ProfileUpdateModal
            user={user}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>

        <div className="w-full text-center">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
            {user.name}
          </h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-v-cyan animate-pulse" />
            <span className="text-[9px] font-black text-v-cyan uppercase tracking-[0.3em]">Online</span>
          </div>

          <div className="max-w-md mx-auto">
            {user.bio ? (
              <p className="text-sm text-white/60 leading-relaxed font-medium">
                {user.bio}
              </p>
            ) : (
              <p className="text-sm text-white/20 italic font-medium tracking-wide">
                No bio added yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 backdrop-blur-md relative overflow-hidden group/item">
          <div className="absolute top-0 left-0 w-full h-full bg-v-yellow/[0.01] opacity-0 group-hover/item:opacity-100 transition-opacity" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 flex items-center gap-2">
            <CiLocationOn className="text-v-yellow text-sm" />
            Location
          </h4>
          {user.location ? (
            <p className="text-sm text-white/90 font-black tracking-tight">
              {user.location}
            </p>
          ) : (
            <p className="text-sm text-white/10 italic">
              Not specified
            </p>
          )}
        </div>

        <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 backdrop-blur-md relative overflow-hidden group/item">
          <div className="absolute top-0 left-0 w-full h-full bg-v-cyan/[0.01] opacity-0 group-hover/item:opacity-100 transition-opacity" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Interests</h4>
          {user.interests ? (
            <div className="flex flex-wrap gap-2">
              {user.interests.split(",").map((interest, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-v-cyan/5 border border-v-cyan/10 text-v-cyan/80"
                >
                  {interest.trim()}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/10 italic">
              None added
            </p>
          )}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center relative z-10">
        <Link
          className="group/btn inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] hover:bg-white/10 hover:text-white transition-all duration-500 hover:gap-5"
          to="/devices-locations"
        >
          Security Settings
          <div className="w-1.5 h-1.5 rounded-full bg-v-red group-hover/btn:scale-150 transition-transform shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
        </Link>
      </div>
    </div>
  );
};

export default OwnProfileCard;
