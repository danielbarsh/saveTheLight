"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserResult = {
  social_involvement:   number;
  emotional_resilience: number;
  empathy:              number;
  hope:                 number;
  initiative:           number;
  final_score:          number;
  needs_attention:      boolean;
};

type Student = {
  id:           string;
  username:     string;
  user_results: UserResult[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function latestResult(student: Student): UserResult | null {
  if (!student.user_results || student.user_results.length === 0) return null;
  return student.user_results[student.user_results.length - 1];
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ label, value, description, concern }: {
  label: string; value: number; description: string; concern: string;
}) {
  const pct   = Math.min(100, Math.max(0, value));
  const color = value >= 70 ? "#4a9a30" : value >= 45 ? "#c8a020" : "#c03030";
  return (
    <div style={{ marginBottom: 20, direction: "rtl" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontWeight: "bold", color: "#e0e0e0", fontSize: 14 }}>{label}</span>
        <span style={{ color, fontSize: 13, fontWeight: "bold" }}>{value}</span>
      </div>
      <div style={{ background: "#2a2a2a", borderRadius: 6, height: 10, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 6, transition: "width 0.6s" }} />
      </div>
      <p style={{ color: "#888", fontSize: 12, margin: "4px 0 0", textAlign: "right" }}>
        {value < 45 ? concern : description}
      </p>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ student, onClose }: { student: Student; onClose: () => void }) {
  const result = latestResult(student);

  const indicators = result ? [
    { label: "מעורבות חברתית", value: result.social_involvement,   description: "נכון לעזור לאחרים ולהתחבר אליהם",  concern: "נטייה להסתגרות ובידוד חברתי"      },
    { label: "עמידות רגשית",   value: result.emotional_resilience, description: "מתמודד עם אתגרים ולא בורח מהם",    concern: "נטייה להימנעות מפחדים ואתגרים"    },
    { label: "אמפתיה",         value: result.empathy,              description: "מכיר ומגיב לכאב של אחרים",         concern: "קושי לחוש ולהגיב לרגשות אחרים"   },
    { label: "תקווה",          value: result.hope,                 description: "מאמין בתוצאות חיוביות ובשינוי",     concern: "תחושת חוסר תקווה ופסימיות"        },
    { label: "יוזמה ופעולה",   value: result.initiative,           description: "נוקט פעולה ולא נשאר פסיבי",        concern: "פסיביות וחוסר יכולת לנקוט פעולה" },
  ] : [];

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 50,
               display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto",
                 background: "linear-gradient(180deg,#0a0a14 0%,#080c08 100%)",
                 borderRadius: 16, padding: "28px 28px 24px", position: "relative" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, left: 16, background: "#1a1a2a",
                   border: "1px solid #3a3a5a", borderRadius: 8, color: "#888",
                   cursor: "pointer", padding: "4px 10px", fontSize: 18, lineHeight: 1 }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24, direction: "rtl" }}>
          <div style={{ color: "#888", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>
            להציל את האור — תוצאות מסע
          </div>
          <h2 style={{ color: "#d4af37", fontSize: 22, margin: "6px 0 2px",
                       textShadow: "0 0 20px rgba(212,175,55,0.4)" }}>
            {student.username}
          </h2>
          {result && (
            <div style={{ marginTop: 10 }}>
              <span style={{ color: "#888", fontSize: 13 }}>ניקוד סופי: </span>
              <strong style={{ color: "#d4af37", fontSize: 20 }}>{result.final_score}</strong>
            </div>
          )}
        </div>

        {!result ? (
          <div style={{ textAlign: "center", color: "#555", padding: "32px 0", direction: "rtl" }}>
            התלמיד טרם השלים את המסע — אין נתונים להצגה.
          </div>
        ) : (
          <>
            {result.needs_attention ? (
              <div style={{ background: "#1a0a0a", border: "2px solid #c03030", borderRadius: 12,
                            padding: "16px 20px", marginBottom: 20, direction: "rtl",
                            boxShadow: "0 0 20px rgba(192,48,48,0.25)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#c03030", flexShrink: 0 }} />
                  <h3 style={{ color: "#e05050", fontSize: 15, margin: 0 }}>מומלץ לאבחון מקצועי</h3>
                </div>
                <p style={{ color: "#c8b8b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  הבחירות לאורך המסע מציגות סימנים המצריכים הערכה מקצועית.
                  מומלץ לפנות לאיש מקצוע מוסמך.
                </p>
              </div>
            ) : (
              <div style={{ background: "#0a1a0a", border: "2px solid #4a9a30", borderRadius: 12,
                            padding: "16px 20px", marginBottom: 20, direction: "rtl",
                            boxShadow: "0 0 20px rgba(74,154,48,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#4a9a30", flexShrink: 0 }} />
                  <h3 style={{ color: "#6ab840", fontSize: 15, margin: 0 }}>אין סימני דאגה</h3>
                </div>
                <p style={{ color: "#b8c8b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  התלמיד הפגין דפוסים חיוביים לאורך המסע. לא נדרש אבחון בשלב זה.
                </p>
              </div>
            )}

            <div style={{ background: "#0e0e18", border: "1px solid #2a2a3a",
                          borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
              <h3 style={{ color: "#d4af37", fontSize: 14, margin: "0 0 18px", textAlign: "right", direction: "rtl" }}>
                פירוט לפי קטגוריה
              </h3>
              {indicators.map((ind) => <ProgressBar key={ind.label} {...ind} />)}
            </div>

            <div style={{ background: "#080810", border: "1px solid #1a1a2a",
                          borderRadius: 8, padding: "12px 16px", direction: "rtl" }}>
              <p style={{ color: "#444", fontSize: 11, lineHeight: 1.6, margin: 0, textAlign: "right" }}>
                <strong style={{ color: "#555" }}>הערה: </strong>
                תוצאות אלו אינן מהוות אבחון פסיכולוגי מקצועי ואינן חלופה לו.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Add Student Modal ────────────────────────────────────────────────────────

function AddStudentModal({ managerId, onClose, onAdded }: {
  managerId: string; onClose: () => void; onAdded: () => void;
}) {
  const [username,  setUsername]  = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState("");
  const [saving,    setSaving]    = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim())      { setError("נא להזין שם משתמש."); return; }
    if (username.trim().length < 3) { setError("שם משתמש חייב להכיל לפחות 3 תווים."); return; }
    if (!password)             { setError("נא להזין סיסמה."); return; }
    if (password.length < 4)   { setError("הסיסמה חייבת להכיל לפחות 4 תווים."); return; }

    setSaving(true);

    // Check username uniqueness under this manager
    const { data: existing } = await supabase
      .from("managed_users")
      .select("id")
      .eq("manager_id", managerId)
      .eq("username", username.trim())
      .maybeSingle();

    if (existing) { setError("שם משתמש זה כבר קיים. בחר שם אחר."); setSaving(false); return; }

    const { error: dbError } = await supabase
      .from("managed_users")
      .insert({ username: username.trim(), password, manager_id: managerId });

    if (dbError) { setError(dbError.message); setSaving(false); return; }

    onAdded();
    onClose();
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50,
               display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div
        className="bg-[#0f172a] border border-[#1e3a5f] rounded-2xl p-7 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-white mb-1 text-right">➕ הוספת תלמיד חדש</h2>
        <p className="text-xs text-slate-500 text-right mb-5">פרטי ההתחברות של התלמיד למשחק</p>

        <form onSubmit={handleAdd} noValidate className="space-y-4" dir="rtl">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">שם משתמש</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              autoFocus
              className="w-full bg-[#0a0f1e] border border-[#1e3a5f] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
              placeholder="לדוגמה: david_k"
              dir="ltr"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">סיסמה</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full bg-[#0a0f1e] border border-[#1e3a5f] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
                placeholder="לפחות 4 תווים"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs transition"
              >
                {showPass ? "הסתר" : "הצג"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-50"
            >
              {saving ? "שומר…" : "הוסף תלמיד"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#1e3a5f] text-slate-400 hover:text-white rounded-xl py-2.5 text-sm transition"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReviewerDashboard() {
  const router = useRouter();
  const [reviewerName, setReviewerName] = useState<string | null>(null);
  const [managerId,    setManagerId]    = useState<string | null>(null);
  const [students,     setStudents]     = useState<Student[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [selected,     setSelected]     = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadStudents = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from("managed_users")
      .select(`
        id, username,
        user_results (
          social_involvement, emotional_resilience, empathy,
          hope, initiative, final_score, needs_attention
        )
      `)
      .eq("manager_id", uid);

    if (!error && data) setStudents(data as Student[]);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, username")
        .eq("id", session.user.id)
        .single();

      if (!profile || profile.role !== "reviewer") { router.replace("/game"); return; }

      setReviewerName(profile.username ?? session.user.email ?? "מנהל");
      setManagerId(session.user.id);
      await loadStudents(session.user.id);
      setLoading(false);
    };
    init();
  }, [router, loadStudents]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const displayed = students.filter((s) =>
    s.username.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:   students.length,
    passed:  students.filter((s) => latestResult(s)?.needs_attention === false).length,
    review:  students.filter((s) => latestResult(s)?.needs_attention === true).length,
    pending: students.filter((s) => latestResult(s) === null).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
        <p className="text-blue-400 text-lg font-semibold animate-pulse">טוען נתונים…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white" dir="rtl">

      {selected && <DetailModal student={selected} onClose={() => setSelected(null)} />}
      {showAddModal && managerId && (
        <AddStudentModal
          managerId={managerId}
          onClose={() => setShowAddModal(false)}
          onAdded={() => loadStudents(managerId)}
        />
      )}

      {/* Top bar */}
      <header className="bg-[#0f172a] border-b border-[#1e3a5f] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-base">
            🧠
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">מערכת הערכה פסיכו-חינוכית</h1>
            <p className="text-xs text-slate-500 mt-0.5">שלום, {reviewerName} · מנהל</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-slate-400 hover:text-white border border-[#1e3a5f] hover:border-slate-500 rounded-lg px-4 py-1.5 transition"
        >
          התנתק
        </button>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-6">

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "סה״כ תלמידים", value: stats.total,   icon: "👥", color: "text-blue-400",    bg: "from-blue-900/30 to-blue-900/10"       },
            { label: "עברו בהצלחה",  value: stats.passed,  icon: "✅", color: "text-emerald-400", bg: "from-emerald-900/30 to-emerald-900/10" },
            { label: "דורשים בדיקה", value: stats.review,  icon: "🚨", color: "text-red-400",     bg: "from-red-900/30 to-red-900/10"         },
            { label: "ממתינים",       value: stats.pending, icon: "⏳", color: "text-slate-400",   bg: "from-slate-800/50 to-slate-800/20"     },
          ].map((s) => (
            <div key={s.label} className={`bg-gradient-to-br ${s.bg} rounded-2xl p-5 border border-[#1e3a5f]`}>
              <p className="text-xl mb-2">{s.icon}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#0f172a] rounded-2xl border border-[#1e3a5f] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e3a5f] flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">תלמידים מנוהלים</h2>
              <p className="text-xs text-slate-500 mt-0.5">לחץ על שורה לצפייה בדוח המלא</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="text"
                placeholder="חיפוש שם משתמש…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#0a0f1e] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
              />
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition flex items-center gap-1.5"
              >
                <span>➕</span> הוסף תלמיד
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs bg-[#0a0f1e]">
                  <th className="px-5 py-3 text-right font-medium">#</th>
                  <th className="px-5 py-3 text-right font-medium">שם משתמש</th>
                  <th className="px-5 py-3 text-right font-medium">ניקוד סופי</th>
                  <th className="px-5 py-3 text-right font-medium">סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-14 text-slate-600">
                      {students.length === 0
                        ? 'אין תלמידים עדיין — לחץ "הוסף תלמיד" כדי להתחיל'
                        : "לא נמצאו תוצאות לחיפוש"}
                    </td>
                  </tr>
                ) : (
                  displayed.map((s, i) => {
                    const result  = latestResult(s);
                    const hasData = result !== null;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelected(s)}
                        className={`border-t border-[#1e3a5f] cursor-pointer transition hover:bg-[#111d35] ${
                          !hasData ? "opacity-40" : ""
                        }`}
                      >
                        <td className="px-5 py-4 text-slate-600 font-mono text-xs">{i + 1}</td>
                        <td className="px-5 py-4">
                          <span className={`font-medium font-mono ${hasData ? "text-white" : "text-slate-500 italic"}`}>
                            {s.username}
                          </span>
                          {!hasData && (
                            <span className="block text-[11px] text-slate-600 font-sans not-italic">טרם שיחק</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {result
                            ? <span className="font-mono font-bold text-[#d4af37]">{result.final_score}</span>
                            : <span className="text-slate-600 text-xs">—</span>}
                        </td>
                        <td className="px-5 py-4">
                          {!result ? (
                            <span className="text-xs text-slate-600 italic">ממתין</span>
                          ) : result.needs_attention ? (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-900/40 text-red-400 border border-red-800">
                              דורש בדיקה
                            </span>
                          ) : (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-800">
                              עבר ✓
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-[#1e3a5f] text-xs text-slate-600">
            מציג {displayed.length} מתוך {students.length} תלמידים
          </div>
        </div>
      </main>
    </div>
  );
}
