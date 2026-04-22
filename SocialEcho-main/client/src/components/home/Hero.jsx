import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-start px-6 md:px-12 lg:px-16 overflow-hidden">
      {/* Background Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-v-ink/60 via-transparent to-transparent pointer-events-none" />

      {/* Main Content Block - Pushed further to Left */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-start text-left max-w-4xl"
      >
        <h1 className="text-8xl md:text-[11rem] font-black text-white leading-[0.75] tracking-tightest select-none mb-10 -ml-2 md:-ml-4">
          LOOM<span className="text-v-yellow">.</span>
        </h1>

        <p className="text-xl md:text-2xl text-v-yellow font-black uppercase tracking-[0.4em] mb-6">
          The Social Fabric
        </p>

        <p className="text-lg md:text-2xl text-white/40 font-medium leading-relaxed mb-14 max-w-3xl">
          A minimalist sanctuary for deep focus, niche communities, and meaningful conversation.
        </p>

        <div className="flex flex-wrap items-center gap-6">
          <Link
            to="/signup"
            className="px-14 py-5 rounded-full bg-v-yellow text-v-ink font-bold text-lg hover:scale-105 transition-transform"
          >
            Get Started
          </Link>
          <Link
            to="/signin"
            className="text-white/60 hover:text-white font-bold text-lg transition-colors border-b border-white/10 pb-1"
          >
            Sign in
          </Link>
        </div>
      </motion.div>

      {/* Scroll Hint - Pushed to absolute edge for maximum left weight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-6 md:left-12 lg:left-16 flex items-center gap-6"
      >
        <div className="h-px w-32 bg-gradient-to-r from-white/40 to-transparent" />
        <span className="text-[10px] text-white/10 font-black uppercase tracking-[0.5em] animate-pulse">
          Scroll to Weave
        </span>
      </motion.div>
    </div>
  );
};

export default Hero;
