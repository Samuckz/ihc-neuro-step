import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mic, Zap, Activity } from "lucide-react";
import { NeuroStepLayout, GlowButton } from "./NeuroStepLayout";

export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <NeuroStepLayout>
      <div className="flex-1 flex flex-col items-center justify-between px-8 py-16 min-h-screen">
        {/* Header / Logo area */}
        <div className="flex flex-col items-center gap-6">
          {/* Top status bar */}
          <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-[#1E293B] border border-[#334155]">
            <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse shadow-[0_0_8px_#22C55E]" />
            <span className="text-[#94A3B8] text-sm tracking-widest uppercase">Sistema Ativo</span>
          </div>
        </div>

        {/* Central content */}
        <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
          {/* Logo / Title */}
          <div className="flex flex-col items-center gap-4">
            {/* Icon mark */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 40px rgba(59,130,246,0.4)",
                  "0 0 80px rgba(59,130,246,0.7)",
                  "0 0 40px rgba(59,130,246,0.4)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-40 h-40 rounded-[40px] bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Activity size={72} color="white" strokeWidth={1.5} />
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center"
            >
              <h1
                className="text-9xl tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #F8FAFC 0%, #3B82F6 50%, #22C55E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 800,
                  letterSpacing: "-2px",
                }}
              >
                NeuroStep
              </h1>
              <p className="text-[#64748B] text-2xl mt-2 tracking-wider">
                Treinamento Inteligente
              </p>
            </motion.div>
          </div>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex gap-4 flex-wrap justify-center"
          >
            {[
              { icon: <Zap size={18} />, label: "IA em Tempo Real" },
              { icon: <Activity size={18} />, label: "Feedback Visual" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#1E293B] border border-[#334155] text-[#94A3B8]"
              >
                <span className="text-[#3B82F6]">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-full"
          >
            <GlowButton
              color="blue"
              onClick={() => navigate("/config")}
              className="w-full py-10 text-4xl flex items-center justify-center gap-4 rounded-3xl"
            >
              <Zap size={40} strokeWidth={2} />
              Iniciar Treino
            </GlowButton>
          </motion.div>

        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-2 opacity-30">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            ))}
          </div>
          <span className="text-[#475569] text-xs tracking-widest uppercase">
            Posicione-se na plataforma
          </span>
        </div>
      </div>
    </NeuroStepLayout>
  );
}
