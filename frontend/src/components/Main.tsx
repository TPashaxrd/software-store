import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaUserCircle, FaLock, FaSignInAlt, FaExclamationCircle, FaUserPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";

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
  const [IP_Address, setIP_Address] = useState("")

  useEffect(() => {
    async function fetchIP() {
      setLoading(true)
      try {
        const res = await axios.get("https://api.ipify.org/?format=json")
        setIP_Address(res.data.ip)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchIP()
  }, [])

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
      const url = isRegister ? "http://localhost:5000/api/auth/register" : "http://localhost:5000/api/auth/login";
      const body = isRegister ? { username, email, password, IP_Address } : { email, password };

      const res = await axios.post(url, body, { withCredentials: true });

      if (res.status === 200) {
        setUserData(res.data.user);
        setLoggedIn(true);
        setEmail(""); setPassword(""); setUsername("");
        toast.success(`${isRegister ? "Registered" : "Welcome"}, ${res.data.user.username}!`, { autoClose: 3000 });
        setTimeout(() => window.location.reload(), 1500)
      }
    } catch (err: any) {
      const message = err.response?.data?.message || (isRegister ? "Registration failed." : "Login failed.");
      setError(message);
      toast.error(message, { autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });
      setUserData(null);
      setLoggedIn(false);
      toast.success("Logged out successfully!", { autoClose: 3000 });
      window.location.reload();
    } catch (err) {
      toast.error("Failed to logout. Please try again.", { autoClose: 3000 });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
        if (res.status === 200) {
          setUserData(res.data.user);
          setLoggedIn(true);
        }
      } catch {
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-14 h-14 border-4 border-t-purple-500 border-gray-700 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 font-sans">
      <Navbar user={userData} onLogout={handleLogout} />

      <div className="flex flex-1 flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 py-12">
          {loggedIn && userData ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center gap-6 max-w-md mx-auto bg-gray-900/80 p-10 rounded-2xl shadow-lg border border-purple-600">
              <FaUserCircle className="text-6xl text-purple-500" />
              <h2 className="text-2xl md:text-3xl font-semibold text-center">Welcome, {userData.username}!</h2>
              <p className="text-gray-400 text-center text-sm md:text-base">Explore your packages or manage your library.</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => window.location.href = "/packages"} className="bg-purple-500 px-6 py-3 rounded-md hover:bg-purple-600 transition-colors font-medium w-full">
                  Packages
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => window.location.href = "/library/mine"} className="bg-gray-800 px-6 py-3 rounded-md hover:bg-gray-700 transition-colors font-medium w-full">
                  Library
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-inter max-w-md mx-auto w-full bg-gray-900/70 p-10 rounded-2xl shadow-lg border border-purple-600">
              <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">{isRegister ? "Register" : "Sign In"}</h1>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-md mb-6">
                  <FaExclamationCircle />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleAuth} className="space-y-5">
                {isRegister && (
                  <div className="relative">
                    <FaUserCircle className="absolute top-4 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100 placeholder-gray-400 transition-all"
                    />
                  </div>
                )}

                <div className="relative">
                  <FaUserCircle className="absolute top-4 left-3 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100 placeholder-gray-400 transition-all"
                  />
                </div>

                <div className="relative">
                  <FaLock className="absolute top-4 left-3 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100 placeholder-gray-400 transition-all"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  className={`w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-md flex items-center justify-center gap-2 font-medium transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:from-pink-500 hover:to-purple-600"}`}
                >
                  {isRegister ? <FaUserPlus /> : <FaSignInAlt />}
                  {isSubmitting ? (isRegister ? "Registering..." : "Signing In...") : isRegister ? "Register" : "Sign In"}
                </motion.button>
              </form>

              <div className="text-center mt-6 flex justify-center items-center gap-2">
                <span className="text-gray-400">{isRegister ? "Already have an account?" : "Don't have an account?"}</span>
                <button
                  onClick={() => { setIsRegister(!isRegister); setError(""); }}
                  className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
                >
                  {isRegister ? "Sign In" : "Register"}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          className="hidden md:block w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: "url('https://blog.fivemods.io/storage/2025/01/981-1-1300x650.png')" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 rounded-l-3xl" />
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />
    </div>
  );
}