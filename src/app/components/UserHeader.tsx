import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { LogOut, User } from "lucide-react";
import { useUser } from "../context/UserContext";

export function UserHeader() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-b from-[#1E293B] to-transparent border-b border-[#334155] px-8 py-4"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* User info */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center"
            style={{ boxShadow: "0 0 15px rgba(59,130,246,0.4)" }}
          >
            <User size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-lg" style={{ fontWeight: 600 }}>
              {user.nome}
            </span>
            <span className="text-[#64748B] text-sm">
              Matrícula: {user.matricula}
            </span>
          </div>
        </div>

        {/* Logout button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white hover:border-[#EF4444] hover:bg-[#EF4444]/10 transition-all cursor-pointer"
        >
          <LogOut size={20} />
          <span className="text-base">Sair</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
