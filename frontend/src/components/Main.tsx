import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaUserCircle, FaLock, FaSignInAlt, FaExclamationCircle } from "react-icons/fa";
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
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email || !password) {
      setError("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setUserData(res.data.user);
        setLoggedIn(true);
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to login. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  async function Logout() {
    try {
        axios.get(
            `http://localhost:5000/api/auth/logout`, {
                withCredentials: true
            }
        )
        window.location.reload()
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        if (res.status === 200) {
          setUserData(res.data.user);
          setLoggedIn(true);
        }
      } catch (error: any) {
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 border-4 border-t-red-600 border-gray-700 rounded-full animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-100 font-sans">
      <Navbar user={userData} onLogout={Logout} />
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-8">
        {loggedIn && userData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6 max-w-md mx-auto"
          >
            <FaUserCircle className="text-6xl text-red-500" />
            <h2 className="text-2xl md:text-3xl font-semibold">
              Welcome, {userData.username}!
            </h2>
            <p className="text-gray-400 text-center text-sm md:text-base">
              Explore your packages or manage your library.
            </p>
            <div className="flex gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 px-6 py-2 rounded-md hover:bg-red-600 transition-colors font-medium"
              >
                Packages
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 px-6 py-2 rounded-md hover:bg-gray-700 transition-colors font-medium"
              >
                Library
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto w-full"
          >
            <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">
              Sign In
            </h1>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-md mb-4"
              >
                <FaExclamationCircle />
                <span>{error}</span>
              </motion.div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <FaUserCircle className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-100 placeholder-gray-500"
                />
              </div>
              <div className="relative">
                <FaLock className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-100 placeholder-gray-500"
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FaSignInAlt />
                {isSubmitting ? "Signing In..." : "Sign In"}
              </motion.button>
            </form>
            <div className="text-center mt-4">
              <a
                href="/forgot-password"
                className="text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                Forgot Password?
              </a>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://blog.fivemods.io/storage/2025/01/981-1-1300x650.png')",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full h-full bg-black/30" />
      </motion.div>
    </div>
  );
}