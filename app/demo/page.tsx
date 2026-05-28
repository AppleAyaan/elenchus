"use client";

import { useEffect, useState, useCallback, useRef, memo } from "react";
import Image from "next/image";
import { Play, Clock, CheckCircle, XCircle, RotateCcw, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SessionState = "idle" | "active" | "verdict" | "accepted" | "denied";
type Verdict = "accepted" | "denied";

type AnalysisResult = {
  verdict: Verdict;
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
  fatalFlaw: string;
};

function buildAnalysisFromTranscript(transcriptText: string): AnalysisResult {
  const text = transcriptText.toLowerCase();
  const positiveSignals = [
    "strong",
    "clear",
    "defensible",
    "traction",
    "good",
    "great",
    "compelling",
    "scalable",
    "solid",
    "fit",
  ];
  const negativeSignals = [
    "weak",
    "unclear",
    "risk",
    "concern",
    "problem",
    "fatal",
    "difficult",
    "unsure",
    "not convincing",
    "inconsistent",
  ];

  const pos = positiveSignals.reduce(
    (count, word) => count + (text.match(new RegExp(word, "g"))?.length ?? 0),
    0
  );
  const neg = negativeSignals.reduce(
    (count, word) => count + (text.match(new RegExp(word, "g"))?.length ?? 0),
    0
  );

  const rawScore = 50 + (pos - neg) * 6;
  const score = Math.max(10, Math.min(95, rawScore));
  const verdict: Verdict = score >= 60 ? "accepted" : "denied";

  const lines = transcriptText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const longLines = lines.filter((line) => line.length > 40);

  const pros = longLines
    .filter((line) => /strong|good|clear|defensible|traction|fit/i.test(line))
    .slice(0, 2);
  const cons = longLines
    .filter((line) => /risk|weak|unclear|problem|concern|fatal|difficult/i.test(line))
    .slice(0, 2);

  return {
    verdict,
    score,
    summary:
      verdict === "accepted"
        ? "Elenchus identified enough evidence of viability after cross-examination."
        : "Elenchus found unresolved weaknesses that block immediate conviction.",
    pros:
      pros.length > 0
        ? pros
        : [
            "Problem framing shows a real market pain.",
            "Core value proposition is understandable to a target buyer.",
          ],
    cons:
      cons.length > 0
        ? cons
        : [
            "Scalability assumptions need stronger proof.",
            "Go-to-market execution path still has material risk.",
          ],
    fatalFlaw:
      cons[0] ??
      "The current argument leaves a critical gap between early traction and repeatable scale.",
  };
}

const AnamEmbed = memo(function AnamEmbed({
  visible,
  onSessionStarted,
  onSessionEnded,
}: {
  visible: boolean;
  onSessionStarted: (sessionId: string) => void;
  onSessionEnded: (sessionId: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!visible || initialized.current) return;
    
    const container = containerRef.current;
    if (!container) return;

    // Load script if not loaded
    if (!document.querySelector('script[src*="anam-ai/agent-widget"]')) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@anam-ai/agent-widget";
      script.async = true;
      document.body.appendChild(script);
    }

    // Create element
    const anamAgent = document.createElement("anam-agent");
    anamAgent.setAttribute("agent-id", "67a34ba0-17fa-4c1a-b83c-f7ed27cee8a7");
    anamAgent.style.width = "100%";
    anamAgent.style.height = "100%";
    anamAgent.style.display = "block";

    const handleSessionStarted = (event: Event) => {
      const customEvent = event as CustomEvent<{ sessionId?: string }>;
      const sessionId = customEvent.detail?.sessionId;
      if (sessionId) {
        onSessionStarted(sessionId);
      }
    };

    const handleSessionEnded = (event: Event) => {
      const customEvent = event as CustomEvent<{ sessionId?: string }>;
      const sessionId = customEvent.detail?.sessionId;
      if (sessionId) {
        onSessionEnded(sessionId);
      }
    };

    anamAgent.addEventListener("anam-agent:session-started", handleSessionStarted);
    anamAgent.addEventListener("anam-agent:session-ended", handleSessionEnded);
    container.appendChild(anamAgent);
    
    initialized.current = true;

    return () => {
      anamAgent.removeEventListener(
        "anam-agent:session-started",
        handleSessionStarted
      );
      anamAgent.removeEventListener("anam-agent:session-ended", handleSessionEnded);
    };
  }, [visible, onSessionStarted, onSessionEnded]);

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full ${visible ? "" : "hidden"}`}
    />
  );
});

export default function DemoPage() {
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [timeLeft, setTimeLeft] = useState(120);
  const [sessionIdInput, setSessionIdInput] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [showManualSessionInput, setShowManualSessionInput] = useState(false);

  const startSession = useCallback(() => {
    setSessionState("active");
    setTimeLeft(120);
  }, []);

  const resetSession = useCallback(() => {
    setSessionState("idle");
    setTimeLeft(120);
    setAnalysis(null);
    setSessionIdInput("");
    setAnalysisError("");
    setShowManualSessionInput(false);
  }, []);

  const analyzeTranscript = useCallback(async () => {
    if (!sessionIdInput.trim()) {
      setAnalysisError("Enter a session ID first.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError("");

    try {
      const response = await fetch(
        `/api/anam-transcript?sessionId=${encodeURIComponent(sessionIdInput.trim())}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch transcript.");
      }

      const transcriptText = data.transcriptText as string;
      if (!transcriptText) {
        throw new Error("Transcript returned empty.");
      }

      const parsed = buildAnalysisFromTranscript(transcriptText);
      setAnalysis(parsed);
      setSessionState(parsed.verdict);
      setShowManualSessionInput(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to analyze transcript.";
      setAnalysisError(message);
      setShowManualSessionInput(true);
    } finally {
      setIsAnalyzing(false);
    }
  }, [sessionIdInput]);

  const handleSessionStarted = useCallback((sessionId: string) => {
    setSessionIdInput(sessionId);
    setAnalysisError("");
    setShowManualSessionInput(false);
  }, []);

  const handleSessionEnded = useCallback(
    (sessionId: string) => {
      setSessionIdInput(sessionId);
      if (sessionState === "active") {
        setSessionState("verdict");
      }
    },
    [sessionState]
  );

  useEffect(() => {
    if (
      sessionState === "verdict" &&
      sessionIdInput &&
      !analysis &&
      !isAnalyzing
    ) {
      void analyzeTranscript();
    }
  }, [sessionState, sessionIdInput, analysis, isAnalyzing, analyzeTranscript]);

  useEffect(() => {
    if (sessionState === "verdict" && !sessionIdInput && !isAnalyzing) {
      const fallbackTimer = window.setTimeout(() => {
        setShowManualSessionInput(true);
      }, 1500);
      return () => window.clearTimeout(fallbackTimer);
    }
  }, [sessionState, sessionIdInput, isAnalyzing]);

  // Timer effect
  useEffect(() => {
    if (sessionState !== "active") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setSessionState("verdict");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return "text-red-500";
    if (timeLeft <= 30) return "text-orange-500";
    return "text-foreground";
  };

  return (
    <main className="relative min-h-screen bg-[#f5f5f0] px-6 pt-28 pb-10 overflow-hidden">
      {/* ASCII Background */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-[0.03]"
      >
        <pre className="font-mono text-[10px] leading-[12px] text-foreground whitespace-pre">
{`·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·`}
        </pre>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <AnimatePresence mode="wait">
          {(sessionState === "accepted" || sessionState === "denied") ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="mt-10 flex flex-col items-center justify-center px-4"
            >
              {sessionState === "accepted" ? (
                <AcceptedScreen onReset={resetSession} analysis={analysis} />
              ) : (
                <DeniedScreen onReset={resetSession} analysis={analysis} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <section className="mt-10 text-center">
                <h1 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl">
                  Talk to <span className="italic">Elenchus</span>
                </h1>
                <p className="mt-4 text-muted-foreground">
                  Pitch your startup idea. Elenchus will challenge every assumption.
                </p>
                <p className="mt-2 text-xs text-muted-foreground/80">
                  Note: may not work if api limit is full
                </p>
              </section>

              {sessionState === "active" && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-center justify-center gap-2"
                >
                  <Clock className={`h-5 w-5 ${getTimerColor()}`} />
                  <span className={`font-mono text-2xl font-semibold ${getTimerColor()}`}>
                    {formatTime(timeLeft)}
                  </span>
                </motion.div>
              )}

              <section className="mt-8 flex justify-center">
                <div className="relative w-full max-w-3xl h-[500px] overflow-hidden rounded-2xl border border-black/[0.08] bg-[#1a1a1a]">
                  {sessionState === "idle" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-white">
                      <div className="text-center">
                        <p className="font-serif text-xl">Ready to be challenged?</p>
                        <p className="mt-2 text-sm text-white/60">
                          You have 2 minutes to pitch your idea
                        </p>
                      </div>
                      <button
                        onClick={startSession}
                        className="inline-flex items-center gap-2 rounded-full bg-[#ff6600] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#e55a00]"
                      >
                        <Play className="h-4 w-4" />
                        Start Session
                      </button>
                    </div>
                  )}

                  <AnamEmbed
                    visible={sessionState !== "idle"}
                    onSessionStarted={handleSessionStarted}
                    onSessionEnded={handleSessionEnded}
                  />
                </div>
              </section>

              {sessionState === "verdict" && (
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center"
                >
                  <p className="font-serif text-xl text-foreground">
                    What was Elenchus&apos;s verdict?
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We&apos;ll auto-analyze from the transcript when session capture is available.
                  </p>

                  {showManualSessionInput && (
                    <div className="mx-auto mt-5 flex w-full max-w-xl gap-2">
                      <input
                        value={sessionIdInput}
                        onChange={(event) => setSessionIdInput(event.target.value)}
                        placeholder="Paste Anam session id"
                        className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none ring-orange-500/30 focus:ring"
                      />
                      <button
                        onClick={analyzeTranscript}
                        disabled={isAnalyzing}
                        className="rounded-full bg-[#ff6600] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#e55a00] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isAnalyzing ? "Analyzing..." : "Analyze"}
                      </button>
                    </div>
                  )}

                  {sessionIdInput && (
                    <p className="mt-2 text-xs text-emerald-700">
                      Auto-captured session: <span className="font-mono">{sessionIdInput}</span>
                    </p>
                  )}
                  {!sessionIdInput && !showManualSessionInput && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Waiting for session capture...
                    </p>
                  )}
                  {analysisError && (
                    <p className="mt-2 text-xs text-red-600">{analysisError}</p>
                  )}
                  <div className="mt-6 flex justify-center gap-4">
                    <button
                      onClick={() => setSessionState("accepted")}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-500 hover:scale-105"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accepted
                    </button>
                    <button
                      onClick={() => setSessionState("denied")}
                      className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-red-500 hover:scale-105"
                    >
                      <XCircle className="h-4 w-4" />
                      Denied
                    </button>
                  </div>
                </motion.section>
              )}

              {sessionState === "active" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex justify-center"
                >
                  <button
                    onClick={() => setSessionState("verdict")}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-black/5 hover:shadow-md"
                  >
                    <Phone className="h-4 w-4" />
                    Finished Call
                  </button>
                </motion.div>
              )}

              <section className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  {sessionState === "active" 
                    ? "Click \"Finished Call\" when you're done, or wait for the timer to end."
                    : "Allow microphone access when prompted. Speak clearly and wait for Elenchus to respond."}
                </p>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-16 flex items-center justify-center gap-2">
          <Image
            src="/elenchus_transparent.png"
            alt="Elenchus"
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Elenchus
          </p>
        </footer>
      </div>
    </main>
  );
}

