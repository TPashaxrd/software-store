import { useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Book, Package } from "lucide-react";

interface Props {
  user: any;
  onLogout: () => void;
}

export default function CreativeNavbar({ user, onLogout }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Library", href: "/library/mine", icon: <Book />, dropdown: ["Books", "Guides", "Articles"] },
    { name: "Tickets", href: "/tickets/mine", icon: <HelpCircle />, dropdown: ["Open Ticket", "My Tickets"] },
    { name: "Packages", href: "/packages", icon: <Package /> },
    { name: "About", href: "/about" },
  ];

  return (
    <motion.nav
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full fixed top-0 z-50 backdrop-blur-xl bg-gray-900/60 border-b border-gray-700 rounded-b-2xl px-6 md:px-12 py-4 flex items-center justify-between shadow-lg"
    >
      <a href="/" className="text-2xl md:text-3xl font-extrabold text-red-500 hover:text-pink-500 transition-colors">
        ShartyCheat
      </a>

      <div className="hidden md:flex items-center gap-8">
        <div className="flex gap-6 font-medium text-gray-200 relative">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <motion.a
                href={link.href}
                whileHover={{ scale: 1.1, color: "#f43f5e" }}
                className="flex items-center gap-1 transition-colors text-gray-200 font-semibold"
              >
                {link.icon && <span className="text-purple-400">{link.icon}</span>}
                {link.name}
              </motion.a>

              {link.dropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 bg-gray-800/90 backdrop-blur-md rounded-lg mt-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all w-44 py-2"
                >
                  {link.dropdown.map((item) => (
                    <a
                      key={item}
                      href={`${link.href}/${item.toLowerCase()}`}
                      className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:text-white hover:bg-gradient-to-r from-purple-500 to-pink-500 transition-all rounded-md"
                    >
                      <Book className="text-sm text-purple-200" />
                      {item}
                    </a>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {user ? (
          <>
            <motion.span whileHover={{ scale: 1.2 }} className="flex items-center gap-2 text-gray-200 font-medium">
              <FaUserCircle className="text-purple-400 text-lg" />
              {user.username}
            </motion.span>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px #f43f5e" }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-xl font-semibold text-white shadow-md"
            >
              <FaSignOutAlt /> Logout
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px #f43f5e" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/")}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-xl font-semibold text-white shadow-md"
            >
              <FaSignInAlt /> Sign In
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px #6b21a8" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/")}
              className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl font-semibold text-white shadow-md"
            >
              <FaUserPlus /> Sign Up
            </motion.button>
          </>
        )}
      </div>

      <div className="md:hidden flex items-center">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FaTimes className="text-white text-2xl" /> : <FaBars className="text-white text-2xl" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-gray-900/90 backdrop-blur-xl shadow-lg flex flex-col items-center gap-4 py-4 md:hidden z-40 rounded-b-2xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-gray-200 font-medium hover:text-pink-500 transition-colors w-full text-center py-2 flex justify-center gap-2 items-center"
              >
                {link.icon && <span>{link.icon}</span>}
                {link.name}
              </a>
            ))}

            {user ? (
              <>
                <span className="flex items-center gap-2 text-gray-200 text-base font-medium">
                  <FaUserCircle className="text-purple-400" />
                  {user.username}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { window.location.href = "/tickets/mine"; setMobileOpen(false); }}
                  className="flex items-center gap-2 bg-purple-600 px-6 py-2 rounded-xl hover:bg-purple-700 transition-all font-semibold"
                >
                  <HelpCircle /> Tickets
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { onLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2 rounded-xl hover:from-pink-500 hover:to-red-500 transition-all font-semibold"
                >
                  <FaSignOutAlt /> Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { window.location.href = "/login"; setMobileOpen(false); }}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2 rounded-xl hover:from-pink-500 hover:to-red-500 transition-all font-semibold"
                >
                  <FaSignInAlt /> Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { window.location.href = "/signup"; setMobileOpen(false); }}
                  className="flex items-center gap-2 bg-gray-800 px-6 py-2 rounded-xl hover:bg-gray-700 transition-all font-semibold"
                >
                  <FaUserPlus /> Sign Up
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
