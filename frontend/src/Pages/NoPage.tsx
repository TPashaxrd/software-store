import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NoPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-red-600 mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          404
        </motion.h1>

        <motion.p
          className="text-white text-lg md:text-2xl mb-8 text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Oops! The page you are looking for does not exist.
        </motion.p>

        <motion.button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}
