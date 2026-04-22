import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef(null);
  const trailRef = useRef([]);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Add to trail
      if (trailRef.current.length > 5) {
        trailRef.current.shift();
      }
      trailRef.current.push({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest('[role="button"]') ||
        target.classList.contains("cursor-pointer");
      
      setIsHovering(isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        mass: 0.2,
        stiffness: 1000,
        damping: 25,
      },
    },
    hover: {
      x: mousePosition.x - 30,
      y: mousePosition.y - 30,
      scale: 1.5,
      opacity: 0.8,
      transition: {
        type: "spring",
        mass: 0.2,
        stiffness: 800,
        damping: 25,
      },
    },
    click: {
      scale: 0.8,
      transition: {
        type: "spring",
        mass: 0.1,
        stiffness: 1200,
        damping: 15,
      },
    },
  };

  const trailVariants = {
    default: {
      scale: 0.5,
      opacity: 0.3,
    },
    hover: {
      scale: 0.8,
      opacity: 0.2,
    },
  };

  return (
    <>
      {/* Cursor Trail */}
      {trailRef.current.map((pos, index) => (
        <motion.div
          key={index}
          className="fixed top-0 left-0 z-[9998] rounded-full pointer-events-none"
          style={{
            x: pos.x - 8,
            y: pos.y - 8,
          }}
          variants={trailVariants}
          animate={isHovering ? "hover" : "default"}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
          }}
        >
          <div 
            className="w-4 h-4 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(6, 182, 212, ${0.3 - index * 0.05}) 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      ))}

      {/* Main Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] rounded-full pointer-events-none mix-blend-difference hidden md:block"
        variants={variants}
        animate={isClicking ? "click" : isHovering ? "hover" : "default"}
      >
        <div 
          className="w-10 h-10 rounded-full border-2 border-accent-400"
          style={{
            background: isHovering 
              ? "radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)"
              : "transparent",
            boxShadow: isHovering 
              ? "0 0 20px rgba(6, 182, 212, 0.5)"
              : "0 0 10px rgba(6, 182, 212, 0.2)",
          }}
        >
          {/* Inner dot */}
          <div 
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-accent-400"
            style={{
              transform: "translate(-50%, -50%)",
              opacity: isHovering ? 0.8 : 1,
            }}
          />
        </div>
      </motion.div>

      {/* Magnetic Cursor for interactive elements */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 z-[9997] pointer-events-none hidden md:block"
          style={{
            x: mousePosition.x - 40,
            y: mousePosition.y - 40,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div 
            className="w-20 h-20 rounded-full border border-accent-400/30"
            style={{
              background: "radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%)",
            }}
          />
        </motion.div>
      )}
    </>
  );
};

export default CustomCursor;
