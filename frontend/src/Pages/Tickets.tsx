import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { motion } from "framer-motion";

export default function MyTickets() {
  const [userData, setUserData] = useState<any | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await fetch("http://localhost:5000/api/auth/me", { credentials: "include" });
        if (!userRes.ok) { setUserData(null); setLoading(false); return; }

        const userData = await userRes.json();
        setUserData(userData.user);

        const ticketRes = await fetch(`http://localhost:5000/api/tickets/user/${userData.user._id}`, { credentials: "include" });
        if (!ticketRes.ok) setTickets([]);
        else setTickets(await ticketRes.json());
      } catch (err: any) {
        console.error(err);
        setError("Veri alınırken bir hata oluştu.");
      } finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });
      window.location.reload();
    } catch { console.error("Failed to logout. Please try again."); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-14 h-14 border-4 border-t-purple-500 border-gray-700 rounded-full" />
      </div>
    );
  }

  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">
      <p>{error}</p>
    </div>
  );

  return (
    <>
      <title>Shanzy - My Tickets</title>
      <Navbar user={userData} onLogout={handleLogout} />

      {userData ? (
        <div className="min-h-screen mt-3 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6 pt-20">
          <h1 className="text-4xl font-extrabold mb-6 text-purple-400 drop-shadow-lg">
            My Tickets
          </h1>
          <p className="text-gray-400 mb-8">Here you can view and manage your support tickets.</p>

          {tickets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket._id}
                  layout
                  whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(168,85,247,0.7)" }}
                  className="bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl border border-gray-700 hover:border-purple-500 shadow-lg transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-2xl font-semibold text-white">{ticket.cheatId?.title || "Unknown Cheat"}</h2>
                    <span className={`px-4 py-1 rounded-xl text-sm font-medium ${ticket.status === "closed" ? "bg-red-600" : "bg-green-600"}`}>
                      {ticket.status?.toUpperCase() || "OPEN"}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-3">Ticket ID: {ticket._id}</p>

                  <div className="flex justify-end">
                    <a
                      href={`/ticket/${ticket._id}`}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-5 py-2 rounded-2xl transition shadow-md"
                    >
                      View Ticket
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-16 text-lg">You have no tickets yet.</p>
          )}
        </div>
      ) : (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6 pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
            <p className="text-gray-400 mb-6">You need to be logged in to view your tickets.</p>
            <a href="/login" className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition">
              Go to Login
            </a>
          </div>
        </div>
      )}
    </>
  );
}