import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Trophy, RotateCcw, Home, TrendingUp, Target, Clock, CheckCircle2 } from "lucide-react";
import { NeuroStepLayout, GlowButton } from "./NeuroStepLayout";
import { UserHeader } from "./UserHeader";

interface Metric {
  label: string;
  value: number;
  unit: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  color: string;
  glow: string;
}

const METRICS: Metric[] = [
  { label: "Precisão", value: 87, unit: "%", icon: Target, color: "#3B82F6", glow: "rgba(59,130,246,0.4)" },
  { label: "Equilíbrio", value: 92, unit: "%", icon: TrendingUp, color: "#22C55E", glow: "rgba(34,197,94,0.4)" },
  { label: "Tempo", value: 3, unit: "min", icon: Clock, color: "#F59E0B", glow: "rgba(245,158,11,0.4)" },
];

function RadialProgress({ value, color, glow, size = 120 }: { value: number; color: string; glow: string; size?: number }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const stroke = circumference - (displayed / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 2;
        if (current >= value) {
          setDisplayed(value);
          clearInterval(interval);
        } else {
          setDisplayed(current);
        }
      }, 20);
      return () => clearInterval(interval);
    }, 400);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1E293B"
          strokeWidth={10}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={circumference}
          strokeDashoffset={stroke}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dashoffset 0.05s linear" }}
        />
      </svg>
    </div>
  );
}

function getRating(avg: number): { label: string; color: string; emoji: string } {
  if (avg >= 90) return { label: "Excelente!", color: "#22C55E", emoji: "🏆" };
  if (avg >= 75) return { label: "Muito Bom!", color: "#3B82F6", emoji: "⭐" };
  if (avg >= 60) return { label: "Bom!", color: "#F59E0B", emoji: "👍" };
  return { label: "Continue Treinando", color: "#64748B", emoji: "💪" };
}

export function ResultsScreen() {
  const navigate = useNavigate();
  const avg = Math.round(METRICS.slice(0, 2).reduce((a, m) => a + m.value, 0) / 2);
  const rating = getRating(avg);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <NeuroStepLayout>
      <UserHeader />
      <div className="flex-1 flex flex-col min-h-screen px-10 py-10 items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10"
        >
          <p className="text-[#64748B] text-sm tracking-widest uppercase mb-2">Treino Concluído</p>
          <h2 className="text-5xl text-white" style={{ fontWeight: 800 }}>
            Resultado
          </h2>
        </motion.div>

        {/* Rating badge */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="flex flex-col items-center gap-4 mb-12"
        >
          <motion.div
            animate={{
              boxShadow: [
                `0 0 40px ${rating.color}60`,
                `0 0 80px ${rating.color}90`,
                `0 0 40px ${rating.color}60`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-40 h-40 rounded-full flex items-center justify-center border-4"
            style={{
              borderColor: rating.color,
              backgroundColor: `${rating.color}15`,
            }}
          >
            <span className="text-7xl">{rating.emoji}</span>
          </motion.div>
          <div
            className="px-8 py-3 rounded-full text-3xl"
            style={{
              color: rating.color,
              backgroundColor: `${rating.color}20`,
              border: `2px solid ${rating.color}60`,
              fontWeight: 700,
              boxShadow: `0 0 25px ${rating.color}40`,
            }}
          >
            {rating.label}
          </div>
        </motion.div>

        {/* Metrics */}
        {showContent && (
          <div className="grid grid-cols-3 gap-6 w-full max-w-2xl mb-10">
            {METRICS.map((m, i) => {
              const Icon = m.icon;
              const isTime = m.unit === "min";
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-[#1E293B] border border-[#334155]"
                  style={{ boxShadow: `0 0 20px ${m.glow}` }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${m.color}20` }}
                  >
                    <Icon size={28} className="" style={{ color: m.color } as React.CSSProperties} />
                  </div>

                  {isTime ? (
                    <div className="flex flex-col items-center">
                      <span className="text-4xl text-white" style={{ fontWeight: 700 }}>
                        {m.value}
                        <span className="text-xl text-[#64748B]">{m.unit}</span>
                      </span>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <RadialProgress value={m.value} color={m.color} glow={m.glow} size={100} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl" style={{ color: m.color, fontWeight: 700 }}>
                          {m.value}%
                        </span>
                      </div>
                    </div>
                  )}

                  <span className="text-[#64748B] text-sm uppercase tracking-wide">{m.label}</span>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Achievement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#1E293B] border border-[#334155] mb-10 w-full max-w-2xl"
        >
          <CheckCircle2 size={24} className="text-[#22C55E] flex-shrink-0" />
          <div>
            <p className="text-white text-sm" style={{ fontWeight: 600 }}>Conquista Desbloqueada</p>
            <p className="text-[#64748B] text-xs">Primeira sessão de Balance Board concluída!</p>
          </div>
          <Trophy size={24} className="text-[#F59E0B] ml-auto flex-shrink-0" />
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 w-full max-w-2xl"
        >
          {/* Finalizar */}
          <button
            onClick={() => navigate("/")}
            className="flex-1 flex items-center justify-center gap-3 py-6 rounded-2xl border-2 border-[#334155] text-[#94A3B8] hover:border-[#475569] hover:text-white transition-all cursor-pointer text-xl"
          >
            <Home size={26} />
            Finalizar
          </button>

          {/* Próximo Exercício */}
          <GlowButton
            color="green"
            onClick={() => navigate("/exercises")}
            className="flex-1 flex items-center justify-center gap-3 py-6 text-xl"
          >
            <RotateCcw size={26} />
            Próximo Exercício
          </GlowButton>
        </motion.div>

        {/* Score summary at bottom */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-[#475569] text-sm text-center"
        >
          Pontuação média: <span className="text-white">{avg}%</span> · Sessão salva no seu perfil
        </motion.p>
      </div>
    </NeuroStepLayout>
  );
}