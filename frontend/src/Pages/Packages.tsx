import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  isBanned?: boolean;
  date?: string;
}

interface Cheat {
  _id: string;
  title: string;
  cheatId: string;
  description?: string;
  price: number;
  game?: string;
  imageUrl?: string;
}

export default function Packages() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cheats, setCheats] = useState<Cheat[]>([]);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });
      setUserData(null);
      setLoggedIn(false);
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, cheatsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/me", { withCredentials: true }),
          axios.get("http://localhost:5000/api/cheats", { withCredentials: true }),
        ]);

        if (userRes.status === 200) {
          setUserData(userRes.data.user);
          setLoggedIn(true);
        }

        if (cheatsRes.status === 200) {
          setCheats(cheatsRes.data);
        }
      } catch (err) {
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <div className="w-12 h-12 border-4 border-t-red-500 border-gray-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-13 bg-gray-950 text-gray-100 font-sans">
      <Navbar onLogout={handleLogout} user={userData} />
      <div
        className="relative w-full h-64 md:h-96 flex items-center justify-center text-center text-white"
        style={{
          backgroundImage:
            "url('https://cdn.discordapp.com/attachments/1425509560159961168/1425843193777491979/unexif-bground.png?ex=68e90f74&is=68e7bdf4&hm=199fc85cfea3300d01d631722db09edaa454164593429be7db6f7fe54f679c12&')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <motion.h1
          className="relative text-4xl md:text-6xl font-bold drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Explore the Ultimate Cheat Packages
        </motion.h1>
      </div>      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-purple-400 drop-shadow-lg">Hilelerimiz</h1>
        {!loggedIn && (
          <p className="mb-6 text-gray-400">Please log in to see your packages and purchase cheats.</p>
        )}
        {loggedIn && cheats.length === 0 && (
          <p className="mb-6 text-gray-400">No packages available at the moment.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cheats.map((cheat) => (
            <motion.div
              key={cheat._id}
              className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-4 shadow-lg border border-purple-800/40 hover:border-purple-500 transition-all duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={cheat.imageUrl || "https://via.placeholder.com/400x200"}
                alt={cheat.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold text-purple-300">{cheat.title}</h3>
              <p className="text-sm text-gray-300 mt-1">{cheat.description || "No description available."}</p>
              <div className="mt-2 text-xs text-gray-400">Game: {cheat.game || "—"}</div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-green-400">${cheat.price.toFixed(2)}</span>
                <button
                  disabled={!loggedIn}
                  onClick={() => window.location.href = `/product/${cheat?.cheatId}`}
                  className={`px-3 py-1 font- rounded-md text-sm font-medium ${
                    loggedIn
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {loggedIn ? "İncele" : "Login to Buy"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
