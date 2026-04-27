import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { signUpAction, demoSignInAction, clearMessage } from "../redux/actions/authActions";
import { Link } from "react-router-dom";
import ContextAuthModal from "../components/modals/ContextAuthModal";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlinePhotograph } from "react-icons/hi";
import { MdArrowRight } from "react-icons/md";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState(null);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signUpError = useSelector((state) => state.auth?.signUpError);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setAvatar(null);
      setAvatarError(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setAvatarError("Use JPEG/JPG/PNG only.");
      setAvatar(null);
    } else if (file.size > 10 * 1024 * 1024) {
      setAvatarError("Max 10MB limit.");
      setAvatar(null);
    } else {
      setAvatar(file);
      setAvatarError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingText("Initializing Identity...");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("role", "general");
    formData.append("isConsentGiven", isConsentGiven.toString());

    await dispatch(signUpAction(formData, navigate, isConsentGiven, email));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden py-20">
      {/* Cinematic Static Background - Refined Obsidian with Blurred Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Background Texture - Full Coverage with Subtle Blur */}
        <div
          className="absolute inset-0 w-full h-full opacity-60 blur-[4px]"
          style={{
            backgroundImage: "url('/bundle.jpeg')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />

        <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-v-red/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[1000px] h-[1000px] bg-white/[0.02] rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-2xl mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Minimalist Logo Header */}
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-1">
            <img src="/loom.png" alt="L" className="h-14 w-auto object-contain" />
            <h1 className="text-6xl font-black text-white tracking-tighter select-none -ml-2">
              OOM<span className="text-v-red">.</span>
            </h1>
          </div>
          <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.8em] mt-2 ml-4">The Social Fabric</p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-transparent backdrop-blur-none rounded-[56px] border border-white/10 shadow-2xl p-12 md:p-16 relative overflow-hidden">
          {/* Subtle Inner Glow - Deep Blue */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Sign Up</h2>
              <div className="h-[1px] w-12 bg-white/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] ml-2">Username</label>
                  <div className="relative group">
                    <HiOutlineUser className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-white transition-colors" size={16} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Node Handle"
                      className="w-full bg-transparent border border-white/5 rounded-full py-5 pl-16 pr-8 text-xs font-bold text-white placeholder:text-white/5 focus:border-white/20 focus:outline-none transition-all tracking-widest"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] ml-2">Email Address</label>
                  <div className="relative group">
                    <HiOutlineMail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-white transition-colors" size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nexus ID"
                      className="w-full bg-transparent border border-white/5 rounded-full py-5 pl-16 pr-8 text-xs font-bold text-white placeholder:text-white/5 focus:border-white/20 focus:outline-none transition-all tracking-widest"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] ml-2">Password</label>
                  <div className="relative group">
                    <HiOutlineLockClosed className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-white transition-colors" size={16} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border border-white/5 rounded-full py-5 pl-16 pr-8 text-xs font-bold text-white placeholder:text-white/5 focus:border-white/20 focus:outline-none transition-all tracking-[0.3em]"
                      required
                    />
                  </div>
                </div>

                {/* Photo */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] ml-2">Profile Photo</label>
                  <label className="relative flex items-center group cursor-pointer">
                    <div className="w-full bg-transparent border border-white/5 rounded-full py-5 pl-16 pr-8 text-xs font-bold text-white/40 group-hover:bg-white/5 transition-all flex items-center gap-4">
                      <HiOutlinePhotograph className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-hover:text-white transition-colors" size={16} />
                      <span className="truncate tracking-widest uppercase text-[10px]">{avatar ? avatar.name : "Select Asset"}</span>
                    </div>
                    <input type="file" onChange={handleAvatarChange} className="hidden" accept="image/*" />
                  </label>
                  {avatarError && <p className="text-[9px] text-v-red font-black uppercase tracking-widest mt-2 ml-2">{avatarError}</p>}
                </div>
              </div>

              {/* Neural Context */}
              <div className="pt-2">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className={`w-full py-5 rounded-full border-2 transition-all text-[10px] font-black uppercase tracking-[0.4em] ${isConsentGiven
                      ? 'bg-green-500/20 border-green-500/40 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                      : 'bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/20'
                      }`}
                  >
                    {isConsentGiven ? "Neural Context Active" : "Initialize Neural Context"}
                  </button>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] text-center px-4 leading-relaxed">
                    Loom's automated moderation and security system.
                  </p>
                </div>
              </div>

              {/* Action */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.4em] text-[10px] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 shadow-2xl mt-4"
              >
                {loading ? <ButtonLoadingSpinner /> : (
                  <>
                    <span>Sign Up</span>
                    <MdArrowRight size={22} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-12 pt-12 border-t border-white/5 flex flex-col items-center gap-6">
              <button
                type="button"
                onClick={() => dispatch(demoSignInAction(navigate))}
                className="text-[10px] font-black text-v-cyan uppercase tracking-[0.5em] hover:text-white transition-all py-2"
              >
                Try Demo Access
              </button>
              <Link to="/signin" className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] hover:text-white transition-all">Back to Login</Link>
            </div>
          </div>
        </div>
      </motion.div>

      <ContextAuthModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsConsentGiven={setIsConsentGiven}
        isModerator={false}
      />
    </div>
  );
};

export default SignUp;
