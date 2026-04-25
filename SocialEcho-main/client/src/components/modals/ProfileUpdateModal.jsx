import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  getUserAction,
  updateUserAction,
} from "../../redux/actions/userActions";
import { useDispatch } from "react-redux";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { FiUser, FiMapPin, FiEdit, FiCamera } from "react-icons/fi";

const suggestedInterests = [
  "🎨 Art",
  "📚 Books",
  "💼 Business",
  "🚗 Cars",
  "📖 Comics",
  "🌍 Culture",
  "✏️ Design",
  "🍽️ Food",
  "🎮 Gaming",
  "🎶 Music",
  "🏋️ Fitness",
  "🏞️ Travel",
  "🎯 Sports",
  "🎬 Movies",
  "📺 TV Shows",
  "📷 Photography",
  "💻 Technology",
  "🧘‍♀️ Yoga",
  "🌱 Sustainability",
  "📝 Writing",
];

const ProfileUpdateModal = ({ user, isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [isUpdating, setIsUpdating] = useState(false);
   const [bio, setBio] = useState(user.bio ? user.bio : "");
  const [location, setLocation] = useState(user.location ? user.location : "");
  const [interests, setInterests] = useState(
    user.interests ? user.interests : ""
  );
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("location", location);
    formData.append("interests", interests);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    await dispatch(updateUserAction(user._id, formData));
    await dispatch(getUserAction(user._id));
    setBio("");
    setLocation("");
    setInterests("");
    setIsUpdating(false);
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 text-center sm:block sm:p-0 md:pb-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block w-full transform overflow-hidden rounded-3xl glass-card border border-white/10 px-8 pb-8 pt-8 text-left align-bottom shadow-2xl transition-all sm:my-8 sm:align-middle md:max-w-xl">
              <div className="w-full">
                <div className="text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-white mb-8 border-b border-white/10 pb-4"
                  >
                    Edit Profile
                  </Dialog.Title>

                  <div className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center justify-center mb-8">
                      <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-v-cyan/20 group-hover:border-v-cyan transition-all shadow-2xl">
                          <img 
                            src={avatarPreview} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <label 
                          htmlFor="avatar-upload" 
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                        >
                          <FiCamera className="text-white text-xl" />
                        </label>
                        <input 
                          id="avatar-upload"
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-3">
                        Change Profile Picture
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FiUser className="text-v-cyan" />
                        <label className="block text-sm font-semibold text-white/50 uppercase tracking-wider">
                          Bio
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Tell us about yourself..."
                        className="block w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-white/20 outline-none focus:border-v-cyan/50 transition-all"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FiMapPin className="text-v-cyan" />
                        <label className="block text-sm font-semibold text-white/50 uppercase tracking-wider">
                          Location
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Where are you based?"
                        className="block w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-white/20 outline-none focus:border-v-cyan/50 transition-all"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FiEdit className="text-v-cyan" />
                        <label className="block text-sm font-semibold text-white/50 uppercase tracking-wider">
                          Interests <span className="text-xs normal-case opacity-40">(comma separated)</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Gaming, Photography, etc."
                        className="block w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-white/20 outline-none focus:border-v-cyan/50 transition-all mb-4"
                        value={interests}
                        onChange={(e) => {
                          if (e.target.value.length <= 50) {
                            setInterests(e.target.value);
                          }
                        }}
                        maxLength={50}
                      />

                      <div className="mt-4 h-32 overflow-y-auto pr-2 custom-scrollbar touch-pan-y">
                        <div className="flex flex-wrap gap-2 pb-4">
                          {suggestedInterests.map((interest, index) => (
                            <button
                              key={index}
                              type="button"
                              disabled={isUpdating || interests.length >= 50}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all focus:outline-none"
                              onClick={() =>
                                setInterests(
                                  interests === ""
                                    ? interest
                                    : interests + ", " + interest
                                )
                              }
                            >
                              {interest}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col md:flex-row-reverse gap-3">
                <button
                  disabled={isUpdating}
                  type="button"
                  className={`flex-1 inline-flex justify-center items-center rounded-xl px-6 py-3 text-sm font-bold shadow-[0_0_20px_rgba(27,206,220,0.2)] transition-all ${
                    isUpdating
                      ? "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
                      : "bg-v-cyan text-v-ink hover:bg-v-yellow hover:scale-[1.02]"
                  } focus:outline-none`}
                  onClick={handleUpdateProfile}
                >
                  {isUpdating ? (
                    <ButtonLoadingSpinner loadingText={"Updating..."} />
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
                <button
                  type="button"
                  className="flex-1 inline-flex justify-center px-6 py-3 text-sm font-semibold text-white/50 bg-white/5 border border-white/10 rounded-xl hover:text-white hover:bg-white/10 transition-all focus:outline-none"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ProfileUpdateModal;
