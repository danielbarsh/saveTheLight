"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useApplicationContext, ChoiceRecord } from "@/app/ApplicationContext";
import { supabase } from "@/lib/supabaseClient";
import machonLevLogo from "@/public/images/machon.png";

// ─── Score helpers ────────────────────────────────────────────────────────────

type CategoryTotals = {
  social: number; resilience: number;
  empathy: number; hope: number; agency: number;
};

function sumCategories(choices: ChoiceRecord[]): CategoryTotals {
  return choices.reduce(
    (acc, c) => ({
      social:     acc.social     + (c.social     ?? 0),
      resilience: acc.resilience + (c.resilience ?? 0),
      empathy:    acc.empathy    + (c.empathy    ?? 0),
      hope:       acc.hope       + (c.hope       ?? 0),
      agency:     acc.agency     + (c.agency     ?? 0),
    }),
    { social: 0, resilience: 0, empathy: 0, hope: 0, agency: 0 }
  );
}

// Normalize a delta value [-max, +max] to a 0–100 integer for DB storage
function normalize(value: number, max: number): number {
  return Math.round(Math.max(0, Math.min(100, ((value + max) / (max * 2)) * 100)));
}

function calcNeedsAttention(score: number, cats: CategoryTotals): boolean {
  const concerns = [cats.social, cats.resilience, cats.empathy, cats.hope, cats.agency]
    .filter((v) => v < 0).length;
  // Mirrors the orange/red threshold from the original diagnosis page
  return !(score > 5 && concerns <= 1);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CompletionPage() {
  useApplicationContext(); // keep context alive for audio
  const savedRef = useRef(false); // prevent double-save (React StrictMode)

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    const saveResults = async () => {
      const studentId = localStorage.getItem("studentId");
      const managerId = localStorage.getItem("managerId");
      if (!studentId || !managerId) return;

      // Read directly from localStorage — context may not have hydrated yet
      const score = parseInt(localStorage.getItem("score") ?? "0", 10);
      const choices: ChoiceRecord[] = (() => {
        try { return JSON.parse(localStorage.getItem("choices") ?? "[]"); }
        catch { return []; }
      })();

      const cats = sumCategories(choices);

      const { error: insertError } = await supabase.from("user_results").insert({
        user_id:              studentId,
        manager_id:           managerId,
        social_involvement:   normalize(cats.social,     12),
        emotional_resilience: normalize(cats.resilience, 12),
        empathy:              normalize(cats.empathy,    18),
        hope:                 normalize(cats.hope,       12),
        initiative:           normalize(cats.agency,     14),
        final_score:          score,
        needs_attention:      calcNeedsAttention(score, cats),
      });

      if (insertError) {
        console.warn("Failed to save results:", insertError.message);
        return;
      }

      localStorage.removeItem("studentId");
      localStorage.removeItem("managerId");
    };

    saveResults();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0a0a14 0%, #060a06 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>

        {/* Company logo */}
        <div style={{ display: "inline-flex", background: "#fff", borderRadius: "50%", padding: 10, marginBottom: 20, boxShadow: "0 0 30px rgba(255,255,255,0.15)" }}>
          <Image src={machonLevLogo} alt="לוגו מכון לב" width={84} height={84} />
        </div>

        {/* Subtitle */}
        <div style={{ color: "#555", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
          להציל את האור
        </div>

        {/* Stars decoration */}
        <div style={{ fontSize: 32, marginBottom: 10, letterSpacing: 8 }}>✨ 🌟 ✨</div>

        {/* Main heading */}
        <h1
          style={{
            color: "#d4af37",
            fontSize: 34,
            fontWeight: "bold",
            margin: "0 0 10px",
            textShadow: "0 0 30px rgba(212,175,55,0.5)",
            direction: "rtl",
          }}
        >
          סיימת את המסע!
        </h1>

        {/* Subheading */}
        <p style={{ color: "#c8c8d8", fontSize: 18, margin: "0 0 24px", direction: "rtl" }}>
          תודה שהשתתפת
        </p>

        {/* Card */}
        <div
          style={{
            background: "#0e0e18",
            border: "1px solid #2a2a3a",
            borderRadius: 16,
            padding: "28px 32px",
            direction: "rtl",
            boxShadow: "0 0 40px rgba(212,175,55,0.08)",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>

          <p style={{ color: "#e0e0f0", fontSize: 15, lineHeight: 1.8, margin: "0 0 16px" }}>
            עברת בהצלחה את כל חמשת הפרקים של המסע.
            <br />
            הבחירות שעשית לאורך הדרך נרשמו ויוצגו בפני הצוות המלווה שלך.
          </p>

          <div
            style={{
              background: "#080810",
              border: "1px solid #1e1e30",
              borderRadius: 10,
              padding: "14px 18px",
            }}
          >
            <p style={{ color: "#666", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              התוצאות המלאות יועברו לידי המנחה שלך בלבד.
              <br />
              ניתן לסגור את הדף.
            </p>
          </div>
        </div>

        {/* Machon branding */}
        <div style={{ marginTop: 28, color: "#2a2a3a", fontSize: 11, letterSpacing: 1 }}>
          מכון לב · מערכת הערכה פסיכו-חינוכית
        </div>
      </div>
    </div>
  );
}
