// components/Sidebar.tsx
import { FaBox, FaBook, FaCog } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-900 p-4 gap-6 h-screen fixed top-0 left-0">
      <span className="text-red-500 font-bold text-xl mb-6">Menu</span>
      <ul className="flex flex-col gap-4">
        <li className="flex items-center gap-3 cursor-pointer hover:text-red-500 transition">
          <FaBox /> Dashboard
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-red-500 transition">
          <FaBox /> Packages
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-red-500 transition">
          <FaBook /> Library
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-red-500 transition">
          <FaCog /> Settings
        </li>
      </ul>
    </div>
  );
}
