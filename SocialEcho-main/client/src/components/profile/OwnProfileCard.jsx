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
    <div className="rounded-[32px] glass-card border border-white/10 p-8 shadow-2xl backdrop-blur-3xl overflow-hidden relative group">
      <div
        className="absolute top-6 right-6 cursor-pointer text-2xl text-white/40 hover:text-v-cyan transition-colors"
        onClick={handleOpenModal}
      >
        <Tooltip text="Edit profile">
          <CiEdit />
        </Tooltip>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-v-cyan to-v-yellow rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <img
            className="relative h-32 w-32 rounded-full object-cover border-4 border-white/10 shadow-inner"
            src={user.avatar}
            alt="Profile"
          />

          <ProfileUpdateModal
            user={user}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>

        <div className="w-full text-center mt-6">
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          {user.bio ? (
            <p className="mt-2 text-white/70 font-medium">
              {user.bio}
            </p>
          ) : (
            <p className="mt-2 text-white/30 italic">
              No bio added yet.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wide text-white/30 mb-2">Location</h4>
          {user.location ? (
            <p className="flex items-center gap-2 text-white/90 font-medium">
              <CiLocationOn className="text-v-yellow text-xl" />
              {user.location}
            </p>
          ) : (
            <p className="flex items-center gap-2 text-white/20 italic">
              Not specified
            </p>
          )}
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wide text-white/30 mb-2">Interests</h4>
          {user.interests ? (
            <div className="flex flex-wrap gap-2">
              {user.interests.split(",").map((interest, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white/60"
                >
                  {interest.trim()}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-white/20 italic text-sm">
              Add your interests.
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center">
        <Link
          className="text-xs font-medium text-v-yellow hover:underline transition-all"
          to="/devices-locations"
        >
          Security Settings
        </Link>
      </div>
    </div>
  );
};

export default OwnProfileCard;
