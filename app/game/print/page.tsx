"use client";

import React from "react";
import Image from "next/image";
import { useApplicationContext, ChoiceRecord } from "@/app/ApplicationContext";
import machonLevLogo from "@/public/images/machon.png";

type CategoryTotals = {
  social: number;
  resilience: number;
  empathy: number;
  hope: number;
  agency: number;
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

type Indicator = { label: string; value: number; maxPositive: number; description: string; concern: string };

function CategoryBar({ label, value, maxPositive, description, concern }: Indicator) {
  const pct = Math.max(0, Math.min(100, ((value + maxPositive) / (maxPositive * 2)) * 100));
  const isLow = value < 0;
  const color = isLow ? "#c03030" : value === 0 ? "#888" : "#4a9a30";

  return (
    <div style={{ marginBottom: 20, direction: "rtl" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontWeight: "bold", color: "#e0e0e0", fontSize: 14 }}>{label}</span>
        <span style={{ color, fontSize: 13, fontWeight: "bold" }}>{value > 0 ? `+${value}` : value}</span>
      </div>
      <div style={{ background: "#2a2a2a", borderRadius: 6, height: 10, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 6, transition: "width 0.6s" }} />
      </div>
      <p style={{ color: "#888", fontSize: 12, margin: "4px 0 0", textAlign: "right" }}>
        {isLow ? concern : description}
      </p>
    </div>
  );
}

function getOverallAssessment(score: number, cats: CategoryTotals) {
  const concernCount = [cats.social, cats.resilience, cats.empathy, cats.hope, cats.agency].filter(v => v < 0).length;

  if (score > 20 && concernCount === 0) return {
    level: "ירוק",
    color: "#4a9a30",
    title: "אין סימני דאגה",
    message: "הילד הפגין התנהגות חברתית וחיובית לאורך כל המסע. לא נדרש אבחון בשלב זה.",
    recommend: false,
  };
  if (score > 5 && concernCount <= 1) return {
    level: "צהוב",
    color: "#c8a020",
    title: "מצב תקין עם נקודות לתשומת לב",
    message: "ניתן לראות דפוסים חיוביים בבחירות הילד, אך קיימות כמה נקודות הדורשות מעקב.",
    recommend: false,
  };
  if (score > -5 && concernCount <= 2) return {
    level: "כתום",
    color: "#c85020",
    title: "מומלץ להתייחסות",
    message: "הבחירות שנעשו מצביעות על דפוסים מספר הדורשים שיחה ותשומת לב מהמבוגר הקרוב.",
    recommend: true,
  };
  return {
    level: "אדום",
    color: "#c03030",
    title: "מומלץ לאבחון מקצועי",
    message: "הבחירות לאורך המסע מציגות מספר סימנים המצריכים הערכה מקצועית. מומלץ לפנות לאיש מקצוע.",
    recommend: true,
  };
}

export default function DiagnosisPage() {
  const { score, choices } = useApplicationContext();
  const cats = sumCategories(choices);
  const assessment = getOverallAssessment(score, cats);

  const indicators: Indicator[] = [
    { label: "מעורבות חברתית", value: cats.social,     maxPositive: 12, description: "נכון לעזור לאחרים ולהתחבר אליהם", concern: "נטייה להסתגרות ובידוד חברתי" },
    { label: "עמידות רגשית",   value: cats.resilience, maxPositive: 12, description: "מתמודד עם אתגרים ולא בורח מהם",  concern: "נטייה להימנעות מפחדים ואתגרים" },
    { label: "אמפתיה",         value: cats.empathy,    maxPositive: 18, description: "מכיר ומגיב לכאב של אחרים",       concern: "קושי לחוש ולהגיב לרגשות אחרים" },
    { label: "תקווה",          value: cats.hope,       maxPositive: 12, description: "מאמין בתוצאות חיוביות ובשינוי",   concern: "תחושת חוסר תקווה ופסימיות" },
    { label: "יוזמה ופעולה",   value: cats.agency,     maxPositive: 14, description: "נוקט פעולה ולא נשאר פסיבי",      concern: "פסיביות וחוסר יכולת לנקוט פעולה" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0a0a14 0%, #080c08 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", background: "#fff", borderRadius: "50%", padding: 8, marginBottom: 12 }}>
            <Image src={machonLevLogo} alt="לוגו מכון לב" width={80} height={80} />
          </div>
          <div style={{ color: "#888", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>להציל את האור</div>
          <h1 style={{ color: "#d4af37", fontSize: 24, margin: "6px 0", textShadow: "0 0 20px rgba(212,175,55,0.4)" }}>תוצאות המסע</h1>
          <div style={{ color: "#666", fontSize: 13 }}>ניקוד סופי: <strong style={{ color: "#d4af37" }}>{score}</strong></div>
        </div>

        {/* Overall card */}
        <div
          style={{
            background: "#0e0e18",
            border: `2px solid ${assessment.color}`,
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 24,
            direction: "rtl",
            boxShadow: `0 0 20px ${assessment.color}30`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: assessment.color, flexShrink: 0 }} />
            <h2 style={{ color: assessment.color, fontSize: 17, margin: 0 }}>{assessment.title}</h2>
          </div>
          <p style={{ color: "#c8c8d8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{assessment.message}</p>
        </div>

        {/* Category breakdown */}
        <div
          style={{
            background: "#0e0e18",
            border: "1px solid #2a2a3a",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 24,
          }}
        >
          <h3 style={{ color: "#d4af37", fontSize: 15, margin: "0 0 20px", textAlign: "right", direction: "rtl" }}>פירוט לפי קטגוריה</h3>
          {indicators.map((ind) => <CategoryBar key={ind.label} {...ind} />)}
        </div>

        {/* Choices summary */}
        {choices.length > 0 && (
          <div
            style={{
              background: "#0e0e18",
              border: "1px solid #2a2a3a",
              borderRadius: 12,
              padding: "20px 24px",
              marginBottom: 24,
              direction: "rtl",
            }}
          >
            <h3 style={{ color: "#888", fontSize: 14, margin: "0 0 14px" }}>סיכום בחירות</h3>
            {choices.map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < choices.length - 1 ? "1px solid #1a1a28" : "none" }}>
                <span style={{ color: "#666", fontSize: 12 }}>פרק {c.level} — {c.npc}</span>
                <span style={{ color: c.delta >= 0 ? "#4a9a30" : "#c03030", fontSize: 13, fontWeight: "bold" }}>{c.delta > 0 ? `+${c.delta}` : c.delta}</span>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div
          style={{
            background: "#080810",
            border: "1px solid #1a1a2a",
            borderRadius: 8,
            padding: "14px 18px",
            direction: "rtl",
            marginBottom: 24,
          }}
        >
          <p style={{ color: "#555", fontSize: 12, lineHeight: 1.6, margin: 0, textAlign: "right" }}>
            <strong style={{ color: "#666" }}>הערה חשובה: </strong>
            תוצאות אלו אינן מהוות אבחון פסיכולוגי מקצועי ואינן חלופה לו.
            המשחק נועד לעורר מודעות ולזהות דפוסים התנהגותיים בלבד.
            לאבחון מלא ומדויק, יש לפנות לאיש מקצוע מוסמך.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => window.print()}
            style={{ padding: "10px 24px", background: "#1a1a2a", border: "1px solid #3a3a5a", borderRadius: 8, color: "#c8c8e0", cursor: "pointer", fontSize: 14 }}
          >
            הדפס דוח
          </button>
          <a
            href="/"
            style={{ padding: "10px 24px", background: "#d4af37", color: "#0a0a14", borderRadius: 8, fontWeight: "bold", textDecoration: "none", fontSize: 14 }}
          >
            משחק חדש
          </a>
        </div>
      </div>
    </div>
  );
}
