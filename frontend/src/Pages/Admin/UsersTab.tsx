import { motion } from "framer-motion";
import { FaBan, FaCheck, FaTrash } from "react-icons/fa";

interface User {
  _id: string;
  username: string;
  email: string;
  IP_Address: string;
  isBanned: boolean;
  libary: { product_id: string; key: string; date: string }[];
}

export default function UsersTab({
  users,
  banUser,
  unbanUser,
  deleteUser,
}: {
  users: User[];
  banUser: (id: string) => void;
  unbanUser: (id: string) => void;
  deleteUser: (id: string) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-semibold mb-4">👥 Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <motion.div
            key={u._id}
            className="bg-[#181820] rounded-2xl p-4 shadow-md hover:shadow-purple-700/20 transition"
            whileHover={{ scale: 1.03 }}
          >
            <p className="font-bold text-lg">{u.username}</p>
            <p className="text-sm text-gray-400">{u.email}</p>
            <p className="text-xs text-gray-500 mt-1">IP: {u.IP_Address}</p>
            <div className="mt-3 flex gap-2">
              {u.isBanned ? (
                <button
                  onClick={() => unbanUser(u._id)}
                  className="flex items-center gap-1 bg-green-700 px-3 py-1 rounded-full text-sm"
                >
                  <FaCheck /> Unban
                </button>
              ) : (
                <button
                  onClick={() => banUser(u._id)}
                  className="flex items-center gap-1 bg-red-700 px-3 py-1 rounded-full text-sm"
                >
                  <FaBan /> Ban
                </button>
              )}
              <button
                onClick={() => deleteUser(u._id)}
                className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-full text-sm"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
