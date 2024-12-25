"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [language, setLanguage] = useState("he");

  const styles = {
    body: {
      margin: 0,
      padding: 0,
      background: "linear-gradient(120deg, #83eaf1, #63a4ff)",
      fontFamily: "'Guttman Yad-Brush', cursive",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      position: "relative",
    },
    cloudsContainer: {
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: 1,
      pointerEvents: "none",
    },
    gameContainer: {
      textAlign: "center",
      position: "relative",
      zIndex: 2,
    },
    gameTitle: {
      fontSize: "4em",
      color: "#ffffff",
      textShadow: "3px 3px #ff6b6b",
      marginBottom: "40px",
      animation: "bounce 2s infinite",
    },
    menuButton: {
      display: "block",
      width: "200px",
      margin: "20px auto",
      padding: "15px",
      fontSize: "1.5em",
      border: "none",
      borderRadius: "25px",
      background: "#ffffff",
      color: "#63a4ff",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    cloud: {
      position: "absolute",
      background: "white",
      borderRadius: "50%",
      opacity: 0.8,
      animation: "float linear infinite",
    },
  };

  const startGame = () => {};

  const showOptions = () => {
    alert(language === "he" ? "פתיחת אפשרויות..." : "Opening options...");
  };

  const exitGame = () => {
    const confirmExit =
      language === "he"
        ? "האם אתה בטוח שברצונך לצאת??"
        : "Are you sure you want to exit?";
    if (window.confirm(confirmExit)) {
      window.close();
    }
  };

  return (
    <>
      <div style={styles.body as any}>
        <div id="cloudsContainer" style={styles.cloudsContainer as any}></div>
        <div style={styles.gameContainer as any}>
          <h1 style={styles.gameTitle}>
            {language === "he" ? "להציל את האור" : "Save the Light"}
          </h1>
          <Link style={styles.menuButton} href={"/game/level1"} passHref>
            {language === "he" ? "התחל" : "Start"}
          </Link>
          <button style={styles.menuButton} onClick={showOptions}>
            {language === "he" ? "אפשרויות" : "Options"}
          </button>
          <button style={styles.menuButton} onClick={exitGame}>
            {language === "he" ? "יציאה" : "Exit"}
          </button>
          <button
            style={styles.menuButton}
            onClick={() => setLanguage((prev) => (prev === "he" ? "en" : "he"))}
          >
            {language === "he" ? "Change Language" : "שנה שפה"}
          </button>
        </div>
      </div>
    </>
  );
}
