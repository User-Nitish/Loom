import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { signInAction, clearMessage } from "../redux/actions/authActions";
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
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo and Title */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="flex items-center justify-center mb-6 mx-auto"
            whileHover={{ scale: 1.02 }}
          >
            <img src="/loom.png" alt="L" className="h-16 w-auto object-contain" />
            <span className="text-[54px] font-bold text-white -ml-3 leading-none">oom</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-neutral-100 mb-2 font-display">
            Welcome back
          </h1>
          <p className="text-neutral-400">
            Sign in to your account
          </p>
        </motion.div>

        {/* Sign In Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-8 border border-neutral-800/50"
          variants={itemVariants}
        >
          {/* Email Field */}
          <motion.div className="mb-6" variants={itemVariants}>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineMail className={`h-5 w-5 transition-colors ${
                  focusedField === 'email' ? 'text-accent-400' : 'text-neutral-500'
                }`} />
              </div>
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your email"
                className="input-field pl-10"
                required
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div className="mb-6" variants={itemVariants}>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineLockClosed className={`h-5 w-5 transition-colors ${
                  focusedField === 'password' ? 'text-accent-400' : 'text-neutral-500'
                }`} />
              </div>
              <motion.input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your password"
                className="input-field pl-10 pr-10"
                required
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <HiOutlineEyeOff className="h-5 w-5 text-neutral-500 hover:text-neutral-300 transition-colors" />
                ) : (
                  <HiOutlineEye className="h-5 w-5 text-neutral-500 hover:text-neutral-300 transition-colors" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {(signInError || successMessage) && (
              <motion.div
                className={`p-3 rounded-lg mb-6 text-sm ${
                  signInError 
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                    : 'bg-green-500/10 border border-green-500/30 text-green-400'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <span>{signInError || successMessage}</span>
                  <button
                    onClick={handleClearMessage}
                    className="ml-4 hover:opacity-70 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="btn-accent w-full flex items-center justify-center gap-2 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            {loading ? (
              <>
                <ButtonLoadingSpinner />
                <span>{loadingText}</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <MdArrowRight className="text-lg" />
              </>
            )}
          </motion.button>

          {/* Divider */}
          <motion.div 
            className="relative my-6"
            variants={itemVariants}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-900 text-neutral-500">Or continue with</span>
            </div>
          </motion.div>

          {/* GitHub Sign In */}
          <motion.button
            type="button"
            className="btn-minimal w-full flex items-center justify-center gap-2 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            <AiFillGithub className="text-xl" />
            <span>Continue with GitHub</span>
          </motion.button>

          {/* Sign Up Link */}
          <motion.p 
            className="text-center text-neutral-400 text-sm mt-6"
            variants={itemVariants}
          >
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-accent-400 hover:text-accent-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </motion.p>
        </motion.form>

        {/* Admin Sign In Link */}
        <motion.div 
          className="text-center mt-6"
          variants={itemVariants}
        >
          <Link
            to="/admin/signin"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
          >
            <MdOutlineAdminPanelSettings className="text-lg" />
            <span>Admin Sign In</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;
