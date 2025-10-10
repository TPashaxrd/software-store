import { useEffect, useState, useRef } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { data } from "../config/data";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

interface Message {
  sender: string;
  text: string;
  createdAt: string;
}
interface Cheat {
  _id: string;
  title: string;
}
interface TicketProps {
  _id: string;
  status: string;
  cheatId: Cheat;
  messages: Message[];
}
interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
}

export default function Ticket() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketProps | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isClosed = ticket?.status === "closed";

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${data.api}/api/auth/me`, { withCredentials: true });
        setUser(res.data.user);
      } catch (err: any) {
        console.error(err);
        toast.error("Kullanıcı bilgisi alınamadı.");
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchTicket() {
      if (!id || !user) return;
      setLoading(true);
      try {
        const res = await axios.get(`${data.api}/api/tickets/${id}`, {
          headers: { "x-user-id": user._id },
          withCredentials: true,
        });
        setTicket(res.data);
      } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.message || "Ticket yüklenemedi.");
      } finally {
        setLoading(false);
      }
    }
    fetchTicket();
  }, [id, user]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [ticket?.messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ticket || !user) return;

    try {
      const res = await axios.post(
        `${data.api}/api/tickets/${ticket._id}/messages`,
        { text: newMessage },
        { headers: { "x-user-id": user._id }, withCredentials: true }
      );
      setTicket((prev) => prev ? { ...prev, messages: [...prev.messages, res.data] } : prev);
      setNewMessage("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Mesaj gönderilemedi.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });
      toast.success("Logged out successfully!", { autoClose: 3000 });
      window.location.reload();
    } catch {
      toast.error("Failed to logout. Please try again.", { autoClose: 3000 });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c0b10]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-t-purple-500 border-gray-700 rounded-full"
      />
    </div>
  );

  if (!ticket) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Ticket bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      <h1 className="text-3xl mb-12">qweqweqwe</h1>
       <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-purple-400 mb-4">Ödeme Yöntemleri</h2>
          <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
            <li>
              <strong>SHOPIER:</strong>{" "}
              <a href="https://shopier.com/shartyshop" className="text-purple-400 hover:underline">
                shopier.com/shartyshop
              </a>
            </li>
            <li>
              <strong>Papara:</strong>{" "}
              <span className="text-white">{data.paparaNo}</span>
            </li>
            <li>
              <strong>IBAN (TR):</strong>{" "}
              <span className="text-white">{data.IBAN}</span>
            </li>
          </ul>
          <p className="text-gray-400 mt-4 text-sm">
            Ödeme yaptıktan sonra lütfen ticket üzerinden mesaj atarak bize bildirin.
          </p>
        </motion.section>
      <div className="flex-1 flex flex-col p-6 gap-6 w-full max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-purple-400 drop-shadow-lg">Ticket: {ticket.cheatId.title}</h1>
        <p className="text-gray-400 font-medium">
          Status: <span className={ticket.status === "open" ? "text-green-400" : "text-red-500"}>{ticket.status.toUpperCase()}</span>
        </p>
        <p className="text-gray-400">
          Logged in as: <span className="text-purple-400 font-semibold">{user?.username}</span> | 
          Ticket ID: <span className="text-purple-400 font-semibold">{ticket._id}</span> | 
          Cheat: <span className="text-purple-400 font-semibold">{ticket.cheatId.title}</span>
        </p>

        <div className="flex-1 overflow-y-auto bg-gray-800 rounded-2xl p-6 flex flex-col gap-4 shadow-lg scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-700">
          {ticket.messages.map((msg, idx) => {
            const isUser = msg.sender === "user";
            return (
              <div key={idx} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                <div className={`rounded-2xl rounded-b-xl px-5 py-3 max-w-[70%] font-medium
                  ${isUser ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white" : "bg-gray-700 text-gray-200"}`}>
                  {msg.text}
                </div>
                <span className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

      {!isClosed && (
        <form onSubmit={handleSendMessage} className="flex gap-3 mt-4 w-full">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesaj yaz..."
            className="flex-1 p-4 rounded-2xl border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 transition-all"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-purple-700 shadow transition-all"
          >
            Gönder
          </button>
        </form>
      )}
      {isClosed && (
        <p className="text-red-500 mt-4 font-semibold">This ticket is closed. You cannot send new messages.</p>
      )}
      </div>
    </div>
  );
}