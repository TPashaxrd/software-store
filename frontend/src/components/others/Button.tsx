import { Zap } from "lucide-react";

interface BigButtonProps {
  text: string;
  onClick?: () => void;
}

export default function BigButton({ text, onClick }: BigButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold rounded-xl
                 bg-gradient-to-r from-purple-600 to-indigo-600
                 hover:from-indigo-700 hover:to-purple-700
                 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.4)]
                 hover:shadow-[0_0_30px_rgba(139,92,246,0.7)]
                 active:scale-95
                 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-purple-400/10 before:to-indigo-400/10 before:opacity-0 hover:before:opacity-100 before:blur-xl
                 overflow-hidden group"
    >
      <Zap className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
      {text}
    </button>
  );
}