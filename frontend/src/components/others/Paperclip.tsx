"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";

const pathVariants: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
    strokeWidth: 2,
  },
  animate: {
    pathLength: [0, 1],
    opacity: 1,
    strokeWidth: 2,
    transition: {
      duration: 1,
      ease: "easeInOut",
      pathLength: {
        delay: 0.2,
        duration: 0.8,
      },
    },
  },
};

const extraLineVariants: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
    strokeWidth: 2,
  },
  animate: {
    pathLength: [0, 1],
    opacity: 1,
    strokeWidth: 2,
    transition: {
      delay: 0.8,
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

interface PaperclipProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const Paperclip = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
  ...props
}: PaperclipProps) => {
  const controls = useAnimation();

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
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
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
          d="M13.234 20.252 21 12.3"
          variants={extraLineVariants}
          animate={controls}
          initial="normal"
        />
        <motion.path
          d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"
          variants={pathVariants}
          animate={controls}
          initial="normal"
        />
      </svg>
    </div>
  );
};

export { Paperclip };