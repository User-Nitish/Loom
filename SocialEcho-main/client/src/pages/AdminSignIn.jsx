import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import { IoIosArrowRoundBack } from "react-icons/io";
import { signInAction } from "../redux/actions/adminActions";
import { useDispatch, useSelector } from "react-redux";

const AdminSignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const signInError = useSelector((state) => state.admin?.signInError);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    setSigningIn(true);
    e.preventDefault();
    const data = {
      username: username,
      password: password,
    };

    dispatch(signInAction(data)).then(() => {
      setSigningIn(false);
      navigate("/admin");
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Sleek Technical Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('/admin_bg.png')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <motion.div
        className="relative z-10 w-full max-w-md mx-auto px-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            Admin<span className="text-v-red">.</span>Login
          </h1>
          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.5em] mt-2">Sign in to manage your platform</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl rounded-[32px] border border-white/5 p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-1">Username</label>
              <input
                onChange={handleUsernameChange}
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3 px-5 text-sm text-white focus:border-v-red/50 focus:bg-white/[0.08] focus:outline-none transition-all"
                type="text"
                placeholder="Enter admin username"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-1">Password</label>
              <input
                onChange={handlePasswordChange}
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3 px-5 text-sm text-white focus:border-v-red/50 focus:bg-white/[0.08] focus:outline-none transition-all"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {signInError && (
              <div className="p-3 rounded-xl bg-v-red/10 border border-v-red/20 text-v-red text-[10px] font-bold text-center uppercase tracking-widest">
                {signInError}
              </div>
            )}

            <button
              disabled={signingIn}
              type="submit"
              className="w-full py-4 bg-v-red text-white font-black uppercase tracking-widest rounded-2xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {signingIn ? <ButtonLoadingSpinner /> : "Sign In"}
            </button>
            
            <Link to="/" className="flex items-center justify-center gap-2 text-white/20 hover:text-white/40 transition-colors text-[9px] font-black uppercase tracking-widest pt-2">
              <IoIosArrowRoundBack className="text-xl" />
              Return to Public Site
            </Link>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSignIn;
