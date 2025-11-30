import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/FAQWithSpiral.module.css";

export default function FAQWithSpiral() {
  const spiralRef = useRef(null);
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Spiral configuration
  const [cfg, setCfg] = useState({
    points: 700,
    dotRadius: 1.8,
    duration: 3.0,
    color: "#BFFF00",
    gradient: "none",
    pulseEffect: true,
    opacityMin: 0.25,
    opacityMax: 0.9,
    sizeMin: 0.5,
    sizeMax: 1.4,
    background: "#000000",
  });

  // Gradient presets
  const gradients = useMemo(
    () => ({
      none: [],
      rainbow: ["#ff0000", "#ff9900", "#ffff00", "#00ff00", "#0099ff", "#6633ff"],
      sunset: ["#ff0000", "#ff9900", "#ffcc00"],
      ocean: ["#0066ff", "#00ccff", "#00ffcc"],
      fire: ["#ff0000", "#ff6600", "#ffcc00"],
      neon: ["#ff00ff", "#00ffff", "#ffff00"],
      pastel: ["#ffcccc", "#ccffcc", "#ccccff"],
      grayscale: ["#ffffff", "#999999", "#333333"],
    }),
    []
  );



  // Generate spiral SVG and mount
  useEffect(() => {
    if (!spiralRef.current) return;

    const SIZE = 560;
    const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
    const N = cfg.points;
    const DOT = cfg.dotRadius;
    const CENTER = SIZE / 2;
    const PADDING = 4;
    const MAX_R = CENTER - PADDING - DOT;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", String(SIZE));
    svg.setAttribute("height", String(SIZE));
    svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);

    // Gradient
    if (cfg.gradient !== "none") {
      const defs = document.createElementNS(svgNS, "defs");
      const g = document.createElementNS(svgNS, "linearGradient");
      g.setAttribute("id", "spiralGradient");
      g.setAttribute("gradientUnits", "userSpaceOnUse");
      g.setAttribute("x1", "0%");
      g.setAttribute("y1", "0%");
      g.setAttribute("x2", "100%");
      g.setAttribute("y2", "100%");

      gradients[cfg.gradient].forEach((color, idx, arr) => {
        const stop = document.createElementNS(svgNS, "stop");
        stop.setAttribute("offset", `${(idx * 100) / (arr.length - 1)}%`);
        stop.setAttribute("stop-color", color);
        g.appendChild(stop);
      });

      defs.appendChild(g);
      svg.appendChild(defs);
    }

    for (let i = 0; i < N; i++) {
      const idx = i + 0.5;
      const frac = idx / N;
      const r = Math.sqrt(frac) * MAX_R;
      const theta = idx * GOLDEN_ANGLE;
      const x = CENTER + r * Math.cos(theta);
      const y = CENTER + r * Math.sin(theta);

      const c = document.createElementNS(svgNS, "circle");
      c.setAttribute("cx", x.toFixed(3));
      c.setAttribute("cy", y.toFixed(3));
      c.setAttribute("r", String(DOT));
      c.setAttribute(
        "fill",
        cfg.gradient === "none" ? cfg.color : "url(#spiralGradient)"
      );
      c.setAttribute("opacity", "0.6");

      if (cfg.pulseEffect) {
        const animR = document.createElementNS(svgNS, "animate");
        animR.setAttribute("attributeName", "r");
        animR.setAttribute(
          "values",
          `${DOT * cfg.sizeMin};${DOT * cfg.sizeMax};${DOT * cfg.sizeMin}`
        );
        animR.setAttribute("dur", `${cfg.duration}s`);
        animR.setAttribute("begin", `${(frac * cfg.duration).toFixed(3)}s`);
        animR.setAttribute("repeatCount", "indefinite");
        animR.setAttribute("calcMode", "spline");
        animR.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
        c.appendChild(animR);

        const animO = document.createElementNS(svgNS, "animate");
        animO.setAttribute("attributeName", "opacity");
        animO.setAttribute(
          "values",
          `${cfg.opacityMin};${cfg.opacityMax};${cfg.opacityMin}`
        );
        animO.setAttribute("dur", `${cfg.duration}s`);
        animO.setAttribute("begin", `${(frac * cfg.duration).toFixed(3)}s`);
        animO.setAttribute("repeatCount", "indefinite");
        animO.setAttribute("calcMode", "spline");
        animO.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
        c.appendChild(animO);
      }

      svg.appendChild(c);
    }

    spiralRef.current.innerHTML = "";
    spiralRef.current.appendChild(svg);
  }, [cfg, gradients]);



  // FAQ content - customized for Zii
  const faqs = [
    {
      q: "💬 How does offline chat work?",
      a: "Zii Chat uses Bluetooth mesh networking to connect nearby devices. Messages hop from phone to phone until they reach the recipient - no internet needed!",
    },
    {
      q: "📍 What are location channels?",
      a: "When you're online, you can join chat rooms based on your location - from your street to your city. Connect with people nearby!",
    },
    {
      q: "🔐 Is it really private?",
      a: "Yes! All messages are end-to-end encrypted. We don't store messages on servers, track your activity, or sell your data. Ever.",
    },
    {
      q: "💰 Why do I need an activation code?",
      a: "Activation codes give you access to online features like location channels and cloud sync. Offline Bluetooth chat is always free!",
    },
    {
      q: "📱 Which devices are supported?",
      a: "Currently Android 8.0+. iOS support coming soon! Works on phones and tablets.",
    },
    {
      q: "🔋 Does it drain my battery?",
      a: "Nope! Zii Chat is optimized for battery efficiency. Bluetooth Low Energy means minimal power consumption.",
    },
    {
      q: "📶 What's the range?",
      a: "Direct Bluetooth range is about 10-30 meters. But with mesh networking, messages can travel much further by hopping between devices!",
    },
    {
      q: "💳 What payment methods do you accept?",
      a: "We accept all major payment methods including credit cards, debit cards, and mobile money. Secure checkout guaranteed.",
    },
  ];

  const filtered = query
    ? faqs.filter(({ q, a }) =>
        (q + a).toLowerCase().includes(query.toLowerCase())
      )
    : faqs;

  return (
    <div className={styles.container} style={{ backgroundColor: cfg.background }}>
      {/* Background Spiral */}
      <div className={styles.spiralBackground}>
        <div ref={spiralRef} />
      </div>

      {/* Layout */}
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.title}>FREQUENTLY ASKED QUESTIONS</h1>
              <p className={styles.subtitle}>
                Everything you need to know about Zii Chat
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={styles.expandButton}
              aria-expanded={isExpanded}
            >
              {isExpanded ? "Hide FAQs ▲" : "Show FAQs ▼"}
            </button>
          </div>
          {isExpanded && (
            <div className={styles.searchWrapper}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions…"
                className={styles.searchInput}
              />
            </div>
          )}
        </header>

        {/* Content */}
        {isExpanded && (
          <section className={styles.faqSection}>
            <div className={styles.faqGrid}>
              {filtered.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} index={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          © {new Date().getFullYear()} Zii Chat — Mzansi's lekka offline chat app
        </footer>
      </div>


    </div>
  );
}

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.faqItem} ${open ? styles.faqItemOpen : ""}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={styles.faqButton}
        aria-expanded={open}
      >
        <div className={styles.faqQuestion}>
          <span className={styles.faqIndex}>
            {String(index).padStart(2, "0")}
          </span>
          <h3 className={styles.faqTitle}>{q}</h3>
        </div>
        <span className={styles.faqToggle}>{open ? "–" : "+"}</span>
      </button>
      <div className={`${styles.faqAnswer} ${open ? styles.faqAnswerOpen : ""}`}>
        <div className={styles.faqAnswerContent}>
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}


