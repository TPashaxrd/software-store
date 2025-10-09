import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NoPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black relative overflow-hidden">
      <motion.div
        className="absolute w-[700px] h-[700px] bg-red-500/20 rounded-full blur-[150px]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-[8rem] md:text-[10rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-pink-500 to-purple-600 drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          404
        </motion.h1>

        <motion.p
          className="text-gray-300 text-lg md:text-2xl mb-8 max-w-xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Oops! The page you’re looking for might have been removed, had its name changed, or is temporarily unavailable.
        </motion.p>

        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.07, boxShadow: "0 0 25px rgba(239,68,68,0.8)" }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 rounded-lg text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-pink-500 hover:from-pink-500 hover:to-red-600 transition-all duration-300 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Back to Home
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      />
    </div>
  );
}