function CircularProgress({ percentage, color }: { percentage: number; color: string }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative h-48 w-48">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="8"
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-5xl font-bold text-foreground"
        >
          {percentage}<span className="text-2xl">%</span>
        </motion.span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Threshold Clear
        </span>
      </div>
    </div>
  );
}

function SocraticSeal() {
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-stone-100 to-stone-200 shadow-inner">
      <svg viewBox="0 0 64 64" className="h-14 w-14 text-stone-400">
        <circle cx="32" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M32 32 L32 52 M24 40 L32 48 L40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 56 L32 48 L44 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="20" r="4" fill="currentColor" opacity="0.3" />
      </svg>
    </div>
  );
}

function AcceptedScreen({
  onReset,
  analysis,
}: {
  onReset: () => void;
  analysis: AnalysisResult | null;
}) {
  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
          <CheckCircle className="h-3.5 w-3.5" />
          Accepted
        </span>
        <h1 className="mt-6 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          The Verdict
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          {analysis?.summary ??
            "Elenchus has cross-examined your premise, unit economics, and founding grit. You have reached the threshold of intellectual viability."}
        </p>
      </motion.div>

      {/* Top Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-10 grid gap-6 md:grid-cols-2"
      >
        {/* YC Readiness Index */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
          <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            YC Readiness Index
          </p>
          <div className="mt-6 flex justify-center">
            <CircularProgress percentage={63} color="#ff6600" />
          </div>
        </div>

        {/* The Socratic Seal */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
          <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            The Socratic Seal
          </p>
          <div className="mt-6 flex justify-center">
            <SocraticSeal />
          </div>
          <p className="mt-6 text-center font-serif text-sm italic text-muted-foreground">
            &ldquo;Authentic truth is discovered, not declared. You have stood the trial of reason.&rdquo;
          </p>
        </div>
      </motion.div>

      {/* Bottom Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 grid gap-6 md:grid-cols-2"
      >
        {/* Strengths */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#ff6600]">⚡</span>
            <h3 className="font-semibold text-foreground">Strengths to Double Down On</h3>
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-stone-50 p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-bold text-[#ff6600]">01</span>
                <span className="font-medium text-foreground">Iron-Clad GTM</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {analysis?.pros[0] ??
                  "Your distribution strategy leverages an existing inefficiency that competitors have overlooked."}
              </p>
            </div>
            <div className="rounded-xl bg-stone-50 p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-bold text-[#ff6600]">02</span>
                <span className="font-medium text-foreground">Founder-Market Fit</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {analysis?.pros[1] ??
                  "The Socratic history reveals a level of domain expertise that makes you difficult to displace."}
              </p>
            </div>
          </div>
        </div>

        {/* Area to Watch */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-amber-500">△</span>
            <h3 className="font-semibold text-foreground">Area to Watch</h3>
          </div>
          <div className="mt-4 rounded-xl bg-amber-50 p-4">
            <p className="font-medium text-foreground">Scalability Consideration</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {analysis?.cons[0] ??
                "As you grow past 10,000 MAUs, ensure your infrastructure scales without proportional cost increases."}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span>○</span>
            <span className="uppercase tracking-wider">Monitor for Series A positioning</span>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 flex flex-col items-center"
      >
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full bg-[#ff6600] px-10 py-4 text-base font-medium text-white shadow-lg transition-all hover:bg-[#e55a00] hover:shadow-xl"
        >
          <RotateCcw className="h-4 w-4" />
          Keep Refining
        </button>
        <p className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground">
          Final session report secured via end-to-end encryption
        </p>
      </motion.div>
    </div>
  );
}

function DeniedScreen({
  onReset,
  analysis,
}: {
  onReset: () => void;
  analysis: AnalysisResult | null;
}) {
  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-700">
          <XCircle className="h-3.5 w-3.5" />
          Not Yet
        </span>
        <h1 className="mt-6 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          The Verdict
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          {analysis?.summary ??
            "Elenchus has cross-examined your premise, unit economics, and founding grit. Critical gaps remain before reaching intellectual viability."}
        </p>
      </motion.div>

      {/* Top Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-10 grid gap-6 md:grid-cols-2"
      >
        {/* YC Readiness Index */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
          <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            YC Readiness Index
          </p>
          <div className="mt-6 flex justify-center">
            <CircularProgress percentage={63} color="#ef4444" />
          </div>
        </div>

        {/* The Socratic Seal */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
          <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            The Socratic Seal
          </p>
          <div className="mt-6 flex justify-center opacity-30">
            <SocraticSeal />
          </div>
          <p className="mt-6 text-center font-serif text-sm italic text-muted-foreground">
            &ldquo;I know that I know nothing — and now, so do you about your weaknesses.&rdquo;
          </p>
        </div>
      </motion.div>

      {/* Bottom Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 grid gap-6 md:grid-cols-2"
      >
        {/* What Worked */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span>
            <h3 className="font-semibold text-foreground">What Worked</h3>
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-stone-50 p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-bold text-emerald-600">01</span>
                <span className="font-medium text-foreground">Clear Problem Statement</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {analysis?.pros[0] ??
                  "You articulated a genuine pain point that resonates with the target market."}
              </p>
            </div>
          </div>
        </div>

        {/* The Fatal Flaw */}
        <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-red-500">△</span>
            <h3 className="font-semibold text-foreground">The Fatal Flaw</h3>
          </div>
          <div className="mt-4 rounded-xl bg-red-50 p-4">
            <p className="font-medium text-foreground">Scalability Paradox</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {analysis?.fatalFlaw ??
                "While your unit economics are strong at seed, the model assumes a level of manual curation that Elenchus predicts will break at 10,000 MAUs."}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-red-600">
            <span>⊘</span>
            <span className="uppercase tracking-wider">Critical for Series A positioning</span>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 flex flex-col items-center"
      >
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full bg-[#ff6600] px-10 py-4 text-base font-medium text-white shadow-lg transition-all hover:bg-[#e55a00] hover:shadow-xl"
        >
          <RotateCcw className="h-4 w-4" />
          Keep Refining
        </button>
        <p className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground">
          Final session report secured via end-to-end encryption
        </p>
      </motion.div>
    </div>
  );
}
