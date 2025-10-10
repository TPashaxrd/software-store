import { useEffect, useState, useRef } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { data } from "../config/data";
import { motion } from "framer-motion";
import { FaPaperPlane, FaLock, FaCheckCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

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
  checkoutId: string;
  order: string;
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
      } catch {
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
      toast.error(err.response?.data?.message || "Mesaj gönderilemedi.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${data.api}/api/auth/logout`, { withCredentials: true });
      toast.success("Çıkış yapıldı!");
      window.location.reload();
    } catch {
      toast.error("Çıkış başarısız oldu.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c0b10]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-purple-500 border-gray-700 rounded-full"
        />
      </div>
    );

  if (!ticket)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Ticket bulunamadı.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />

      <h1 className="text-4xl text-[#0a0a0e]">HI<br/>HI</h1>

      <div className="w-full mt-14 max-w-5xl mx-auto px-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600/30 to-blue-500/20 backdrop-blur-md border border-purple-600/20 rounded-2xl p-6 shadow-lg"
        >
          <h1 className="text-3xl font-extrabold text-purple-400 mb-2">
            🎫 Ticket: {ticket.cheatId.title}
          </h1>
          <p className="text-gray-400">
            Status:{" "}
            <span
              className={`${
                ticket.status === "open" ? "text-green-400" : "text-red-500"
              } font-semibold`}
            >
              {ticket.status.toUpperCase()}
            </span>{" "}
            | ID:{" "}
            <span className="text-purple-400 font-semibold">{ticket._id}</span>
          </p>
          <p className="text-gray-400">
            Kullanıcı: <span className="text-purple-300">{user?.username}</span>
          </p>
        </motion.div>
      </div>

      {ticket.order?.toLowerCase().includes("successfully") && (
        <div className="flex items-center gap-2 justify-center max-w-xl bg-[#1f1f2a] border border-green-500 text-green-400 px-4 py-3 rounded-2xl mt-3 shadow-md font-semibold mx-auto">
          <FaCheckCircle className="text-green-400 text-lg" />
          Hileniz başarıyla kütüphanenize eklendi!
        </div>
      )}


      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-5xl mx-auto mt-8 bg-[#11111a]/70 border border-gray-800 rounded-2xl p-6 shadow-xl backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold text-purple-400 mb-3">💳 Ödeme Yöntemleri</h2>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>
            <strong>Shopier:</strong>{" "}
            <a href="https://shopier.com/shartyshop" className="text-purple-400 hover:underline">
              shopier.com/shartyshop
            </a>
          </li>
          <li>
            <strong>İsim ve Soy isim:</strong>{ " "}
            <span className="text-white">{data.Info}</span>
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
        <div className="bg-[#1f1f2a] p-4 rounded-2xl mt-4 shadow-md flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-gray-400 font-medium">Ödeme Açıklaması:</span>
          <span onClick={() => {
              navigator.clipboard.writeText(ticket?.checkoutId)
              toast.success("Kopyalandı!", {
                style: {
                  backgroundColor: "#1f1f2a",
                  color: "#9f7aea",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  boxShadow: "0 0 10px rgba(159, 122, 234, 0.5)",
                }
              });
          }} className="cursor-pointer text-white font-semibold break-all bg-gray-800 px-3 py-1 rounded-lg shadow-inner">
            {ticket?.checkoutId || "N/A"}
          </span>
        </div>

        <p className="text-gray-500 mt-4 text-sm">
          Ödeme yaptıktan sonra lütfen ticket üzerinden mesaj gönderin.
        </p>
      </motion.section>

        <p className="text-gray-300 text-center mt-2 animate-pulse-slow text-sm sm:text-base">
          Herhangi bir resim yüklemek için{" "}
          <a
            href="https://imgbb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 font-semibold hover:text-blue-400/80 hover:underline transition-colors"
          >
            imgbb.com
          </a>
        </p>

      <div className="flex-1 flex flex-col p-6 gap-6 w-full max-w-5xl mx-auto mt-6">
        <div className="flex-1 overflow-y-auto bg-[#13131a] rounded-2xl p-6 flex flex-col gap-4 shadow-lg border border-gray-800">
          {ticket.messages.map((msg, idx) => {
            const isUser = msg.sender === "user";
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                <div
                  className={`rounded-2xl px-5 py-3 max-w-[75%] font-medium text-sm shadow-md ${
                    isUser
                      ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                      : "bg-gray-800 text-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {!isClosed ? (
          <form onSubmit={handleSendMessage} className="flex gap-3 mt-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesaj yaz..."
              className="flex-1 p-4 rounded-2xl bg-[#0f0f14] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 transition-all"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 rounded-2xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg flex items-center gap-2"
            >
              <FaPaperPlane /> Gönder
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 justify-center bg-[#1a1a22] border border-gray-700 rounded-xl py-3 text-red-400 font-semibold">
            <FaLock /> Bu ticket kapatılmış. Mesaj gönderemezsin.
          </div>
        )}
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}