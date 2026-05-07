"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function GameMenu() {
  const router   = useRouter();
  const [language, setLanguage] = useState("he");

  // Login prompt state
  const [showPrompt, setShowPrompt]   = useState(false);
  const [username,   setUsername]     = useState("");
  const [password,   setPassword]     = useState("");
  const [showPass,   setShowPass]     = useState(false);
  const [promptErr,  setPromptErr]    = useState("");
  const [verifying,  setVerifying]    = useState(false);

  const handleStart = () => {
    setShowPrompt(true);
    setPromptErr("");
  };

  const handleLoginConfirm = async () => {
    if (!username.trim()) { setPromptErr(language === "he" ? "נא להזין שם משתמש" : "Please enter username"); return; }
    if (!password)        { setPromptErr(language === "he" ? "נא להזין סיסמה"    : "Please enter password"); return; }

    setVerifying(true);
    setPromptErr("");

    // Verify credentials against managed_users
    // Requires: RLS policy allowing anon SELECT on managed_users
    const { data: student, error } = await import("@/lib/supabaseClient").then(({ supabase }) =>
      supabase
        .from("managed_users")
        .select("id, manager_id")
        .eq("username", username.trim())
        .eq("password", password)
        .maybeSingle()
    );

    setVerifying(false);

    if (error || !student) {
      setPromptErr(language === "he" ? "שם משתמש או סיסמה שגויים" : "Incorrect username or password");
      return;
    }

    localStorage.setItem("studentId",  student.id);
    localStorage.setItem("managerId",  student.manager_id);
    router.push("/game/level1");
  };

  const styles = {
    body: {
      margin: 0, padding: 0,
      background: "linear-gradient(120deg, #83eaf1, #63a4ff)",
      fontFamily: "'Guttman Yad-Brush', cursive",
      height: "100vh",
      display: "flex", justifyContent: "center", alignItems: "center",
      overflow: "hidden", position: "relative",
    } as React.CSSProperties,
    cloudsContainer: {
      position: "absolute", width: "100%", height: "100%",
      zIndex: 1, pointerEvents: "none",
    } as React.CSSProperties,
    gameContainer: {
      textAlign: "center", position: "relative", zIndex: 2,
    } as React.CSSProperties,
    gameTitle: {
      fontSize: "4em", color: "#ffffff",
      textShadow: "3px 3px #ff6b6b", marginBottom: "40px",
      animation: "bounce 2s infinite",
    } as React.CSSProperties,
    menuButton: {
      display: "block", width: "200px", margin: "20px auto", padding: "15px",
      fontSize: "1.5em", border: "none", borderRadius: "25px",
      background: "#ffffff", color: "#63a4ff", cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    } as React.CSSProperties,
  };

  return (
    <>
      <div style={styles.body}>
        <div id="cloudsContainer" style={styles.cloudsContainer} />
        <div style={styles.gameContainer}>
          <h1 style={styles.gameTitle}>
            {language === "he" ? "להציל את האור" : "Save the Light"}
          </h1>

          <button style={styles.menuButton} onClick={handleStart}>
            {language === "he" ? "התחל" : "Start"}
          </button>
          <button style={styles.menuButton} onClick={() =>
            alert(language === "he" ? "פתיחת אפשרויות..." : "Opening options...")
          }>
            {language === "he" ? "אפשרויות" : "Options"}
          </button>
          <button style={styles.menuButton} onClick={() =>
            setLanguage((p) => (p === "he" ? "en" : "he"))
          }>
            {language === "he" ? "שנה שפה" : "Change Language"}
          </button>
          <button style={styles.menuButton} onClick={() => {
            if (window.confirm(language === "he" ? "האם אתה בטוח שברצונך לצאת?" : "Are you sure you want to exit?"))
              window.close();
          }}>
            {language === "he" ? "יציאה" : "Exit"}
          </button>
        </div>
      </div>

      {/* Email prompt overlay */}
      {showPrompt && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowPrompt(false)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 24,
              padding: "36px 32px", width: "100%", maxWidth: 400,
              boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
              direction: "rtl", textAlign: "right",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 36, textAlign: "center", marginBottom: 8 }}>🧭</div>
            <h2 style={{ color: "#63a4ff", fontSize: 22, fontWeight: "bold", textAlign: "center", margin: "0 0 6px" }}>
              {language === "he" ? "כניסה למשחק" : "Sign In"}
            </h2>
            <p style={{ color: "#888", fontSize: 14, textAlign: "center", marginBottom: 24, lineHeight: 1.6 }}>
              {language === "he"
                ? "הזן את שם המשתמש והסיסמה שקיבלת מהמנחה"
                : "Enter the username and password given by your supervisor"}
            </p>

            {/* Username */}
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>
              {language === "he" ? "שם משתמש" : "Username"}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setPromptErr(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLoginConfirm()}
              dir="ltr"
              placeholder="e.g. david_k"
              autoFocus
              style={{
                width: "100%", boxSizing: "border-box",
                border: promptErr ? "2px solid #e05050" : "2px solid #e0e8ff",
                borderRadius: 12, padding: "11px 14px", fontSize: 15,
                outline: "none", color: "#333", marginBottom: 14,
                transition: "border-color 0.2s",
              }}
            />

            {/* Password */}
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>
              {language === "he" ? "סיסמה" : "Password"}
            </label>
            <div style={{ position: "relative", marginBottom: 4 }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPromptErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLoginConfirm()}
                dir="ltr"
                placeholder="••••••••"
                style={{
                  width: "100%", boxSizing: "border-box",
                  border: promptErr ? "2px solid #e05050" : "2px solid #e0e8ff",
                  borderRadius: 12, padding: "11px 14px", paddingLeft: 56, fontSize: 15,
                  outline: "none", color: "#333",
                  transition: "border-color 0.2s",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#aaa", fontSize: 12,
                  cursor: "pointer", padding: 0,
                }}
              >
                {showPass ? (language === "he" ? "הסתר" : "Hide") : (language === "he" ? "הצג" : "Show")}
              </button>
            </div>

            {promptErr && (
              <p style={{ color: "#e05050", fontSize: 12, margin: "6px 0 0" }}>{promptErr}</p>
            )}

            <button
              onClick={handleLoginConfirm}
              disabled={verifying}
              style={{
                display: "block", width: "100%", marginTop: 20,
                background: verifying ? "#aac4e8" : "linear-gradient(135deg, #63a4ff, #4f8fe0)",
                color: "#fff", border: "none", borderRadius: 14,
                padding: "14px", fontSize: 16, fontWeight: "bold",
                cursor: verifying ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(99,164,255,0.4)",
                transition: "background 0.2s",
              }}
            >
              {verifying
                ? (language === "he" ? "מאמת…" : "Verifying…")
                : (language === "he" ? "🚀 התחל את המסע" : "🚀 Start the Journey")}
            </button>

            <button
              onClick={() => setShowPrompt(false)}
              style={{
                display: "block", width: "100%", marginTop: 10,
                background: "transparent", color: "#aaa",
                border: "none", fontSize: 13, cursor: "pointer", padding: 6,
              }}
            >
              {language === "he" ? "ביטול" : "Cancel"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
