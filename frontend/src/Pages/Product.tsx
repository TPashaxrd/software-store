import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { data } from "../config/data";
import { FaArrowLeft } from "react-icons/fa";

interface CheatProps {
  _id?: string;
  title: string;
  description: string;
  price: number;
  game: string;
  imageUrl: string;
  Images?: { ImageURL: string }[];
  createdAt: string;
  updatedAt: string;
}

interface UserProps {
  username: string;
  email: string;
  _id: string;
}

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<CheatProps | null>(null);
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${data.api}/api/cheats/view/${id}`);
        setItem(res.data.cheat);
        setMainImage(res.data.cheat.imageUrl);

        try {
          const res2 = await axios.get(`${data.api}/api/auth/me`, { withCredentials: true });
          setUserData(res2.data.user);
        } catch {
          setUserData(null);
        }
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleLogout = async () => {
    try {
      await axios.get(`${data.api}/api/auth/logout`, { withCredentials: true });
      toast.success("Çıkış yapıldı");
      setTimeout(() => window.location.reload(), 800);
    } catch {
      toast.error("Çıkış başarısız");
    }
  };

  const handleBuy = async () => {
    if (!userData || !item?._id) {
      toast.warning("Lütfen giriş yapın.");
      return;
    }

    try {
      const res = await axios.post(`${data.api}/api/tickets`, {
        userId: userData._id,
        cheatId: item._id,
        firstMessage: `Satın alma isteği gönderildi: ${item.title}`,
      });
      setTimeout(() => navigate(`/ticket/${res.data._id}`), 1500);
      toast.success("Ticket başarıyla açıldı!");
      console.log("Yeni ticket:", res.data);

      // istersen direk yönlendirebiliriz:
      // navigate(`/ticket/${res.data._id}`);

    } catch (err: any) {
      console.error(err);
      toast.error("Ticket oluşturulamadı.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-14 h-14 border-4 border-t-purple-500 border-gray-700 rounded-full"
        />
      </div>
    );
  }

  if (!item) {
    return <div className="text-white text-center mt-20 text-xl">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16">
      <Navbar user={userData} onLogout={handleLogout} />

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-purple-400 font-semibold ml-6 mt-6 hover:text-purple-600 transition-colors"
      >
        <FaArrowLeft /> Geri Git
      </button>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
        {/* Sol taraf: Görseller */}
        <motion.div
          className="md:w-1/2 flex flex-col items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-full overflow-hidden rounded-2xl border border-purple-500/30 shadow-2xl group">
            <motion.img
              key={mainImage}
              src={mainImage}
              alt={item.title}
              className="w-full h-[450px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {item.Images && item.Images.length > 0 && (
            <motion.div
              className="w-full flex gap-4 justify-center flex-wrap mt-3"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {item.Images.map((img, idx) => (
                <motion.img
                  key={idx}
                  src={img.ImageURL}
                  alt={`Screenshot ${idx + 1}`}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => setMainImage(img.ImageURL)}
                  className={`w-32 h-24 object-cover rounded-lg border-2 cursor-pointer transition-all ${
                    mainImage === img.ImageURL
                      ? "border-purple-500 shadow-[0_0_15px_#a855f7]"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Sağ taraf: Bilgiler */}
        <motion.div
          className="md:w-1/2 flex flex-col justify-between"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl font-bold text-purple-400">{item.title}</h1>
            <p className="text-gray-300 text-lg leading-relaxed">{item.description}</p>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">
              <p className="text-gray-400 text-sm md:text-base">
                Game: <span className="text-white">{item.game}</span>
              </p>
              <p className="text-gray-400 text-sm md:text-base">
                Uploaded: <span className="text-white">{new Date(item.createdAt).toLocaleDateString()}</span>
              </p>
            </div>

            <span className="text-3xl font-semibold text-green-400 mt-4">{item.price.toFixed(2)}</span>

            <div className="mt-6 p-5 bg-gray-800/60 rounded-xl border border-purple-600/50 shadow-md">
              <h2 className="text-xl font-bold text-purple-400 mb-2">How to Use</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                "Usage instructions will be here. After purchase, you will get full guide."
                <br />
                <span className="italic text-md text-gray-400">
                  "Kullanım talimatları burada olacak. Satın aldıktan sonra tam bir rehber alacaksınız."
                </span>
              </p>
            </div>
          </div>

          <motion.button
            disabled={!userData}
            whileHover={userData ? { scale: 1.03 } : {}}
            whileTap={userData ? { scale: 0.97 } : {}}
            onClick={handleBuy}
            className={`mt-8 py-4 rounded-xl text-xl font-semibold w-full transition-all ${
              userData
                ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 shadow-lg text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {userData ? "Buy Now" : "Login to Buy"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
