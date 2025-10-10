import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { data } from "../../config/data";

interface Ticket {
  _id: string;
  status: string;
  order: string;
  checkoutId: string;
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

  async function submitOrder({ userId, cheatId, ticketId }: { userId: string; cheatId: string, ticketId: string }) {
    try {
      const password = prompt("Lütfen kullanıcının şifresini girin:");
      if (!password) return toast.error("Password girilmedi.");

      const res = await axios.post(`${data.api}/api/admin/user/cheat/add/${userId}`, { cheatId, ticketId, password });
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white p-4">
    <h2 className="text-2xl font-bold mb-6 text-purple-400">🎟️ Tickets Dashboard</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-[#181820] p-4 rounded-2xl shadow-inner overflow-y-auto max-h-[80vh]">
        {tickets.length === 0 ? (
            <p className="text-gray-400 text-center py-6">Hiç ticket bulunamadı.</p>
        ) : (
            <div className="flex flex-col gap-4">
            {tickets.map((t) => (
                <div
                key={t._id}
                onClick={() => setSelectedTicket(t)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    selectedTicket?._id === t._id
                    ? "border-purple-500 bg-purple-800 shadow-lg"
                    : "border-gray-700 bg-gray-800 hover:border-purple-400 hover:bg-gray-700"
                }`}
                >
                <div className="flex justify-between items-center">
                    <div>
                    <p className="font-bold text-lg text-white">{t.cheatId?.title || "Unknown Cheat"}</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-sm">
                        <span
                        className={`px-2 py-1 rounded-full font-semibold ${
                            t.status === "open"
                            ? "bg-green-700 text-green-200"
                            : t.status === "closed"
                            ? "bg-red-700 text-red-200"
                            : "bg-yellow-700 text-yellow-200"
                        }`}
                        >
                        {t.status.toUpperCase()}
                        </span>
                        {t.order && t.order !== "N/A" && (
                        <span
                            className={`px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${
                            t.order.toLowerCase().includes("successfully")
                                ? "bg-green-700 text-green-200"
                                : "bg-gray-700 text-gray-200"
                            }`}
                        >
                            {t.order.toLowerCase().includes("successfully") && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            )}
                            {t.order}
                        </span>
                        )}
                    </div>
                    </div>
                    <div className="flex gap-2">
                    {t.status === "open" ? (
                        <button
                        onClick={(e) => { e.stopPropagation(); closeTicket(t._id); }}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-semibold transition shadow"
                        >
                        Close
                        </button>
                    ) : (
                        <button
                        onClick={(e) => { e.stopPropagation(); reopenTicket(t._id); }}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-sm font-semibold transition shadow"
                        >
                        Reopen
                        </button>
                    )}
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>

        <div className="md:col-span-2 bg-[#181820] p-6 rounded-2xl flex flex-col shadow-lg">
        {selectedTicket ? (
            <>
            <div className="bg-[#1f1f2a] p-4 rounded-2xl shadow-md mb-4">
            <h3 className="text-2xl font-semibold text-purple-400 mb-2">
                {selectedTicket.cheatId?.title || "Ticket Başlığı Yok"}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-gray-300">
                <div>
                <span className="font-semibold text-white">User:</span>{" "}
                {selectedTicket.userId?.username || "Unknown"}
                </div>
                <div>
                <span className="font-semibold text-white">Checkout ID:</span>{" "}
                <span
                    className={`${
                    selectedTicket.checkoutId?.toLowerCase().includes("successfully")
                        ? "text-green-400"
                        : "text-gray-300"
                    } font-medium`}
                >
                    {selectedTicket.checkoutId || "N/A"}
                </span>
                </div>
            </div>
            </div>

            <button
                onClick={() =>
                submitOrder({
                    userId: selectedTicket.userId._id,
                    cheatId: selectedTicket.cheatId.cheatId,
                    ticketId: selectedTicket._id,
                })
                }
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-6 py-3 mb-4 shadow-md transition"
            >
                Siparişi Tamamla ✅
            </button>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-[#111] p-4 rounded-2xl space-y-3 mb-4 max-h-[50vh] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-700">
                {selectedTicket.messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === "admin" ? "items-end text-right" : "items-start text-left"}`}
                >
                    <div
                    className={`px-4 py-2 rounded-2xl max-w-[75%] break-words ${
                        msg.sender === "admin" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-200"
                    }`}
                    >
                    {msg.text}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                ))}
            </div>

            <div className="flex gap-3 mt-auto">
                <input
                type="text"
                placeholder="Mesaj yaz..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-4 rounded-2xl border border-gray-700 bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-500 transition-all"
                />
                <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-purple-600 px-6 py-3 rounded-2xl font-semibold hover:bg-purple-700 transition shadow-md"
                >
                Gönder
                </button>
            </div>
            </>
        ) : (
            <p className="text-gray-400 text-center mt-20 font-medium">Mesajları görmek için bir ticket seçin.</p>
        )}
        </div>
    </div>
    </motion.div>
  );
}