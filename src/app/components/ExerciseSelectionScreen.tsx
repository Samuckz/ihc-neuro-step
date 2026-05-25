import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft, Play, Clock, Flame, Star } from "lucide-react";
import { NeuroStepLayout, GlowButton } from "./NeuroStepLayout";
import { UserHeader } from "./UserHeader";

const EXERCISES = [
  {
    id: "equilíbrio",
    name: "Equilíbrio Unipodal",
    duration: "3 min",
    intensity: "Leve",
    stars: 1,
    emoji: "🦶",
    color: "#3B82F6",
    description: "Sustentação em um pé",
  },
  {
    id: "agachamento",
    name: "Agachamento Funcional",
    duration: "5 min",
    intensity: "Moderado",
    stars: 2,
    emoji: "🏋️",
    color: "#22C55E",
    description: "Força e estabilidade",
  },
  {
    id: "lateral",
    name: "Passo Lateral",
    duration: "4 min",
    intensity: "Moderado",
    stars: 2,
    emoji: "↔️",
    color: "#3B82F6",
    description: "Agilidade e postura",
  },
  {
    id: "saltito",
    name: "Saltito Dinâmico",
    duration: "6 min",
    intensity: "Intenso",
    stars: 3,
    emoji: "⚡",
    color: "#EF4444",
    description: "Potência e reatividade",
  },
];

const intensityColor: Record<string, string> = {
  Leve: "#22C55E",
  Moderado: "#F59E0B",
  Intenso: "#EF4444",
};

export function ExerciseSelectionScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <NeuroStepLayout>
      <UserHeader />
      <div className="flex-1 flex flex-col min-h-screen px-10 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/training-type")}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white hover:border-[#475569] transition-all cursor-pointer"
          >
            <ChevronLeft size={24} />
            <span className="text-lg">Voltar</span>
          </button>
          <div className="text-center">
            <p className="text-[#64748B] text-sm tracking-widest uppercase">Passo 3 de 3</p>
            <h2 className="text-3xl text-white mt-1">Exercício</h2>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-2 w-10 rounded-full"
                style={{
                  backgroundColor: "#3B82F6",
                  boxShadow: "0 0 10px rgba(59,130,246,0.7)",
                }}
              />
            ))}
          </div>
        </div>

        <p className="text-[#64748B] text-xl text-center mb-8">
          Escolha o exercício de hoje
        </p>

        {/* Exercise grid */}
        <div className="grid grid-cols-2 gap-5 max-w-2xl mx-auto w-full flex-1">
          {EXERCISES.map((ex, idx) => {
            const isSelected = selected === ex.id;
            return (
              <motion.button
                key={ex.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(ex.id)}
                className="relative p-6 rounded-3xl border-2 text-left cursor-pointer transition-all overflow-hidden"
                style={{
                  borderColor: isSelected ? ex.color : "#1E293B",
                  backgroundColor: "#1E293B",
                  boxShadow: isSelected ? `0 0 30px ${ex.color}40` : "none",
                }}
              >
                {/* Selected overlay */}
                {isSelected && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 30% 30%, ${ex.color}20 0%, transparent 70%)`,
                    }}
                  />
                )}

                {/* Selected checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: ex.color }}
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}

                {/* Emoji */}
                <div className="text-5xl mb-3">{ex.emoji}</div>

                {/* Name */}
                <h3
                  className="text-xl mb-1 leading-tight"
                  style={{ color: isSelected ? ex.color : "#F8FAFC", fontWeight: 700 }}
                >
                  {ex.name}
                </h3>
                <p className="text-[#64748B] text-sm mb-4">{ex.description}</p>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      fill={s <= ex.stars ? ex.color : "transparent"}
                      color={s <= ex.stars ? ex.color : "#334155"}
                    />
                  ))}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1 text-[#64748B] text-xs">
                    <Clock size={12} />
                    {ex.duration}
                  </span>
                  <span
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      color: intensityColor[ex.intensity],
                      backgroundColor: `${intensityColor[ex.intensity]}20`,
                    }}
                  >
                    <Flame size={12} />
                    {ex.intensity}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-8 max-w-2xl mx-auto w-full">
          <GlowButton
            color="green"
            onClick={() => navigate("/execution")}
            disabled={!selected}
            className="flex items-center gap-4 px-16 py-6 text-2xl w-full justify-center"
          >
            <Play size={32} fill="white" strokeWidth={0} />
            Iniciar Exercício
          </GlowButton>
        </div>
      </div>
    </NeuroStepLayout>
  );
}
