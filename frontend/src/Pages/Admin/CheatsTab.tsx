import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaSave } from "react-icons/fa";
import { Hammer } from "lucide-react";

interface Cheat {
  _id: string;
  cheatId: string;
  title: string;
  price: number;
  game: string;
  uploadedBy?: { username: string };
}

export default function CheatsTab({ cheats }: { cheats: Cheat[] }) {
  const [selectedCheat, setSelectedCheat] = useState<Cheat | null>(null);
  const [editData, setEditData] = useState<Partial<Cheat>>({});

  async function updateCheat() {
    if (!selectedCheat) return;
    try {
      const password = prompt("Admin şifresini gir:");
      if (!password) return toast.error("Şifre girilmedi.");

      const res = await axios.post(
        `http://localhost:5000/api/admin/cheat/update/${selectedCheat.cheatId}`,
        { ...editData, password }
      );
      toast.success("✅ Cheat başarıyla güncellendi!");
      console.log(res.data);
      setSelectedCheat(null);
      setEditData({});
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Güncelleme başarısız!");
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-2">
        Cheats Management <span><Hammer /></span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cheats.map((c) => (
          <motion.div
            key={c._id}
            className="bg-[#181820] border border-gray-800 hover:border-purple-600 transition-all duration-300 rounded-2xl p-5 shadow-md hover:shadow-purple-800/30"
            whileHover={{ y: -4 }}
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-white">{c.title}</h3>
              <p className="text-gray-400 text-sm">🎯 {c.game}</p>
              <p className="text-purple-400 mt-2 font-semibold">${c.price}</p>
              {c.uploadedBy && (
                <p className="text-xs text-gray-500">
                  Uploaded by: {c.uploadedBy.username}
                </p>
              )}

              <button
                onClick={() => {
                  setSelectedCheat(c);
                  setEditData({
                    title: c.title,
                    game: c.game,
                    price: c.price,
                  });
                }}
                className="mt-3 bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              >
                <FaEdit /> Düzenle
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedCheat && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#181820] mt-8 p-6 rounded-2xl shadow-lg border border-purple-800"
        >
          <h3 className="text-xl font-semibold mb-4 text-purple-400">
            ✏️ {selectedCheat.title} Cheat Güncelle
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Başlık"
              value={editData.title || ""}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="p-3 rounded-xl bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <input
              type="text"
              placeholder="Oyun"
              value={editData.game || ""}
              onChange={(e) =>
                setEditData({ ...editData, game: e.target.value })
              }
              className="p-3 rounded-xl bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <input
              type="number"
              placeholder="Fiyat"
              value={editData.price || ""}
              onChange={(e) =>
                setEditData({ ...editData, price: Number(e.target.value) })
              }
              className="p-3 rounded-xl bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={() => setSelectedCheat(null)}
              className="px-5 py-2 bg-gray-700 rounded-xl hover:bg-gray-800 transition font-semibold"
            >
              İptal
            </button>
            <button
              onClick={updateCheat}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
            >
              <FaSave /> Kaydet
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
