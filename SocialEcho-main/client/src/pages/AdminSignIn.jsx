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
      {/* Cinematic Static Background - Red Tinted */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-v-red/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-v-red/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 select-none uppercase">
            Admin<span className="text-v-red">.</span>Node
          </h1>
          <p className="text-[10px] font-black text-v-red uppercase tracking-[0.6em]">Restricted Access Zone</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-[40px] rounded-[48px] border border-v-red/20 shadow-[0_40px_100px_rgba(250,38,38,0.1)] p-10 md:p-14">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Operator ID</label>
              <input
                onChange={handleUsernameChange}
                className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-4 px-6 text-sm font-mono text-white placeholder:text-white/10 focus:border-v-red/30 focus:bg-white/[0.08] focus:outline-none transition-all"
                type="text"
                placeholder="0x_OPERATOR"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Security Key</label>
              <input
                onChange={handlePasswordChange}
                className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-4 px-6 text-sm font-mono text-white placeholder:text-white/10 focus:border-v-red/30 focus:bg-white/[0.08] focus:outline-none transition-all"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {signInError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-2xl bg-v-red/5 border border-v-red/20 text-v-red text-[11px] font-bold uppercase tracking-widest text-center"
              >
                {signInError}
              </motion.div>
            )}

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
              <Link to="/" className="flex items-center gap-2 text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                <IoIosArrowRoundBack className="text-2xl" />
                Abandon Station
              </Link>
              
              <button
                disabled={signingIn}
                type="submit"
                className="w-full md:w-auto px-10 py-4 bg-v-red text-white font-black uppercase tracking-[0.2em] rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {signingIn ? <ButtonLoadingSpinner /> : "Authorize"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSignIn;
