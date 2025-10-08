import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

interface Props {
  user: any;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: Props) {
  return (
    <div className="w-full flex justify-between items-center p-4 bg-gray-900/80 backdrop-blur-sm fixed top-0 z-20">
      <span className="text-2xl font-bold text-red-500">ShertyCheats</span>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <FaUserCircle /> {user.username}
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <button className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition">
            Sign In
          </button>
          <button className="bg-gray-800 px-3 py-1 rounded-md hover:bg-gray-700 transition">
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
