import React, { useEffect, useRef, useState, memo } from "react";
import { useLocation } from "react-router-dom";

const frameCount = 180;

const currentFrame = (index) =>
  `/ezgif-frames/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`;

const CinematicBackground = () => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/home";

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

    const img = imageArray[index - 1];
    if (!img) return;

    const context = canvas.getContext("2d");
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

  useEffect(() => {
    const handleScroll = () => {
      // Only scrub animation on Home page
      if (!isHome) return;

      const scrolled = window.scrollY;
      const scrollableDistance = 3000; 
      let scrollFraction = scrolled / scrollableDistance;

      scrollFraction = Math.max(0, Math.min(1, scrollFraction));
      const frameIndex = Math.floor(scrollFraction * (frameCount - 1)) + 1;

      requestAnimationFrame(() => drawFrame(frameIndex));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [images, isHome]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // If on home, draw based on scroll. If not, draw frame 1 or keep current.
        const scrolled = window.scrollY;
        let fraction = isHome ? scrolled / 3000 : 0;
        fraction = Math.max(0, Math.min(1, fraction));
        const fIndex = Math.floor(fraction * (frameCount - 1)) + 1;
        drawFrame(fIndex);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [images, isHome]);

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden no-scrollbar z-0 pointer-events-none bg-v-ink">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover opacity-100 transition-opacity duration-1000"
        style={{ mixBlendMode: "screen" }}
      />
      {/* Deep ambient gradients to blend with content */}
      <div className="absolute inset-0 bg-gradient-to-t from-v-ink via-v-ink/5 to-v-ink/20 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)] opacity-30" />
    </div>
  );
};

export default memo(CinematicBackground);
