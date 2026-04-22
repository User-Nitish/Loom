import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative w-full min-h-[95vh] flex flex-col items-center justify-center px-6">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-7">

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight flex items-center justify-center gap-2"
        >
          Connect on{" "}
          <span className="inline-flex items-center">
            <img src="/loom.png" alt="L" className="h-[0.9em] w-auto object-contain" />
            <span style={{ color: "#FADB17" }} className="-ml-[0.1em]">oom</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-white/60"
        >
          Join the conversation. Discover new communities and connect with people around the world.
        </p>

        {/* CTA Buttons — pill shaped like the reference */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {/* Primary CTA */}
          <Link
            to="/signup"
            className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95"
            style={{
              background: "#FADB17",
              color: "#2A1F1D",
              boxShadow: "0 4px 24px rgba(250, 219, 23, 0.25)",
            }}
          >
            <span>Join Now</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>

          {/* Secondary CTA */}
          <Link
            to="/signin"
            className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
