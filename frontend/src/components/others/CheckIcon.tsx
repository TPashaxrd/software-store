"use client";

import { motion, useAnimation } from "motion/react";
import type { Variants } from "motion/react";

interface CheckProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const checkVariants: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
  animate: {
    pathLength: [1, 0.8, 1],
    opacity: [1, 0.8, 1],
    rotateY: [0, 180, 360],
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

const Check = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
  ...props
}: CheckProps) => {
  const controls = useAnimation();

  const handleHoverStart = () => {
    controls.start("animate");
  };

  const handleHoverEnd = () => {
    controls.start("normal");
  };

  return (
    <div
      style={{
        cursor: "pointer",
        userSelect: "none",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <motion.path
          d="M20 6 9 17l-5-5"
          variants={checkVariants}
          initial="normal"
          animate={controls}
          style={{ transformOrigin: "center" }}
        />
      </svg>
    </div>
  );
};

export { Check };
