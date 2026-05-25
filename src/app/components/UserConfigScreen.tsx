import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, QrCode, Hash, CheckCircle2, FileText, X, ArrowRight } from "lucide-react";
import { NeuroStepLayout, GlowButton } from "./NeuroStepLayout";
import { useUser } from "../context/UserContext";

export function UserConfigScreen() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(75);
  const [age, setAge] = useState(30);
  const [sex, setSex] = useState<"M" | "F" | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<"qr" | "matricula">("qr");
  const [matricula, setMatricula] = useState("");
  const [fichaLoaded, setFichaLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoadFicha = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFichaLoaded(true);
      login(matricula);
      setTimeout(() => {
        setShowModal(false);
        navigate("/training-type");
      }, 1500);
    }, 1800);
  };

  const handleQRScan = () => {
    setLoading(true);
    const mockMatricula = `2024${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
    setTimeout(() => {
      setLoading(false);
      setFichaLoaded(true);
      login(mockMatricula);
      setTimeout(() => {
        setShowModal(false);
        navigate("/training-type");
      }, 1500);
    }, 2000);
  };

  return (
    <NeuroStepLayout>
      <div className="flex-1 flex flex-col min-h-screen px-10 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/ihc-neuro-step")}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white hover:border-[#475569] transition-all cursor-pointer"
          >
            <ChevronLeft size={24} />
            <span className="text-lg">Voltar</span>
          </button>
          <div className="text-center">
            <p className="text-[#64748B] text-sm tracking-widest uppercase">Passo 1 de 3</p>
            <h2 className="text-3xl text-white mt-1">Seu Perfil</h2>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === 1
                    ? "w-10 bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.7)]"
                    : "w-4 bg-[#1E293B]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="flex-1 flex flex-col gap-10 max-w-2xl mx-auto w-full">
          {/* Height */}
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <span className="text-[#94A3B8] text-xl tracking-wide uppercase">Altura</span>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-6xl text-[#3B82F6]"
                  style={{ fontWeight: 700, textShadow: "0 0 20px rgba(59,130,246,0.5)" }}
                >
                  {height}
                </span>
                <span className="text-[#64748B] text-2xl">cm</span>
              </div>
            </div>
            <div className="relative">
              <input
                type="range"
                min={140}
                max={210}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-4 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((height - 140) / 70) * 100}%, #1E293B ${((height - 140) / 70) * 100}%, #1E293B 100%)`,
                  outline: "none",
                }}
              />
            </div>
            <div className="flex justify-between text-[#475569] text-sm">
              <span>140 cm</span>
              <span>210 cm</span>
            </div>
          </div>

          {/* Weight */}
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <span className="text-[#94A3B8] text-xl tracking-wide uppercase">Peso</span>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-6xl text-[#3B82F6]"
                  style={{ fontWeight: 700, textShadow: "0 0 20px rgba(59,130,246,0.5)" }}
                >
                  {weight}
                </span>
                <span className="text-[#64748B] text-2xl">kg</span>
              </div>
            </div>
            <input
              type="range"
              min={40}
              max={150}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-4 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((weight - 40) / 110) * 100}%, #1E293B ${((weight - 40) / 110) * 100}%, #1E293B 100%)`,
                outline: "none",
              }}
            />
            <div className="flex justify-between text-[#475569] text-sm">
              <span>40 kg</span>
              <span>150 kg</span>
            </div>
          </div>

          {/* Age */}
          <div className="flex items-center justify-between gap-6">
            <span className="text-[#94A3B8] text-xl tracking-wide uppercase">Idade</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAge(Math.max(10, age - 1))}
                className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-[#334155] text-2xl text-white hover:border-[#3B82F6] transition-all cursor-pointer active:scale-95"
              >
                −
              </button>
              <div
                className="w-36 h-20 rounded-2xl bg-[#1E293B] border border-[#3B82F6] flex items-center justify-center"
                style={{ boxShadow: "0 0 20px rgba(59,130,246,0.2)" }}
              >
                <span className="text-5xl text-[#3B82F6]" style={{ fontWeight: 700 }}>
                  {age}
                </span>
              </div>
              <button
                onClick={() => setAge(Math.min(100, age + 1))}
                className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-[#334155] text-2xl text-white hover:border-[#3B82F6] transition-all cursor-pointer active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Sex */}
          <div className="flex flex-col gap-4">
            <span className="text-[#94A3B8] text-xl tracking-wide uppercase">Sexo</span>
            <div className="grid grid-cols-2 gap-4">
              {(["M", "F"] as const).map((s) => (
                <motion.button
                  key={s}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSex(s)}
                  className="py-8 rounded-2xl border-2 text-2xl cursor-pointer transition-all"
                  style={{
                    borderColor: sex === s ? "#3B82F6" : "#334155",
                    backgroundColor: sex === s ? "rgba(59,130,246,0.15)" : "#1E293B",
                    color: sex === s ? "#3B82F6" : "#64748B",
                    boxShadow: sex === s ? "0 0 25px rgba(59,130,246,0.3)" : "none",
                    fontWeight: 600,
                  }}
                >
                  {s === "M" ? "♂ Masculino" : "♀ Feminino"}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex items-end justify-end mt-10 max-w-2xl mx-auto w-full gap-6">
          {/* Continuar */}
          <GlowButton
            color="blue"
            onClick={() => navigate("/training-type")}
            className="flex items-end gap-3 px-12 py-5 text-2xl"
          >
            Continuar
            <ArrowRight size={28} />
          </GlowButton>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8"
            >
              <div className="w-full max-w-lg bg-[#0F172A] border border-[#334155] rounded-3xl p-8 shadow-2xl">
                {/* Modal header */}
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl text-white" style={{ fontWeight: 700 }}>
                    Carregar ficha de treino
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-12 h-12 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#64748B] hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-1.5 bg-[#1E293B] rounded-2xl mb-8">
                  {(["qr", "matricula"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setModalTab(tab)}
                      className="flex-1 py-3 rounded-xl text-lg transition-all cursor-pointer"
                      style={{
                        backgroundColor: modalTab === tab ? "#3B82F6" : "transparent",
                        color: modalTab === tab ? "white" : "#64748B",
                        fontWeight: modalTab === tab ? 600 : 400,
                        boxShadow: modalTab === tab ? "0 0 20px rgba(59,130,246,0.4)" : "none",
                      }}
                    >
                      {tab === "qr" ? "QR Code" : "Matrícula"}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  {fichaLoaded ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-4 py-8"
                    >
                      <motion.div
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        <CheckCircle2 size={80} className="text-[#22C55E]" style={{ filter: "drop-shadow(0 0 20px #22C55E)" }} />
                      </motion.div>
                      <p className="text-2xl text-[#22C55E]" style={{ fontWeight: 600 }}>
                        Ficha carregada com sucesso
                      </p>
                    </motion.div>
                  ) : modalTab === "qr" ? (
                    <motion.div
                      key="qr"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex flex-col items-center gap-6"
                    >
                      {/* QR scanner area */}
                      <div
                        className="relative w-60 h-60 rounded-2xl border-2 border-[#3B82F6] flex items-center justify-center overflow-hidden cursor-pointer"
                        style={{ boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}
                        onClick={handleQRScan}
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            {/* Scanning line animation */}
                            <motion.div
                              animate={{ y: [-100, 100, -100] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute w-full h-0.5 bg-[#3B82F6]"
                              style={{ boxShadow: "0 0 10px #3B82F6, 0 0 20px #3B82F6" }}
                            />
                            {/* Corner marks */}
                            {[
                              "top-2 left-2 border-t-2 border-l-2",
                              "top-2 right-2 border-t-2 border-r-2",
                              "bottom-2 left-2 border-b-2 border-l-2",
                              "bottom-2 right-2 border-b-2 border-r-2",
                            ].map((pos, i) => (
                              <div key={i} className={`absolute w-6 h-6 border-[#3B82F6] ${pos}`} />
                            ))}
                            <QrCode size={80} className="text-[#1E293B] opacity-30" />
                          </>
                        )}
                      </div>
                      <p className="text-[#64748B] text-lg text-center">
                        Aproxime seu código <br />
                        <span className="text-sm">ou toque para simular leitura</span>
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="matricula"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col gap-5"
                    >
                      <div className="flex flex-col gap-2">
                        <label className="text-[#94A3B8] text-sm uppercase tracking-wide">
                          Número de Matrícula
                        </label>
                        <div className="flex items-center gap-3 px-5 py-4 bg-[#1E293B] border border-[#334155] rounded-2xl focus-within:border-[#3B82F6] transition-colors">
                          <Hash size={22} className="text-[#64748B]" />
                          <input
                            type="text"
                            value={matricula}
                            onChange={(e) => setMatricula(e.target.value)}
                            placeholder="Ex: 2024001"
                            className="flex-1 bg-transparent text-white text-2xl outline-none placeholder:text-[#334155]"
                          />
                        </div>
                      </div>
                      {loading ? (
                        <div className="flex items-center justify-center py-4">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-10 h-10 border-4 border-[#3B82F6] border-t-transparent rounded-full"
                          />
                        </div>
                      ) : (
                        <GlowButton
                          color="blue"
                          onClick={handleLoadFicha}
                          disabled={!matricula}
                          className="w-full py-5 text-xl"
                        >
                          Carregar treino
                        </GlowButton>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Slider thumb style */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(59,130,246,0.8);
          border: 3px solid #0F172A;
        }
        input[type=range]::-moz-range-thumb {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(59,130,246,0.8);
          border: 3px solid #0F172A;
        }
      `}</style>
    </NeuroStepLayout>
  );
}
