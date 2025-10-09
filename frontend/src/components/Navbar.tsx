import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";

interface Props {
  user: any;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: Props) {
  return (
    <motion.nav
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full flex justify-between items-center px-6 md:px-12 py-4 backdrop-blur-md bg-gray-900/60 shadow-lg rounded-b-xl fixed top-0 z-50"
    >
      <a
        href="/"
        className="text-2xl md:text-3xl font-bold text-red-500 hover:text-red-400 transition-colors"
      >
        ShertyCheats
      </a>

      <div className="flex items-center gap-3 md:gap-5">
        {user ? (
          <div className="flex items-center gap-3 md:gap-5">
            <span className="flex items-center gap-2 text-gray-200 text-sm md:text-base font-medium">
              <FaUserCircle className="text-lg md:text-xl text-purple-400" />
              {user.username}
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500 px-4 md:px-5 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base font-semibold shadow-sm"
            >
              <FaSignOutAlt className="text-sm md:text-base" />
              Logout
            </motion.button>
          </div>
        ) : (
          <div className="flex gap-2 md:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/login")}
              className="flex items-center gap-2 bg-red-500 px-4 md:px-5 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base font-semibold shadow-sm"
            >
              <FaSignInAlt className="text-sm md:text-base" />
              Sign In
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/signup")}
              className="flex items-center gap-2 bg-gray-800 px-4 md:px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base font-semibold shadow-sm"
            >
              <FaUserPlus className="text-sm md:text-base" />
              Sign Up
            </motion.button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
