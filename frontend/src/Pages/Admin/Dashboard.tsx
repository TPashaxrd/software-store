import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { data } from "../../config/data";
import { FaUsers, FaGamepad, FaTicketAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";

interface StateProps {
  userCount: number;
  cheatCount: number;
  ticketCount: number;
  openTickets: number;
  closedTickets: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<StateProps | null>(null);

  useEffect(() => {
    async function fetchStats() {
        const password = prompt("Admin şifresini gir:");
        if (!password) return toast.error("Şifre girilmedi.");
      try {
        const res = await axios.post(`${data.api}/api/admin/dashboard/stats`, {
          password,
        });
        setStats(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchStats();
  }, []);

  if (!stats)
    return (
      <div className="text-gray-400 text-center mt-10 animate-pulse">
        Loading dashboard...
      </div>
    );

  const cards = [
    { title: "Total Users", value: stats.userCount, icon: <FaUsers className="text-blue-400 text-3xl" /> },
    { title: "Total Cheats", value: stats.cheatCount, icon: <FaGamepad className="text-purple-400 text-3xl" /> },
    { title: "Total Tickets", value: stats.ticketCount, icon: <FaTicketAlt className="text-yellow-400 text-3xl" /> },
    { title: "Open Tickets", value: stats.openTickets, icon: <FaTimesCircle className="text-red-400 text-3xl" /> },
    { title: "Closed Tickets", value: stats.closedTickets, icon: <FaCheckCircle className="text-green-400 text-3xl" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <h2 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <motion.div
            key={i}
            className="bg-[#181820] border border-gray-800 rounded-2xl p-5 shadow-md hover:shadow-purple-600/20 transition-all duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300 font-semibold text-lg">{c.title}</span>
              {c.icon}
            </div>
            <p className="text-3xl font-bold text-white">{c.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
