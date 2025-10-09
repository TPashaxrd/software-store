import { useEffect, useState, FormEvent, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { data } from "../config/data";
import { toast } from "react-toastify";

interface Message { sender: string; text: string; createdAt: string; }
interface TicketProps {
  _id: string;
  status: string;
  cheatId: { _id: string; title: string; };
  messages: Message[];
}
interface User { _id: string; username: string; email: string; isAdmin?: boolean; }

export default function Ticket() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketProps | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          headers: user.isAdmin ? { "x-admin-password": "2443" } : { "x-user-id": user._id },
          withCredentials: true,
        });
        setTicket(res.data);
      } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.message || "Ticket yüklenemedi.");
      } finally { setLoading(false); }
    }
    fetchTicket();
  }, [id, user]);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [ticket?.messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ticket || !user) return;

    try {
      const headers: any = { withCredentials: true };
      if (user.isAdmin) headers["x-admin-password"] = "2443";
      else headers["x-user-id"] = user._id;

      const res = await axios.post(`${data.api}/api/tickets/${ticket._id}/messages`,
        { text: newMessage },
        { headers }
      );

      setTicket((prev) => prev ? { ...prev, messages: [...prev.messages, res.data] } : prev);
      setNewMessage("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Mesaj gönderilemedi.");
    }
  };

  if (loading) return <div className="text-gray-300 text-center mt-20 animate-pulse">Yükleniyor...</div>;
  if (!ticket) return <div className="text-gray-300 text-center mt-20">Ticket bulunamadı.</div>;

  return (
    <div className="min-h-screen mt-14 bg-gray-900 text-white flex flex-col">
      <Navbar user={user} />

      <div className="flex-1 flex flex-col p-6 gap-6 w-full">
        <h1 className="text-3xl font-bold text-purple-400 drop-shadow-lg">Ticket: {ticket.cheatId.title}</h1>
        <p className="text-gray-400 font-medium">
          Status: <span className={ticket.status === "open" ? "text-green-400" : "text-red-500"}>{ticket.status.toUpperCase()}</span>
        </p>
        <span>
            You are logged in as: <span className="text-purple-400 font-semibold">{user?.username}</span><br/>
            Ticket ID: <span className="text-purple-400 font-semibold">{ticket._id}</span>
            For this order: <span className="text-purple-400 font-semibold">{ticket.cheatId._id}</span>
        </span>

        <div className="flex-1 overflow-y-auto bg-gray-800 rounded-xl p-6 flex flex-col gap-4 shadow-lg scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-700">
          {ticket.messages.map((msg, idx) => {
            const isUser = msg.sender === "user";
            return (
              <div key={idx} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                <div className={`rounded-2xl px-4 py-2 max-w-[70%] font-medium
                  ${isUser ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-200"}`}>
                  {msg.text}
                </div>
                <span className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-3 mt-4 w-full">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesaj yaz..."
            className="flex-1 p-3 rounded-2xl border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 transition-all"
          />
          <button
            type="submit"
            className="bg-purple-600 px-5 py-2 rounded-2xl font-semibold hover:bg-purple-700 shadow transition-colors"
          >
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
}
