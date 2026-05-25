import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Pause, Play, X, Volume2 } from "lucide-react";
import { NeuroStepLayout } from "./NeuroStepLayout";
import { UserHeader } from "./UserHeader";

type FeedbackStatus = "correct" | "adjust" | "error" | "idle";
type LimbType = "left-foot" | "right-foot" | "left-hand" | "right-hand";

interface Zone {
  id: string;
  status: FeedbackStatus;
  active: boolean;
  limb?: LimbType;
}

const FEEDBACK_MESSAGES: Record<FeedbackStatus, { text: string; sub: string }> = {
  correct: { text: "Postura Correta!", sub: "Continue assim — ótimo equilíbrio" },
  adjust: { text: "Ajuste o Peso", sub: "Distribua levemente para a esquerda" },
  error: { text: "Reposicione os Pés", sub: "Retorne à posição inicial" },
  idle: { text: "Aguardando...", sub: "Posicione-se na plataforma" },
};

const FEEDBACK_COLORS: Record<FeedbackStatus, { main: string; glow: string; bg: string }> = {
  correct: { main: "#22C55E", glow: "rgba(34,197,94,0.5)", bg: "rgba(34,197,94,0.1)" },
  adjust: { main: "#F59E0B", glow: "rgba(245,158,11,0.5)", bg: "rgba(245,158,11,0.1)" },
  error: { main: "#EF4444", glow: "rgba(239,68,68,0.5)", bg: "rgba(239,68,68,0.1)" },
  idle: { main: "#64748B", glow: "rgba(100,116,139,0.3)", bg: "rgba(100,116,139,0.05)" },
};

const SEQUENCE: FeedbackStatus[] = ["idle", "correct", "correct", "adjust", "correct", "correct", "error", "correct", "adjust", "correct"];

// Initial mat zones (3x3 grid)
function createZones(): Zone[] {
  const ids = ["tl", "tc", "tr", "ml", "mc", "mr", "bl", "bc", "br"];
  return ids.map((id) => ({ id, status: "idle", active: false }));
}

// Generate random active zones with limb assignments (2-4 zones)
// Ensures each limb is assigned to AT MOST one zone (no duplicates)
function generateActiveZones(status: FeedbackStatus): Zone[] {
  const allZones = createZones();
  const numActive = Math.floor(Math.random() * 3) + 2; // 2 to 4
  const allLimbs: LimbType[] = ["left-foot", "right-foot", "left-hand", "right-hand"];

  // Shuffle zones to randomly select which ones will be active
  const shuffledZones = [...allZones].sort(() => Math.random() - 0.5);
  const activeZoneIds = new Set(shuffledZones.slice(0, numActive).map(z => z.id));

  // Shuffle limbs and create a pool of unique limbs for active zones
  const shuffledLimbs = [...allLimbs].sort(() => Math.random() - 0.5);
  const limbPool = shuffledLimbs.slice(0, numActive);

  // Map zones to limbs: track which active zone is at which index
  let limbIndex = 0;
  const limbAssignments = new Map<string, LimbType>();
  allZones.forEach((zone) => {
    if (activeZoneIds.has(zone.id)) {
      limbAssignments.set(zone.id, limbPool[limbIndex]);
      limbIndex++;
    }
  });

  return allZones.map((zone) => {
    const isActive = activeZoneIds.has(zone.id);
    return {
      ...zone,
      active: isActive,
      status: isActive ? status : "idle",
      limb: isActive ? limbAssignments.get(zone.id) : undefined,
    };
  });
}

