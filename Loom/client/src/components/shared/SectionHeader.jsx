import React from "react";

const SectionHeader = ({ title, subtitle, align = "left", titleColor = "text-white", isGradient = false }) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}>
    <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase mb-3 ${isGradient
      ? "bg-gradient-to-r from-v-red via-v-red to-white/40 bg-clip-text text-transparent"
      : titleColor
      }`}>
      {title}
    </h2>
    <p className="text-white/40 text-sm md:text-base font-medium tracking-wide">
      {subtitle}
    </p>
  </div>
);

export default SectionHeader;
