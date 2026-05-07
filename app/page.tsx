"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Mode = "login" | "signup";

const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
};

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (mode === "signup" && !REGEX.email.test(email)) next.email = "כתובת אימייל לא תקינה.";
    if (mode === "login" && !email.trim()) next.email = "נא להזין שם משתמש.";
    if (mode === "signup" && !REGEX.password.test(password))
      next.password = "מינימום 8 תווים — אות גדולה ואות קטנה.";
    if (mode === "login" && !password)
      next.password = "נא להזין סיסמה.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const fetchRoleAndRedirect = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !data) {
      setServerError("ההתחברות הצליחה אך לא ניתן לטעון את הפרופיל. נסה שוב.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      if (data.role === "reviewer") {
        router.push("/reviewer");
      } else {
        router.push("/game");
      }
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setInfoMessage("");
    if (!validate()) return;

    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: "reviewer" } },
      });

      if (error) { setServerError(error.message); setLoading(false); return; }

      if (data.session && data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({ id: data.user.id, username: email, role: "reviewer" });

        if (profileError) {
          setServerError(profileError.message);
          setLoading(false);
          return;
        }

        await fetchRoleAndRedirect(data.user.id);
      } else if (data.user) {
        setInfoMessage("החשבון נוצר! בדוק את תיבת האימייל שלך כדי לאשר ולהתחבר.");
        setMode("login");
      }
    } else {
      // Try manager login (Supabase Auth)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error && data.user) {
        await fetchRoleAndRedirect(data.user.id);
      } else {
        // Clear any existing session so the query runs as anon (required by RLS)
        await supabase.auth.signOut();

        // Try student login (managed_users)
        const { data: student, error: studentError } = await supabase
          .from("managed_users")
          .select("id, manager_id")
          .eq("username", email.trim())
          .eq("password", password)
          .maybeSingle();

        if (studentError || !student) {
          setServerError(studentError?.message ?? "שם משתמש או סיסמה שגויים.");
          setLoading(false);
          return;
        }

        // Check if student already completed the diagnostic
        const { data: result } = await supabase
          .from("user_results")
          .select("id")
          .eq("user_id", student.id)
          .maybeSingle();

        if (result) {
          setServerError("האבחון כבר הושלם. פנה למנחה שלך לקבלת התוצאות.");
          setLoading(false);
          return;
        }

        localStorage.setItem("studentId", student.id);
        localStorage.setItem("managerId", student.manager_id);
        setSuccess(true);
        setTimeout(() => router.push("/game/level1"), 1500);
      }
    }

    setLoading(false);
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setErrors({});
    setServerError("");
    setInfoMessage("");
    setSuccess(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#83eaf1] to-[#63a4ff] px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#63a4ff] to-indigo-500 flex items-center justify-center text-2xl shadow">
            🧠
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-[#63a4ff] mb-1">
          {mode === "login" ? "ברוך הבא" : "הרשמה למנהל"}
        </h1>
        <p className="text-center text-gray-400 text-sm mb-6">
          {mode === "login" ? "מערכת הערכה פסיכו-חינוכית" : "יצירת חשבון מנהל חדש"}
        </p>

        {/* Mode toggle */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
          {(["login", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => m !== mode && toggleMode()}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                mode === m ? "bg-white text-[#63a4ff] shadow" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {m === "login" ? "התחברות" : "הרשמה"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {mode === "login" ? "שם משתמש" : "אימייל"}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#63a4ff] focus:border-transparent"
              placeholder={mode === "login" ? "הכנס שם משתמש" : "manager@school.edu"}
              autoComplete="email"
              dir="ltr"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#63a4ff] focus:border-transparent"
              placeholder="••••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              dir="ltr"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>


          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5">
              {serverError}
            </div>
          )}
          {infoMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-2.5">
              {infoMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#63a4ff] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#4f8fe0] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "אנא המתן…" : mode === "login" ? "התחבר" : "צור חשבון"}
          </button>

          {success && (
            <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-300 text-green-700 text-sm font-semibold rounded-xl px-4 py-3 mt-1">
              <span>✅</span>
              <span>{mode === "login" ? "ההתחברות" : "ההרשמה"} בוצעה בהצלחה</span>
            </div>
          )}
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          {mode === "login" ? "אין לך חשבון עדיין?" : "כבר יש לך חשבון?"}{" "}
          <button type="button" onClick={toggleMode} className="text-[#63a4ff] font-semibold hover:underline">
            {mode === "login" ? "הרשמה" : "התחברות"}
          </button>
        </p>
      </div>
    </div>
  );
}