// Avatar SVG animation frames
function AvatarSVG({ phase, feedback }: { phase: number; feedback: FeedbackStatus }) {
  const colors = FEEDBACK_COLORS[feedback];
  const bodyY = Math.sin(phase * 0.05) * 4;
  const armAngle = Math.sin(phase * 0.08) * 15;
  const legAngle = Math.sin(phase * 0.06) * 12;

  return (
    <svg viewBox="0 0 200 360" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Glow effect */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="bodyGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.main} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colors.main} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Shadow on floor */}
      <ellipse cx="100" cy="345" rx="45" ry="8" fill={colors.main} opacity="0.15" />

      <g transform={`translate(0, ${bodyY})`} filter="url(#glow)">
        {/* Head */}
        <circle cx="100" cy="55" r="30" fill={colors.main} opacity="0.9" />
        {/* Head highlight */}
        <circle cx="90" cy="47" r="8" fill="white" opacity="0.3" />
        {/* Eyes */}
        <circle cx="90" cy="52" r="5" fill="#0F172A" />
        <circle cx="110" cy="52" r="5" fill="#0F172A" />
        <circle cx="91" cy="50" r="2" fill="white" />
        <circle cx="111" cy="50" r="2" fill="white" />
        {/* Smile on correct */}
        {feedback === "correct" && (
          <path d="M88 62 Q100 72 112 62" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Torso */}
        <rect x="70" y="90" width="60" height="80" rx="12" fill={colors.main} opacity="0.85" />
        {/* Torso lines */}
        <line x1="100" y1="95" x2="100" y2="165" stroke="white" strokeOpacity="0.15" strokeWidth="1" />

        {/* Left arm */}
        <g style={{ transformOrigin: "75px 100px", transform: `rotate(${-armAngle}deg)` }}>
          <rect x="45" y="92" width="30" height="14" rx="7" fill={colors.main} opacity="0.75" />
          <rect x="28" y="96" width="20" height="12" rx="6" fill={colors.main} opacity="0.65" />
        </g>

        {/* Right arm */}
        <g style={{ transformOrigin: "125px 100px", transform: `rotate(${armAngle}deg)` }}>
          <rect x="125" y="92" width="30" height="14" rx="7" fill={colors.main} opacity="0.75" />
          <rect x="152" y="96" width="20" height="12" rx="6" fill={colors.main} opacity="0.65" />
        </g>

        {/* Hips */}
        <rect x="68" y="168" width="64" height="20" rx="10" fill={colors.main} opacity="0.7" />

        {/* Left leg */}
        <g style={{ transformOrigin: "85px 180px", transform: `rotate(${-legAngle}deg)` }}>
          <rect x="72" y="185" width="26" height="70" rx="10" fill={colors.main} opacity="0.75" />
          <rect x="68" y="250" width="30" height="22" rx="8" fill={colors.main} opacity="0.65" />
        </g>

        {/* Right leg */}
        <g style={{ transformOrigin: "115px 180px", transform: `rotate(${legAngle}deg)` }}>
          <rect x="102" y="185" width="26" height="70" rx="10" fill={colors.main} opacity="0.75" />
          <rect x="102" y="250" width="30" height="22" rx="8" fill={colors.main} opacity="0.65" />
        </g>
      </g>

      {/* Status ring */}
      <circle
        cx="100"
        cy="55"
        r="36"
        fill="none"
        stroke={colors.main}
        strokeWidth="2"
        strokeDasharray="226"
        strokeDashoffset="0"
        opacity="0.4"
      />
    </svg>
  );
}

// Mat visualization
function MatDisplay({ zones }: { zones: Zone[] }) {
  const positions = [
    "top-0 left-0", "top-0 left-1/3", "top-0 left-2/3",
    "top-1/3 left-0", "top-1/3 left-1/3", "top-1/3 left-2/3",
    "top-2/3 left-0", "top-2/3 left-1/3", "top-2/3 left-2/3",
  ];

  const labels = ["E", "C", "D", "", "Centro", "", "E", "C", "D"];

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Mat border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-[#334155] bg-[#0F172A]" />

      {/* Grid lines */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-[#1E293B]" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-[#1E293B]" />
        <div className="absolute top-1/3 left-0 right-0 h-px bg-[#1E293B]" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-[#1E293B]" />
      </div>

      {/* Zones */}
      {zones.map((zone, i) => {
        const colors = FEEDBACK_COLORS[zone.active ? zone.status : "idle"];
        return (
          <motion.div
            key={zone.id}
            className={`absolute w-1/3 h-1/3 ${positions[i]} flex items-center justify-center`}
            animate={{
              backgroundColor: zone.active ? colors.bg : "transparent",
            }}
            transition={{ duration: 0.3 }}
          >
            {zone.active && zone.limb && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-0.5"
              >
                <div
                  className="text-2xl"
                  style={{
                    filter: `drop-shadow(0 0 4px ${colors.main})`,
                  }}
                >
                  {zone.limb.includes("foot") ? "🦶" : "✋"}
                </div>
                <div
                  className="text-[9px] font-bold px-1 py-0.5 rounded"
                  style={{
                    backgroundColor: colors.main,
                    color: "#0F172A",
                    boxShadow: `0 0 8px ${colors.main}`,
                  }}
                >
                  {zone.limb.startsWith("left") ? "L" : "R"}
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Mat label */}
      <div className="absolute -bottom-6 left-0 right-0 text-center text-[#475569] text-xs uppercase tracking-wide">
        Plataforma
      </div>
    </div>
  );
}

export function ExerciseExecutionScreen() {
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds
  const [feedback, setFeedback] = useState<FeedbackStatus>("idle");
  const [seqIndex, setSeqIndex] = useState(0);
  const [reps, setReps] = useState(0);
  const [phase, setPhase] = useState(0);
  const [zones, setZones] = useState<Zone[]>(createZones());
  const [showMessage, setShowMessage] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animate phase for avatar
  useEffect(() => {
    if (!paused) {
      phaseRef.current = setInterval(() => setPhase((p) => p + 1), 50);
    }
    return () => { if (phaseRef.current) clearInterval(phaseRef.current); };
  }, [paused]);

  // Main timer
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          navigate("/results");
          return 0;
        }
        return t - 1;
      });
      setProgress((p) => Math.min(100, p + (100 / 180)));
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, navigate]);

  // Feedback sequence
  useEffect(() => {
    if (paused) return;
    const fb = setInterval(() => {
      setSeqIndex((si) => {
        const next = (si + 1) % SEQUENCE.length;
        const newStatus = SEQUENCE[next];
        setFeedback(newStatus);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 2500);

        // Update mat zones based on feedback
        setZones(generateActiveZones(newStatus));

        if (newStatus === "correct") {
          setReps((r) => r + 1);
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(fb);
  }, [paused]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const colors = FEEDBACK_COLORS[feedback];

  return (
    <NeuroStepLayout>
      <UserHeader />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-6">
          <button
            onClick={() => navigate("/exercises")}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white transition-all cursor-pointer"
          >
            <X size={20} />
            <span>Encerrar</span>
          </button>

          {/* Timer */}
          <div
            className="flex items-center gap-3 px-6 py-3 rounded-2xl border"
            style={{ borderColor: colors.main + "60", backgroundColor: colors.bg }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.main, boxShadow: `0 0 10px ${colors.main}` }}
            />
            <span className="text-4xl text-white" style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
              {fmt(timeLeft)}
            </span>
          </div>

          {/* Pause */}
          <button
            onClick={() => setPaused((p) => !p)}
            className="w-14 h-14 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#94A3B8] hover:text-white transition-all cursor-pointer"
          >
            {paused ? <Play size={24} /> : <Pause size={24} />}
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-8 mb-6">
          <div className="h-3 bg-[#1E293B] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: colors.main, boxShadow: `0 0 15px ${colors.glow}` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[#475569] text-sm">Progresso</span>
            <span className="text-[#475569] text-sm">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col items-center px-8 gap-6">
          {/* Feedback status panel */}
          <AnimatePresence mode="wait">
            {showMessage && (
              <motion.div
                key={feedback}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-xl rounded-3xl border-2 px-8 py-5 text-center"
                style={{
                  borderColor: colors.main,
                  backgroundColor: colors.bg,
                  boxShadow: `0 0 40px ${colors.glow}`,
                }}
              >
                <p className="text-3xl" style={{ color: colors.main, fontWeight: 700 }}>
                  {FEEDBACK_MESSAGES[feedback].text}
                </p>
                <p className="text-[#94A3B8] text-lg mt-1">
                  {FEEDBACK_MESSAGES[feedback].sub}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Avatar + Mat side by side */}
          <div className="flex items-center justify-center gap-12 w-full max-w-xl">
            {/* Avatar */}
            <div className="w-48 h-72 relative">
              {/* Glow behind avatar */}
              <div
                className="absolute inset-0 rounded-full blur-3xl"
                style={{ backgroundColor: colors.glow, opacity: 0.3 }}
              />
              <AvatarSVG phase={phase} feedback={feedback} />
            </div>

            {/* Divider */}
            <div className="w-px h-48 bg-[#1E293B]" />

            {/* Mat */}
            <div className="flex flex-col items-center gap-8">
              <MatDisplay zones={zones} />
              {/* Legend */}
              <div className="flex flex-col gap-2 mt-6">
                {(["correct", "adjust", "error"] as FeedbackStatus[]).map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: FEEDBACK_COLORS[s].main }}
                    />
                    <span className="text-[#64748B] text-xs">
                      {s === "correct" ? "Correto" : s === "adjust" ? "Ajuste" : "Incorreto"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-xl">
            {[
              { label: "Repetições", value: reps, unit: "" },
              { label: "Precisão", value: `${Math.max(60, 95 - seqIndex * 2)}`, unit: "%" },
              { label: "Equilíbrio", value: feedback === "error" ? "⚠️" : "✓", unit: "" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#1E293B] rounded-2xl px-4 py-5 text-center border border-[#334155]"
              >
                <p className="text-[#64748B] text-xs uppercase tracking-wide mb-1">{stat.label}</p>
                <p className="text-3xl text-white" style={{ fontWeight: 700 }}>
                  {stat.value}
                  <span className="text-lg text-[#64748B]">{stat.unit}</span>
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Pause overlay */}
        <AnimatePresence>
          {paused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center gap-8"
            >
              <div
                className="w-32 h-32 rounded-full bg-[#1E293B] border-2 border-[#3B82F6] flex items-center justify-center"
                style={{ boxShadow: "0 0 40px rgba(59,130,246,0.5)" }}
              >
                <Pause size={56} className="text-[#3B82F6]" />
              </div>
              <p className="text-4xl text-white" style={{ fontWeight: 700 }}>Pausado</p>
              <button
                onClick={() => setPaused(false)}
                className="flex items-center gap-3 px-12 py-5 rounded-2xl bg-[#3B82F6] text-white text-xl cursor-pointer"
                style={{ boxShadow: "0 0 30px rgba(59,130,246,0.6)" }}
              >
                <Play size={28} fill="white" strokeWidth={0} />
                Continuar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </NeuroStepLayout>
  );
}
