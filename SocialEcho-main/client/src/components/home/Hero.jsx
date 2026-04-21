import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const frameCount = 240;

const currentFrame = (index) =>
  `/ezgif-frames/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`;

const Hero = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);

  // Preload images
  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          // Initial draw
          if (canvasRef.current) {
            drawFrame(1, loadedImages);
          }
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  const drawFrame = (index, imageArray = images) => {
    const canvas = canvasRef.current;
    if (!canvas || imageArray.length === 0) return;

    const img = imageArray[index - 1]; // 1-indexed
    if (!img) return;

    const context = canvas.getContext("2d");
    
    // Calculate aspect ratio covering
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  };

  // Handle Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !canvasRef.current || images.length === 0) return;

      const container = containerRef.current;
      const { top, bottom, height } = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Scroll relative to the container
      let scrollFraction = 0;
      
      if (top <= 0 && bottom >= viewportHeight) {
        // Container is pinned and scrolling
        const scrolled = -top;
        const scrollableDistance = height - viewportHeight;
        scrollFraction = scrolled / scrollableDistance;
      } else if (bottom < viewportHeight) {
        // Past the container
        scrollFraction = 1;
      }

      scrollFraction = Math.max(0, Math.min(1, scrollFraction));
      const frameIndex = Math.floor(scrollFraction * (frameCount - 1)) + 1;
      
      requestAnimationFrame(() => drawFrame(frameIndex));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [images]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Redraw current frame
        const currentContainer = containerRef.current;
        if (currentContainer && images.length > 0) {
           const { top, height } = currentContainer.getBoundingClientRect();
           const viewportHeight = window.innerHeight;
           let fraction = -top / (height - viewportHeight);
           fraction = Math.max(0, Math.min(1, fraction));
           const fIndex = Math.floor(fraction * (frameCount - 1)) + 1;
           drawFrame(fIndex);
        }
      }
    };
    handleResize(); // Init size on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [images]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-gray-950"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Canvas for sequence player */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover opacity-80"
          style={{ mixBlendMode: "screen" }}
        />
        
        {/* Gradients to merge background with edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/70 opacity-90 pointer-events-none" />

        {/* Text and CTA Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none">
          <div className="text-center space-y-6 max-w-4xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-300 drop-shadow-[0_0_20px_rgba(45,212,191,0.6)] animate-pulse-slow">
              Connect on Loom
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 font-medium drop-shadow-lg max-w-2xl mx-auto">
              Drop into the conversation. Experience infinite connections exploding right from your device.
            </p>
            <div className="pt-8 pointer-events-auto">
              <Link
                to="/signup"
                className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-teal-950 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_40px_rgba(45,212,191,0.5)] hover:shadow-[0_0_60px_rgba(45,212,191,0.8)] focus:outline-none"
              >
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
                <span className="relative text-lg tracking-wide uppercase">Join Now</span>
                <svg
                  className="w-5 h-5 ml-2 relative group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
