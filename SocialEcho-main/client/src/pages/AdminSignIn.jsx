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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6 text-white">
      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase font-display mb-2">
            Admin Node
          </h1>
          <p className="text-v-red text-xs font-black uppercase tracking-[0.4em]">
            Restricted Access Zone
          </p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="glass-card !bg-black/60 border border-v-red/20 shadow-[0_0_50px_rgba(250,38,38,0.1)] rounded-3xl p-8"
        >
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-3">
                Operator ID
              </label>
              <input
                onChange={handleUsernameChange}
                className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-6 text-white placeholder:text-white/10 focus:border-v-red/50 focus:bg-black/80 focus:outline-none transition-all font-mono text-sm"
                type="text"
                placeholder="ADMIN_USER"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-3">
                Security Key
              </label>
              <input
                onChange={handlePasswordChange}
                className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-6 text-white placeholder:text-white/10 focus:border-v-red/50 focus:bg-black/80 focus:outline-none transition-all font-mono text-sm"
                type="password"
                placeholder="CORP_KEY"
                required
              />
            </div>
          </div>

          {signInError && (
            <div className="bg-v-red/10 border border-v-red/30 text-v-red text-xs font-bold px-4 py-3 rounded-xl mt-6 flex items-center justify-between">
              <span>{signInError}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-10">
            <Link to="/" className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
              <IoIosArrowRoundBack className="text-2xl" />
              Abandon Station
            </Link>
            
            <button
              disabled={signingIn}
              type="submit"
              className="w-full md:w-auto px-8 py-4 bg-v-red text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_10px_30px_rgba(250,38,38,0.2)] hover:shadow-[0_15px_40px_rgba(250,38,38,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {signingIn ? (
                <ButtonLoadingSpinner />
              ) : (
                "Authorize Access"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminSignIn;
