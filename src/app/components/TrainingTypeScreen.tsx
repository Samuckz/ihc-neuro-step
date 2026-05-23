import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft, ArrowRight, PersonStanding, HeartPulse, Dumbbell } from "lucide-react";
import { NeuroStepLayout, GlowButton } from "./NeuroStepLayout";
import { UserHeader } from "./UserHeader";

const TRAINING_TYPES = [
  {
    id: "mobilidade",
    label: "Mobilidade",
    icon: PersonStanding,
    description: "Melhore a amplitude de movimento e flexibilidade",
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.4)",
    borderHover: "#3B82F6",
    tag: "Iniciante",
    tagColor: "#1E40AF",
  },
  {
    id: "reabilitacao",
    label: "Reabilitação",
    icon: HeartPulse,
    description: "Recuperação guiada com baixo impacto e precisão",
    color: "#22C55E",
    glow: "rgba(34,197,94,0.4)",
    borderHover: "#22C55E",
    tag: "Terapêutico",
    tagColor: "#166534",
  },
  {
    id: "funcional",
    label: "Funcional",
    icon: Dumbbell,
    description: "Treino completo para força, equilíbrio e coordenação",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.4)",
    borderHover: "#F59E0B",
    tag: "Avançado",
    tagColor: "#78350F",
  },
];

export function TrainingTypeScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <NeuroStepLayout>
      <UserHeader />
      <div className="flex-1 flex flex-col min-h-screen px-10 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate("/config")}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white hover:border-[#475569] transition-all cursor-pointer"
          >
            <ChevronLeft size={24} />
            <span className="text-lg">Voltar</span>
          </button>
          <div className="text-center">
            <p className="text-[#64748B] text-sm tracking-widest uppercase">Passo 2 de 3</p>
            <h2 className="text-3xl text-white mt-1">Tipo de Treino</h2>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-2 rounded-full transition-all"
                style={{
                  width: i === 2 ? 40 : 16,
                  backgroundColor: i <= 2 ? "#3B82F6" : "#1E293B",
                  boxShadow: i <= 2 ? "0 0 10px rgba(59,130,246,0.7)" : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-[#64748B] text-xl text-center mb-10">
          Selecione o tipo de treino para hoje
        </p>

        {/* Training type cards */}
        <div className="flex-1 flex flex-col gap-6 max-w-2xl mx-auto w-full justify-center">
          {TRAINING_TYPES.map((type, idx) => {
            const Icon = type.icon;
            const isSelected = selected === type.id;
            return (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(type.id)}
                className="w-full text-left rounded-3xl border-2 p-8 transition-all cursor-pointer relative overflow-hidden"
                style={{
                  borderColor: isSelected ? type.color : "#1E293B",
                  backgroundColor: isSelected ? `rgba(${type.color.replace("#", "").match(/.{2}/g)!.map(h => parseInt(h, 16)).join(",")},0.1)` : "#1E293B",
                  boxShadow: isSelected ? `0 0 40px ${type.glow}` : "none",
                }}
              >
                {/* Glow bg */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse 60% 60% at 20% 50%, ${type.glow} 0%, transparent 70%)`,
                    }}
                  />
                )}

                <div className="relative flex items-center gap-6">
                  {/* Icon circle */}
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      backgroundColor: isSelected ? type.color : "#0F172A",
                      boxShadow: isSelected ? `0 0 25px ${type.glow}` : "none",
                    }}
                  >
                    <Icon size={40} color={isSelected ? "white" : type.color} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-3xl"
                        style={{ color: isSelected ? type.color : "#F8FAFC", fontWeight: 700 }}
                      >
                        {type.label}
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-xs uppercase tracking-wide"
                        style={{ backgroundColor: type.tagColor, color: type.color }}
                      >
                        {type.tag}
                      </span>
                    </div>
                    <p className="text-[#64748B] text-lg">{type.description}</p>
                  </div>

                  {/* Selection indicator */}
                  <div
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
                    style={{
                      borderColor: isSelected ? type.color : "#334155",
                      backgroundColor: isSelected ? type.color : "transparent",
                    }}
                  >
                    {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Continue */}
        <div className="flex justify-end mt-10 max-w-2xl mx-auto w-full">
          <GlowButton
            color="blue"
            onClick={() => navigate("/exercises")}
            disabled={!selected}
            className="flex items-center gap-3 px-12 py-5 text-2xl"
          >
            Selecionar Exercício
            <ArrowRight size={28} />
          </GlowButton>
        </div>
      </div>
    </NeuroStepLayout>
  );
}
