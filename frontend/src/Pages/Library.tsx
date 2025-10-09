import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBook, FaSignOutAlt, FaShoppingCart, FaUserCircle, FaDownload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { TicketIcon } from "lucide-react";

interface Cheat {
  _id: string;
  title: string;
  description?: string;
  price: number;
  game?: string;
  imageUrl?: string;
}

interface LibraryEntry {
  _id: string;
  product_id: string;
  key?: string;
  cheat?: Cheat;
}

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  libary: LibraryEntry[];
}

export default function Library() {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Cheat[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"library" | "store">("library");
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [meRes, cheatsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/me", { withCredentials: true }).catch(() => null),
          axios.get("http://localhost:5000/api/cheats", { withCredentials: true }).catch(() => null),
        ]);
        if (meRes?.status === 200) setUser(meRes.data.user);
        if (cheatsRes?.status === 200) setStore(cheatsRes.data || []);
      } catch {
        toast.error("Veriler yüklenemedi");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const ownedIds = new Set(user?.libary.map((l) => l.product_id));

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });
      toast.success("Çıkış yapıldı");
      setTimeout(() => window.location.reload(), 800);
    } catch {
      toast.error("Çıkış başarısız");
    }
  };

  const handleBuy = async (cheatId: string) => {
    if (!user) return toast.info("Satın almak için giriş yap");
    setBuyingId(cheatId);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/cheats/assign/${user._id}`,
        { cheatId },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data.message || "Satın alındı!");
        const me = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
        setUser(me.data.user);
      }
    } catch {
      toast.error("Sunucu hatası");
    } finally {
      setBuyingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-[#0c0b10] text-gray-100 font-sans overflow-x-hidden">
      <Sidebar user={user} view={view} setView={setView} handleLogout={handleLogout} />
      <main className="flex-1 ml-72 p-8">
        <Header />
        <section className="mt-8">
          <AnimatePresence mode="wait">
            {view === "library" ? (
              <LibraryView libary={user?.libary || []} />
            ) : (
              <StoreView
                items={store}
                ownedIds={ownedIds}
                buyingId={buyingId}
                handleBuy={handleBuy}
              />
            )}
          </AnimatePresence>
        </section>
      </main>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}

const Sidebar = ({ user, view, setView, handleLogout }: any) => (
  <motion.aside
    initial={{ x: -280 }}
    animate={{ x: 0 }}
    className="fixed left-0 top-0 w-72 h-full bg-gradient-to-b from-gray-900 to-black border-r border-purple-700/20 shadow-lg p-6 z-20 flex flex-col justify-between backdrop-blur-md"
  >
    <div>
      <div className="flex items-center gap-3 mb-8">
        {user?.profilePicture ? (
          <img alt="Image" src={user.profilePicture} className="w-12 h-12 rounded-full border-2 border-purple-500 shadow-md" />
        ) : (
          <FaUserCircle className="text-5xl text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
        )}
        <div>
          <div className="text-lg font-semibold text-purple-400">{user?.username || "Guest"}</div>
          <div className="text-xs text-gray-400">{user?.email || "not signed in"}</div>
        </div>
      </div>

      <nav className="flex flex-col gap-3">
        <SidebarButton icon={<FaBook />} label="My Library" active={view === "library"} onClick={() => setView("library")} />
        <SidebarButton icon={<FaShoppingCart />} label="Store / Buy" active={view === "store"} onClick={() => setView("store")} />
        <SidebarButton icon={<TicketIcon />} label="Open Ticket" onClick={() => window.location.href = "/ticket"} />
      </nav>
    </div>

    <div className="flex flex-col gap-3">
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-sm justify-center transition-all"
      >
        <FaSignOutAlt /> Çıkış Yap
      </button>
      <div className="text-xs text-gray-500 text-center">© 2025 ShartyCheat</div>
    </div>
  </motion.aside>
);

const SidebarButton = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
      active ? "bg-purple-700 text-white shadow-lg shadow-purple-700/40" : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`}
  >
    {icon} {label}
  </button>
);

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0c0b10]">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-t-purple-500 border-gray-700 rounded-full"
    />
  </div>
);

const Header = () => (
  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg border border-purple-700/20 backdrop-blur-md">
    <h1 className="text-3xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">
      My Cheat Library
    </h1>
  </div>
);

const LibraryView = ({ libary }: { libary: LibraryEntry[] }) => (
  <motion.div key="library" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {libary.length ? libary.map((entry) => (
        <motion.div key={entry._id} className="bg-gray-900/70 backdrop-blur-md rounded-xl p-4 shadow-lg border border-purple-800/40 hover:border-purple-500 transition-all">
          <img src={entry.cheat?.imageUrl || "https://via.placeholder.com/400x200"} className="w-full h-40 object-cover rounded-md mb-3" />
          <h3 className="text-lg font-semibold text-purple-300">{entry.cheat?.title}</h3>
          <p className="text-sm text-gray-300">{entry.cheat?.description || "Owned item"}</p>
          <div className="flex justify-between mt-4">
            <span className="text-gray-400">Key: <span className="text-green-400">{entry.key || "CONTACT ADMIN"}</span></span>
            <button onClick={() => toast.info("Opening cheat...")} className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md flex items-center gap-1">
              Download <FaDownload size={18} />
            </button>
          </div>
        </motion.div>
      )) : (
        <p className="text-gray-400 text-center col-span-full py-10">You don't own any cheats yet. Go to the Store to buy.</p>
      )}
    </div>
  </motion.div>
);

const StoreView = ({ items, ownedIds, buyingId, handleBuy }: any) => (
  <motion.div key="store" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {items.length ? items.map((cheat: Cheat) => {
        const owned = ownedIds.has(cheat._id);
        return (
          <motion.div key={cheat._id} className="bg-gray-900/70 backdrop-blur-md rounded-xl p-4 shadow-lg border border-purple-800/40 hover:border-purple-500 transition-all">
            <img alt="Image" src={cheat.imageUrl || "https://via.placeholder.com/400x200"} className="w-full h-40 object-cover rounded-md mb-3" />
            <h3 className="text-lg font-semibold text-purple-300">{cheat.title}</h3>
            <p className="text-sm text-gray-300">{cheat.description}</p>
            <div className="mt-2 text-xs text-gray-400">Game: {cheat.game || "—"}</div>
            <div className="flex justify-between mt-4">
              <button
                disabled={owned || buyingId === cheat._id}
                onClick={() => (owned ? toast.info("You already own this") : handleBuy(cheat._id))}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm ${
                  owned ? "bg-gray-700 text-gray-400" : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                <FaShoppingCart />
                {owned ? "Owned" : buyingId === cheat._id ? "Buying..." : "Buy"}
              </button>
              <button onClick={() => toast.info("Previewing...")} className="text-sm text-gray-400 hover:text-white">
                Preview
              </button>
            </div>
          </motion.div>
        );
      }) : <p className="text-gray-400 text-center col-span-full py-10">No cheats found.</p>}
    </div>
  </motion.div>
);