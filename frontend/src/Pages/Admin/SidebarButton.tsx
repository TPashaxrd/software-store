import React from "react";

interface Props {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

export default function SidebarButton({ label, icon, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl text-left transition ${
        active
          ? "bg-purple-700 text-white"
          : "bg-[#1c1c25] hover:bg-purple-900/40 text-gray-400"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}