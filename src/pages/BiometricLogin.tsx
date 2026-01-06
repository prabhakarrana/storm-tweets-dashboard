import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

type ScanState = "idle" | "scanning" | "success";

const scanMessages = [
  "CAPTURING BIOMETRIC SIGNATURE",
  "VALIDATING IDENTITY",
];

export const BiometricLogin = () => {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [messageIndex, setMessageIndex] = useState(0);

  const handleAuthenticate = () => {
    if (scanState !== "idle") return;
    
    setScanState("scanning");
    setMessageIndex(0);

    // Cycle through messages during scan
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % scanMessages.length);
    }, 1200);

    // Complete scan after 3 seconds
    setTimeout(() => {
      clearInterval(messageInterval);
      setScanState("success");
      
      // Auto-redirect after success
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      {/* Background grid effect */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Main glass panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl font-bold tracking-wider text-foreground mb-2"
            >
              SECURE ACCESS
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-xs text-muted-foreground tracking-widest"
            >
              BIOMETRIC AUTHENTICATION REQUIRED
            </motion.div>
          </div>

          {/* Fingerprint Scanner */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative w-48 h-48 mb-6"
            >
              {/* Circular scanner frame */}
              <div 
                className={`absolute inset-0 rounded-full border-2 transition-colors duration-500 ${
                  scanState === "success" 
                    ? "border-green-500/60" 
                    : "border-primary/40"
                }`}
              />
              <div 
                className={`absolute inset-2 rounded-full border transition-colors duration-500 ${
                  scanState === "success" 
                    ? "border-green-500/30" 
                    : "border-primary/20"
                }`}
              />

              {/* Corner brackets */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                <g className={`transition-colors duration-500 ${scanState === "success" ? "stroke-green-500" : "stroke-primary"}`} strokeWidth="2" fill="none">
                  {/* Top-left */}
                  <path d="M 30 50 L 30 30 L 50 30" opacity="0.6" />
                  {/* Top-right */}
                  <path d="M 150 30 L 170 30 L 170 50" opacity="0.6" />
                  {/* Bottom-left */}
                  <path d="M 30 150 L 30 170 L 50 170" opacity="0.6" />
                  {/* Bottom-right */}
                  <path d="M 150 170 L 170 170 L 170 150" opacity="0.6" />
                </g>
              </svg>

              {/* Fingerprint SVG */}
              <motion.svg
                className="absolute inset-0 w-full h-full p-10"
                viewBox="0 0 100 100"
                animate={scanState === "idle" ? { opacity: [0.4, 0.7, 0.4] } : {}}
                transition={scanState === "idle" ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
              >
                <g 
                  fill="none" 
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className={`transition-all duration-500 ${
                    scanState === "success" 
                      ? "stroke-green-400" 
                      : "stroke-primary"
                  }`}
                  style={{ opacity: scanState === "success" ? 1 : 0.8 }}
                >
                  {/* Center core */}
                  <path d="M 50 45 Q 45 50 50 55 Q 55 60 50 65" />
                  
                  {/* Inner loops */}
                  <path d="M 50 38 Q 40 45 40 55 Q 40 68 50 72" />
                  <path d="M 50 38 Q 60 45 60 55 Q 60 68 50 72" />
                  
                  {/* Middle arcs */}
                  <path d="M 45 30 Q 30 40 30 55 Q 30 75 50 80" />
                  <path d="M 55 30 Q 70 40 70 55 Q 70 75 50 80" />
                  
                  {/* Outer arcs */}
                  <path d="M 40 25 Q 22 35 22 55 Q 22 78 50 85" />
                  <path d="M 60 25 Q 78 35 78 55 Q 78 78 50 85" />
                  
                  {/* Outermost arcs */}
                  <path d="M 35 20 Q 15 32 15 55 Q 15 82 45 90" />
                  <path d="M 65 20 Q 85 32 85 55 Q 85 82 55 90" />
                </g>
              </motion.svg>

              {/* Scan line */}
              <AnimatePresence>
                {scanState === "scanning" && (
                  <motion.div
                    initial={{ top: "10%", opacity: 0 }}
                    animate={{ top: "90%", opacity: [0, 1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, repeat: 1, ease: "linear" }}
                    className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                    style={{ boxShadow: "0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary) / 0.5)" }}
                  />
                )}
              </AnimatePresence>

              {/* Success glow */}
              <AnimatePresence>
                {scanState === "success" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full"
                    style={{ 
                      background: "radial-gradient(circle, hsl(142 76% 36% / 0.2) 0%, transparent 70%)",
                      boxShadow: "inset 0 0 60px hsl(142 76% 36% / 0.1)"
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Status text */}
            <motion.div 
              className="h-6 mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <AnimatePresence mode="wait">
                {scanState === "idle" && (
                  <motion.p
                    key="idle"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-muted-foreground tracking-widest"
                  >
                    PLACE FINGER ON SENSOR
                  </motion.p>
                )}
                {scanState === "scanning" && (
                  <motion.p
                    key={`scanning-${messageIndex}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-primary tracking-widest"
                  >
                    {scanMessages[messageIndex]}
                  </motion.p>
                )}
                {scanState === "success" && (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-green-400 tracking-widest"
                  >
                    IDENTITY VERIFIED • ACCESS GRANTED
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Authenticate button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              onClick={handleAuthenticate}
              disabled={scanState !== "idle"}
              className={`
                px-8 py-3 rounded-lg font-medium tracking-wider text-sm
                transition-all duration-300
                ${scanState === "idle" 
                  ? "bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 hover:border-primary cursor-pointer" 
                  : scanState === "scanning"
                  ? "bg-muted border border-border text-muted-foreground cursor-not-allowed"
                  : "bg-green-500/20 border border-green-500/50 text-green-400 cursor-default"
                }
              `}
            >
              {scanState === "idle" && "AUTHENTICATE"}
              {scanState === "scanning" && "SCANNING..."}
              {scanState === "success" && "ACCESS GRANTED"}
            </motion.button>
          </div>

          {/* Footer info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 pt-6 border-t border-border/30 text-center"
          >
            <p className="text-xs text-muted-foreground/60 tracking-wide">
              ENCRYPTED BIOMETRIC PROTOCOL v3.2
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BiometricLogin;
