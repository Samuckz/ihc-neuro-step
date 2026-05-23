import React from "react";
import { motion } from "motion/react";

interface NeuroStepLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function NeuroStepLayout({ children, className = "" }: NeuroStepLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] overflow-x-hidden flex flex-col">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Subtle radial glow center */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 70%)",
        }}
      />
      <motion.div
        className={`relative flex-1 flex flex-col ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Glow button variants
export function GlowButton({
  children,
  onClick,
  color = "blue",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  color?: "blue" | "green" | "yellow" | "red" | "gray";
  className?: string;
  disabled?: boolean;
}) {
  const colorMap = {
    blue: {
      bg: "bg-[#3B82F6]",
      shadow: "shadow-[0_0_30px_rgba(59,130,246,0.5)]",
      hover: "hover:shadow-[0_0_50px_rgba(59,130,246,0.8)] hover:bg-[#2563EB]",
    },
    green: {
      bg: "bg-[#22C55E]",
      shadow: "shadow-[0_0_30px_rgba(34,197,94,0.5)]",
      hover: "hover:shadow-[0_0_50px_rgba(34,197,94,0.8)] hover:bg-[#16A34A]",
    },
    yellow: {
      bg: "bg-[#F59E0B]",
      shadow: "shadow-[0_0_30px_rgba(245,158,11,0.5)]",
      hover: "hover:shadow-[0_0_50px_rgba(245,158,11,0.8)] hover:bg-[#D97706]",
    },
    red: {
      bg: "bg-[#EF4444]",
      shadow: "shadow-[0_0_30px_rgba(239,68,68,0.5)]",
      hover: "hover:shadow-[0_0_50px_rgba(239,68,68,0.8)] hover:bg-[#DC2626]",
    },
    gray: {
      bg: "bg-[#1E293B]",
      shadow: "shadow-[0_0_20px_rgba(30,41,59,0.5)]",
      hover: "hover:shadow-[0_0_40px_rgba(30,41,59,0.8)] hover:bg-[#334155]",
    },
  };
  const c = colorMap[color];
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className={`
        ${c.bg} ${c.shadow} ${c.hover}
        text-white rounded-2xl transition-all duration-200 cursor-pointer
        select-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

// Status badge
export function StatusDot({ status }: { status: "correct" | "adjust" | "error" | "idle" }) {
  const map = {
    correct: { color: "#22C55E", label: "Correto" },
    adjust: { color: "#F59E0B", label: "Ajuste" },
    error: { color: "#EF4444", label: "Incorreto" },
    idle: { color: "#64748B", label: "Aguardando" },
  };
  const s = map[status];
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded-full animate-pulse"
        style={{ backgroundColor: s.color, boxShadow: `0 0 12px ${s.color}` }}
      />
      <span className="text-sm text-[#94A3B8]">{s.label}</span>
    </div>
  );
}
