import { motion } from "framer-motion";

interface Cheat {
  _id: string;
  title: string;
  price: number;
  game: string;
  uploadedBy?: { username: string };
}

export default function CheatsTab({ cheats }: { cheats: Cheat[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-semibold mb-4">🎮 Cheats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cheats.map((c) => (
          <motion.div
            key={c._id}
            className="bg-[#181820] rounded-2xl p-4 hover:shadow-purple-700/20 transition"
            whileHover={{ scale: 1.02 }}
          >
            <p className="font-bold text-lg">{c.title}</p>
            <p className="text-sm text-gray-400">{c.game}</p>
            <p className="text-purple-400 mt-2">${c.price}</p>
            {c.uploadedBy && (
              <p className="text-xs text-gray-500 mt-1">
                Uploaded by: {c.uploadedBy.username}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}