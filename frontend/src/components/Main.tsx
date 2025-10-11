import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaUserCircle, FaLock, FaSignInAlt, FaExclamationCircle, FaUserPlus, FaRocket, FaShieldAlt, FaGamepad } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import type { Variants } from "motion/react";
import type { motionS, useAnimation } from "motion/react";
import { User } from "./others/User";

interface User {
  username: string;
  email: string;
  isBanned: boolean;
  profilePicture: string;
  date: Date;
}

export default function Main() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [IP_Address, setIP_Address] = useState("");

  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await axios.get("https://api.ipify.org/?format=json");
        setIP_Address(res.data.ip);
      } catch (error) {}
    }
    fetchIP();
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    if (!email || !password || (isRegister && !username)) {
      setError("All fields are required.");
      toast.error("All fields are required.", { autoClose: 3000 });
      setIsSubmitting(false);
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.", { autoClose: 3000 });
      setIsSubmitting(false);
      return;
    }
    try {
      const url = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";
      const body = isRegister
        ? { username, email, password, IP_Address }
        : { email, password };
      const res = await axios.post(url, body, { withCredentials: true });
      if (res.status === 200) {
        setUserData(res.data.user);
        setLoggedIn(true);
        setEmail(""); setPassword(""); setUsername("");
        toast.success(`${isRegister ? "Registered" : "Welcome"}, ${res.data.user.username}!`, { autoClose: 3000 });
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || (isRegister ? "Registration failed." : "Login failed.");
      setError(message);
      toast.error(message, { autoClose: 3000 });
    } finally { setIsSubmitting(false); }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });
      setUserData(null);
      setLoggedIn(false);
      toast.success("Logged out successfully!", { autoClose: 3000 });
      window.location.reload();
    } catch { toast.error("Failed to logout. Please try again.", { autoClose: 3000 }); }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
        if (res.status === 200) { setUserData(res.data.user); setLoggedIn(true); }
      } catch { setLoggedIn(false); } finally { setLoading(false); }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-14 h-14 border-4 border-t-purple-500 border-gray-700 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-sans overflow-x-hidden">
      <Navbar user={userData} onLogout={handleLogout} />
      <div className="flex flex-1 flex-col md:flex-row items-center justify-center relative">
        <motion.div className="absolute w-[600px] h-[600px] bg-purple-600/30 rounded-full top-[-100px] left-[-150px] blur-3xl animate-blob" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }} />
        <motion.div className="absolute w-[500px] h-[500px] bg-pink-500/30 rounded-full bottom-[-120px] right-[-100px] blur-3xl animate-blob" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }} />
        <div className="w-full md:w-1/2 z-10 flex flex-col justify-center px-6 md:px-16 py-12">
          {loggedIn && userData ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center gap-6 max-w-md mx-auto bg-gray-900/80 backdrop-blur-lg p-10 rounded-3xl shadow-xl border border-purple-600">
              <User className="text-6xl  px-2 py-2 text-purple-500" />
              <h2 className="text-2xl md:text-3xl font-semibold text-center">Welcome, {userData.username}!</h2>
              <p className="text-gray-400 text-center text-sm md:text-base">Explore your packages or manage your library.</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
                <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 20px #8b5cf6" }} whileTap={{ scale: 0.95 }} onClick={() => window.location.href = "/packages"} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl w-full font-medium transition-all">Packages</motion.button>
                <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 20px #9d174d" }} whileTap={{ scale: 0.95 }} onClick={() => window.location.href = "/library/mine"} className="bg-gray-800 px-6 py-3 rounded-2xl w-full hover:bg-gray-700 transition-all font-medium">Library</motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md mx-auto w-full bg-gray-900/80 backdrop-blur-lg p-10 rounded-3xl shadow-xl border border-purple-600">
              <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">{isRegister ? "Register" : "Sign In"}</h1>
              {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-md mb-6"><FaExclamationCircle /><span>{error}</span></motion.div>}
              <form onSubmit={handleAuth} className="space-y-5">
                {isRegister && <div className="relative"><FaUserCircle className="absolute top-4 left-3 text-gray-500" /><input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100 placeholder-gray-400 transition-all" /></div>}
                <div className="relative"><FaUserCircle className="absolute top-4 left-3 text-gray-500" /><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100 placeholder-gray-400 transition-all" /></div>
                <div className="relative"><FaLock className="absolute top-4 left-3 text-gray-500" /><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100 placeholder-gray-400 transition-all" /></div>
                <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: isSubmitting ? 1 : 1.05 }} whileTap={{ scale: isSubmitting ? 1 : 0.95 }} className={`w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:from-pink-500 hover:to-purple-600"}`}>{isRegister ? <FaUserPlus /> : <FaSignInAlt />}{isSubmitting ? (isRegister ? "Registering..." : "Signing In...") : (isRegister ? "Register" : "Sign In")}</motion.button>
              </form>
              <div className="text-center mt-6 flex justify-center items-center gap-2">
                <span className="text-gray-400">{isRegister ? "Zaten bir hesabınız var mı?" : "Hesabınız yok mu?"}</span>
                <button onClick={() => { setIsRegister(!isRegister); setError(""); }} className="text-pink-500 hover:text-pink-600 font-medium transition-colors">{isRegister ? "Giriş Yap" : "Kayıt ol"}</button>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div className="hidden md:flex w-1/2 flex-col items-center justify-center relative rounded-l-3xl overflow-hidden p-10 bg-gray-900/70 backdrop-blur-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <h2 className="text-4xl font-bold text-white text-center mb-6">Discover the Future of Gaming</h2>
          <p className="text-gray-200 text-center mb-8">Fast, Secure & Premium platform for all your game management needs.</p>
          <div className="flex flex-col gap-6 w-full max-w-sm">
            <div className="flex items-center gap-4"><FaRocket className="text-purple-300 text-2xl" /><span>🚀 Fast & Secure</span></div>
            <div className="flex items-center gap-4"><FaShieldAlt className="text-purple-300 text-2xl" /><span>🔒 Account Protection</span></div>
            <div className="flex items-center gap-4"><FaGamepad className="text-purple-300 text-2xl" /><span>🎮 Premium Cheats</span></div>
          </div>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 20px #fff" }} whileTap={{ scale: 0.95 }} className="mt-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-xl font-semibold">Get Started</motion.button>
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />

      <style>{`
        @keyframes blob {
          0%, 100% { transform: scale(1) translate(0,0); }
          33% { transform: scale(1.1) translate(20px,-10px); }
          66% { transform: scale(0.9) translate(-15px,10px); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
      `}</style>
    </div>
  );
}
