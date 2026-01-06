import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Shield, Lock, User, AlertCircle } from "lucide-react";
import fingerprintSvg from "@/assets/fingerprint-scan.svg";
import worldMapSvg from "@/assets/world-map-vector.svg";

type ScanState = "idle" | "scanning" | "success" | "error";

const loginSchema = z.object({
  username: z.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

const scanMessages = [
  "CAPTURING BIOMETRIC SIGNATURE",
  "VALIDATING CREDENTIALS",
  "VERIFYING IDENTITY",
];

export const BiometricLogin = () => {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [messageIndex, setMessageIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateInputs = (): boolean => {
    const result = loginSchema.safeParse({ username, password });
    
    if (!result.success) {
      const fieldErrors: { username?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as "username" | "password";
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleAuthenticate = () => {
    if (scanState !== "idle") return;
    
    if (!validateInputs()) {
      setScanState("error");
      setTimeout(() => setScanState("idle"), 1500);
      return;
    }
    
    setScanState("scanning");
    setMessageIndex(0);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % scanMessages.length);
    }, 1000);

    setTimeout(() => {
      clearInterval(messageInterval);
      setScanState("success");
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && scanState === "idle") {
      handleAuthenticate();
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      {/* World map background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src={worldMapSvg} 
          alt="" 
          className="w-full h-full object-cover opacity-[0.08]"
          style={{
            filter: 'invert(1) brightness(0.5) sepia(1) hue-rotate(160deg) saturate(5)',
            mixBlendMode: 'screen'
          }}
        />
      </div>

      {/* Animated background grid with pulse */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Animated radial glow */}
      <motion.div 
        className="absolute inset-0"
        animate={{ 
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, transparent 50%)'
        }}
      />

      {/* Single horizontal scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          initial={{ top: '-5%' }}
          animate={{ top: '105%' }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-xl"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              left: `${10 + i * 20}%`,
              top: `${15 + (i % 3) * 30}%`,
              background: `radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [-20, 20, -10, -20],
              scale: [1, 1.2, 0.9, 1],
              opacity: [0.3, 0.6, 0.4, 0.3],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      {/* Digital circuit lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <motion.path
          d="M 0 200 Q 200 180 400 200 T 800 200"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 0 400 Q 300 380 600 400 T 1200 400"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </svg>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${5 + (i * 7) % 90}%`,
              top: `${10 + (i * 11) % 80}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 5 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Corner tech decorations */}
      <div className="absolute top-8 left-8 w-32 h-32 border-l border-t border-primary/20 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-0 w-2 h-2 bg-primary rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="absolute top-8 right-8 w-32 h-32 border-r border-t border-primary/20 pointer-events-none">
        <motion.div 
          className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      <div className="absolute bottom-8 left-8 w-32 h-32 border-l border-b border-primary/20 pointer-events-none">
        <motion.div 
          className="absolute bottom-0 left-0 w-2 h-2 bg-primary rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
      </div>
      <div className="absolute bottom-8 right-8 w-32 h-32 border-r border-b border-primary/20 pointer-events-none">
        <motion.div 
          className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />
      </div>

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        {/* Glass panel */}
        <div className="relative bg-card/60 backdrop-blur-2xl border border-primary/20 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          {/* Corner accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/40 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/40 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/40 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/40 rounded-br-lg" />

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div className="relative">
                <Shield className="w-10 h-10 text-primary" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="w-10 h-10 text-primary blur-sm" />
                </motion.div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-foreground">
                  TWITTER BLASTER
                </h1>
                <p className="text-[10px] text-primary tracking-[0.3em] font-medium">
                  COMMAND CENTER
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-xs text-muted-foreground tracking-widest"
            >
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-muted-foreground/50" />
              <span>SECURE AUTHENTICATION</span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-muted-foreground/50" />
            </motion.div>
          </div>

          {/* Input Fields */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 mb-6"
          >
            {/* Username */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="AGENT ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={scanState === "scanning" || scanState === "success"}
                className={`
                  w-full bg-background/50 border rounded-xl py-3 pl-11 pr-4
                  text-sm tracking-wider placeholder:text-muted-foreground/50
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                  transition-all duration-300
                  ${errors.username ? 'border-destructive' : 'border-border/50'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
              <AnimatePresence>
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-5 left-0 text-xs text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.username}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div className="relative mt-6">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="ACCESS CODE"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={scanState === "scanning" || scanState === "success"}
                className={`
                  w-full bg-background/50 border rounded-xl py-3 pl-11 pr-12
                  text-sm tracking-wider placeholder:text-muted-foreground/50
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                  transition-all duration-300
                  ${errors.password ? 'border-destructive' : 'border-border/50'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs tracking-wider"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-5 left-0 text-xs text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Fingerprint Scanner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center mt-8"
          >
            <div className="relative w-36 h-36 mb-4">
              {/* Outer ring */}
              <motion.div 
                className={`absolute inset-0 rounded-full border-2 transition-colors duration-500 ${
                  scanState === "success" 
                    ? "border-green-500/60" 
                    : scanState === "error"
                    ? "border-destructive/60"
                    : "border-primary/30"
                }`}
                animate={scanState === "scanning" ? { 
                  boxShadow: ["0 0 0 0 hsl(var(--primary) / 0.3)", "0 0 0 10px hsl(var(--primary) / 0)", "0 0 0 0 hsl(var(--primary) / 0.3)"]
                } : {}}
                transition={{ duration: 1.5, repeat: scanState === "scanning" ? Infinity : 0 }}
              />
              
              {/* Inner ring */}
              <div 
                className={`absolute inset-3 rounded-full border transition-colors duration-500 ${
                  scanState === "success" 
                    ? "border-green-500/40" 
                    : scanState === "error"
                    ? "border-destructive/40"
                    : "border-primary/20"
                }`}
              />

              {/* Corner brackets */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 150 150">
                <g 
                  className={`transition-colors duration-500 ${
                    scanState === "success" ? "stroke-green-500" : 
                    scanState === "error" ? "stroke-destructive" : "stroke-primary"
                  }`} 
                  strokeWidth="2" 
                  fill="none"
                  opacity="0.7"
                >
                  <path d="M 25 40 L 25 25 L 40 25" />
                  <path d="M 110 25 L 125 25 L 125 40" />
                  <path d="M 25 110 L 25 125 L 40 125" />
                  <path d="M 110 125 L 125 125 L 125 110" />
                </g>
              </svg>

              {/* Fingerprint */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center p-6"
                animate={scanState === "idle" ? { opacity: [0.3, 0.6, 0.3] } : { opacity: scanState === "success" ? 1 : 0.7 }}
                transition={scanState === "idle" ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
              >
                <img
                  src={fingerprintSvg}
                  alt="Fingerprint"
                  className={`w-full h-full object-contain transition-all duration-500 ${
                    scanState === "success" 
                      ? "[filter:brightness(0)_saturate(100%)_invert(65%)_sepia(52%)_saturate(636%)_hue-rotate(93deg)_brightness(95%)_contrast(88%)]" 
                      : scanState === "error"
                      ? "[filter:brightness(0)_saturate(100%)_invert(27%)_sepia(91%)_saturate(6068%)_hue-rotate(354deg)_brightness(90%)_contrast(99%)]"
                      : "[filter:brightness(0)_saturate(100%)_invert(74%)_sepia(98%)_saturate(1284%)_hue-rotate(166deg)_brightness(101%)_contrast(101%)]"
                  }`}
                />
              </motion.div>

              {/* Scan line */}
              <AnimatePresence>
                {scanState === "scanning" && (
                  <motion.div
                    initial={{ top: "15%", opacity: 0 }}
                    animate={{ top: "85%", opacity: [0, 1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, repeat: 1, ease: "linear" }}
                    className="absolute left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                    style={{ boxShadow: "0 0 15px hsl(var(--primary)), 0 0 30px hsl(var(--primary) / 0.5)" }}
                  />
                )}
              </AnimatePresence>

              {/* Success/Error glow */}
              <AnimatePresence>
                {(scanState === "success" || scanState === "error") && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full"
                    style={{ 
                      background: scanState === "success" 
                        ? "radial-gradient(circle, hsl(142 76% 36% / 0.3) 0%, transparent 70%)"
                        : "radial-gradient(circle, hsl(var(--destructive) / 0.3) 0%, transparent 70%)"
                    }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Status text */}
            <div className="h-5 mb-5 text-center">
              <AnimatePresence mode="wait">
                {scanState === "idle" && (
                  <motion.p
                    key="idle"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-muted-foreground tracking-[0.2em]"
                  >
                    BIOMETRIC VERIFICATION READY
                  </motion.p>
                )}
                {scanState === "scanning" && (
                  <motion.p
                    key={`scanning-${messageIndex}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-primary tracking-[0.2em]"
                  >
                    {scanMessages[messageIndex]}
                  </motion.p>
                )}
                {scanState === "success" && (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-green-400 tracking-[0.2em]"
                  >
                    IDENTITY VERIFIED • ACCESS GRANTED
                  </motion.p>
                )}
                {scanState === "error" && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-destructive tracking-[0.2em]"
                  >
                    VALIDATION FAILED • CHECK CREDENTIALS
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Authenticate button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={handleAuthenticate}
              disabled={scanState === "scanning" || scanState === "success"}
              className={`
                relative px-10 py-3.5 rounded-xl font-medium tracking-[0.2em] text-sm
                transition-all duration-300 overflow-hidden group
                ${scanState === "idle" || scanState === "error"
                  ? "bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] cursor-pointer" 
                  : scanState === "scanning"
                  ? "bg-muted/50 border border-border text-muted-foreground cursor-not-allowed"
                  : "bg-green-500/20 border border-green-500/50 text-green-400 cursor-default"
                }
              `}
            >
              <span className="relative z-10">
                {scanState === "idle" && "INITIATE AUTHENTICATION"}
                {scanState === "error" && "RETRY AUTHENTICATION"}
                {scanState === "scanning" && "PROCESSING..."}
                {scanState === "success" && "ACCESS GRANTED"}
              </span>
              {(scanState === "idle" || scanState === "error") && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 pt-6 border-t border-border/20"
          >
            <div className="flex items-center justify-between text-[10px] text-muted-foreground/50 tracking-wider">
              <span>PROTOCOL v4.2.1</span>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${scanState === "success" ? "bg-green-500" : "bg-primary"} animate-pulse`} />
                <span>SYSTEM ACTIVE</span>
              </div>
              <span>AES-256 ENCRYPTED</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BiometricLogin;
