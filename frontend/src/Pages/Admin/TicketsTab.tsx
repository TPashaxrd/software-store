import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { data } from "../../config/data";

interface Ticket {
  _id: string;
  status: string;
  userId: { username: string; _id: string };
  cheatId: { title: string; cheatId: string };
  messages: { sender: string; text: string; createdAt: string }[];
}

export default function TicketsTab({
  tickets,
  closeTicket,
  reopenTicket,
}: {
  tickets: Ticket[];
  closeTicket: (id: string) => void;
  reopenTicket: (id: string) => void;
}) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [message, setMessage] = useState("");

  async function submitOrder({ userId, cheatId }: { userId: string; cheatId: string }) {
    try {
      const password = prompt("Lütfen kullanıcının şifresini girin:");
      if (!password) return toast.error("Password girilmedi.");

      const res = await axios.post(`${data.api}/api/admin/user/cheat/add/${userId}`, { cheatId, password });
      toast.success("Sipariş tamamlandı ✅");
      console.log(res.data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Sipariş gönderilemedi.");
    }
  }

  const handleSendMessage = async () => {
    if (!selectedTicket || !message.trim()) return;
    try {
      const res = await axios.post(`${data.api}/api/admin/ticket/msg/${selectedTicket._id}`, { text: message });
      setSelectedTicket((prev) =>
        prev ? { ...prev, messages: [...prev.messages, res.data.data] } : prev
      );
      setMessage("");
      toast.success("Mesaj gönderildi ✅");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Mesaj gönderilemedi.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white">
      <h2 className="text-2xl font-semibold mb-4">🎟️ Tickets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ticket list */}
        <div className="bg-[#181820] p-4 rounded-xl overflow-y-auto max-h-[70vh]">
          {tickets.length === 0 && <p className="text-gray-400">Hiç ticket bulunamadı.</p>}
          {tickets.map((t) => (
            <div
              key={t._id}
              onClick={() => setSelectedTicket(t)}
              className={`p-4 mb-3 rounded-lg cursor-pointer transition-all ${
                selectedTicket?._id === t._id ? "bg-purple-700" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">{t.cheatId?.title || "Unknown Cheat"}</p>
                  <p className={`text-sm ${t.status === "open" ? "text-green-400" : t.status === "closed" ? "text-red-400" : "text-yellow-400"}`}>
                    {t.status.toUpperCase()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {t.status === "open" ? (
                    <button onClick={(e) => { e.stopPropagation(); closeTicket(t._id); }} className="bg-red-700 px-3 py-1 rounded-lg text-sm">Close</button>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); reopenTicket(t._id); }} className="bg-green-700 px-3 py-1 rounded-lg text-sm">Reopen</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ticket detail */}
        <div className="bg-[#181820] p-4 rounded-xl flex flex-col">
          {selectedTicket ? (
            <>
              <h3 className="text-xl font-semibold text-purple-400 mb-4">
                Ticket: {selectedTicket.cheatId?.title} — User: {selectedTicket.userId?.username || "Unknown"}
              </h3>
              <button
                onClick={() =>
                  selectedTicket &&
                  submitOrder({ userId: selectedTicket.userId._id, cheatId: selectedTicket.cheatId.cheatId })
                }
                className="font-inter px-2 py-2 text-start bg-red-600 w-1/2 mb-4"
              >
                Siparişi Tamamla
              </button>

              <div className="flex-1 overflow-y-auto space-y-3 mb-4 bg-[#111] p-4 rounded-xl">
                {selectedTicket.messages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === "admin" ? "items-end text-right" : "items-start text-left"}`}>
                    <div className={`px-4 py-2 rounded-2xl max-w-[75%] ${msg.sender === "admin" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-200"}`}>
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Mesaj yaz..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button onClick={handleSendMessage} disabled={!message.trim()} className="bg-purple-600 px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
                  Gönder
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-center mt-20">Mesajları görmek için bir ticket seçin.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
