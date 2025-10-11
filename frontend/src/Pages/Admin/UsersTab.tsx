import { useState } from "react";
import { motion } from "framer-motion";
import { FaBan, FaCheck, FaPlus, FaMinus } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { data } from "../../config/data";
import { User } from "lucide-react";
import { Delete } from "../../components/others/DeleteIcon";

interface LibraryItem {
  product_id: string;
  key: string;
  date: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  IP_Address: string;
  isBanned: boolean;
  libary: LibraryItem[];
}

export default function UsersTab({
  users,
  fetchUsers,
  adminPassword,
}: {
  users: User[];
  fetchUsers: () => void;
  adminPassword: string;
}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [cheatId, setCheatId] = useState("");

  const banUser = async (id: string) => {
    try {
      await axios.post(`${data.api}/api/admin/user/ban/${id}`, { password: adminPassword });
      toast.success("Kullanıcı banlandı.");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Hata oluştu");
    }
  };

  const unbanUser = async (id: string) => {
    try {
      await axios.post(`${data.api}/api/admin/user/unban/${id}`, { password: adminPassword });
      toast.success("Ban kaldırıldı.");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Hata oluştu");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Kullanıcıyı silmek istediğine emin misin?")) return;
    try {
      await axios.post(`${data.api}/api/admin/user/delete/${id}`, { password: adminPassword });
      toast.success("Kullanıcı silindi.");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Hata oluştu");
    }
  };

  const addCheat = async () => {
    if (!selectedUser || !cheatId.trim()) return toast.error("Cheat ID boş olamaz");
    try {
      await axios.post(
        `${data.api}/api/admin/user/cheat/add/${selectedUser._id}`,
        { cheatId, password: adminPassword }
      );
      toast.success("Cheat eklendi.");
      setCheatId("");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Hile eklenemedi");
    }
  };

  const removeCheat = async (cheatId: string) => {
    if (!selectedUser) return;
    try {
      await axios.post(
        `${data.api}/api/admin/user/cheat/remove/${selectedUser._id}`,
        { cheatId, password: adminPassword }
      );
      toast.success("Cheat silindi.");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Hile silinemedi");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-6 text-purple-400 flex gap-1"><User className="mt-1" /> Users Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <motion.div
            key={u._id}
            className={`bg-[#181820] rounded-2xl p-4 shadow-md transition cursor-pointer hover:shadow-purple-700/40 ${
              selectedUser?._id === u._id ? "border-2 border-purple-500 scale-105" : "border border-gray-700"
            }`}
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelectedUser(u)}
          >
            <p className="font-bold text-lg text-white">{u.username}</p>
            <p className="text-sm text-gray-400">{u.email}</p>
            <p className="text-xs text-gray-500 mt-1">IP: {u.IP_Address}</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              {u.isBanned ? (
                <button
                  onClick={(e) => { e.stopPropagation(); unbanUser(u._id); }}
                  className="flex items-center gap-1 bg-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-600 transition"
                >
                  <FaCheck /> Unban
                </button>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); banUser(u._id); }}
                  className="flex items-center gap-1 bg-red-700 px-3 py-1 rounded-full text-sm hover:bg-red-600 transition"
                >
                  <FaBan /> Ban
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); deleteUser(u._id); }} title="Delete User"
                className="flex items-center gap-1 bg-gray-700/70 px-3 py-1 font-inter rounded-full text-sm hover:bg-gray-600 transition"
              >
                <Delete />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#181820] mt-6 p-6 rounded-2xl shadow-lg flex flex-col"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-purple-400 mb-4">{selectedUser.username} — Library</h3>

          {selectedUser.libary.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Kütüphanede hile bulunamadı.</p>
          ) : (
            <div className="flex flex-col gap-3 mb-4 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-700">
              {selectedUser.libary.map((item) => (
                <div key={item.key} className="flex justify-between items-center bg-gray-900 p-3 rounded-2xl shadow-md hover:shadow-purple-600/40 transition">
                  <div>
                    <p className="font-semibold text-white">{item.product_id}</p>
                    <p className="text-xs text-gray-400">{item.key}</p>
                  </div>
                  <button
                    onClick={() => removeCheat(item.product_id)}
                    className="flex items-center gap-1 bg-red-700 px-3 py-1 rounded-full text-sm hover:bg-red-600 transition"
                  >
                    <FaMinus /> Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-auto">
            <input
              type="text"
              placeholder="Cheat ID gir..."
              value={cheatId}
              onChange={(e) => setCheatId(e.target.value)}
              className="flex-1 p-4 rounded-2xl bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-500 transition-all"
            />
            <button
              onClick={addCheat}
              className="bg-purple-600 px-6 py-3 rounded-2xl font-semibold hover:bg-purple-700 transition flex items-center gap-2 shadow-md"
            >
              <FaPlus /> Add
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
