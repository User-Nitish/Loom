import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { signInAction, demoSignInAction, clearMessage } from "../redux/actions/authActions";
import {
  AiFillGithub,
} from "react-icons/ai";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdArrowRight,
} from "react-icons/md";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signInError = useSelector((state) => state.auth?.signInError);
  const successMessage = useSelector((state) => state.auth?.successMessage);

  useEffect(() => {
    return () => {
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoadingText("Signing in...");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const timeout = setTimeout(() => {
      setLoadingText(
        "This is taking longer than usual. Please wait while backend services are getting started."
      );
    }, 5000);

    await dispatch(signInAction(formData, navigate));
    setLoading(false);
    clearTimeout(timeout);
  };

  const handleDemoSignIn = () => {
    dispatch(demoSignInAction(navigate));
  };

  const handleClearMessage = () => {
    dispatch(clearMessage());
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
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
        className="relative z-10 w-full max-w-lg mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Minimalist Logo Header */}
        <motion.div className="flex flex-col items-center mb-16" variants={itemVariants}>
          <div className="flex items-center gap-1">
            <img src="/loom.png" alt="L" className="h-14 w-auto object-contain" />
            <h1 className="text-6xl font-black text-white tracking-tighter select-none -ml-2">
              OOM<span className="text-v-red">.</span>
            </h1>
          </div>
          <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.8em] mt-2 ml-4">The Social Fabric</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="bg-transparent backdrop-blur-none rounded-[56px] border border-white/10 shadow-2xl p-12 md:p-16 relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Subtle Inner Glow - Deep Blue */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Sign In</h2>
              <div className="h-[1px] w-12 bg-white/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.5em] ml-2">Email Address</label>
                <div className="relative group">
                  <HiOutlineMail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-full py-5 pl-16 pr-8 text-xs font-bold text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.08] focus:outline-none transition-all tracking-widest"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.5em] ml-2">Password</label>
                <div className="relative group">
                  <HiOutlineLockClosed className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-full py-5 pl-16 pr-16 text-xs font-bold text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.08] focus:outline-none transition-all tracking-[0.3em]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 hover:text-white transition-colors"
                  >
                    {showPassword ? <HiOutlineEyeOff size={16} /> : <HiOutlineEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {(signInError || successMessage) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-5 rounded-3xl text-[9px] font-black uppercase tracking-[0.3em] text-center border ${signInError ? 'bg-v-red/5 border-v-red/10 text-v-red' : 'bg-green-500/5 border-green-500/10 text-green-400'
                      }`}
                  >
                    {signInError || successMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.4em] text-[10px] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 shadow-2xl"
              >
                {loading ? <ButtonLoadingSpinner /> : (
                  <>
                    <span>Sign In</span>
                    <MdArrowRight size={22} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-12 pt-12 border-t border-white/5 flex flex-col items-center gap-6">
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="text-[10px] font-black text-v-cyan uppercase tracking-[0.5em] hover:text-white transition-all py-2"
              >
                Try Demo Access
              </button>
              <Link to="/signup" className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] hover:text-white transition-all">Create Account</Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;
