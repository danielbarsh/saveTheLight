"use client";

import React from "react";
import Image from "next/image";
import { useApplicationContext } from "@/app/ApplicationContext";
import machonLevLogo from "@/public/images/machon.png";

export default function DiagnosisPage() {
  const { score } = useApplicationContext();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      {/* Container for Diagnosis */}
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md border border-gray-300 text-center">
        {/* Logo Section */}
        <div className="mb-4 flex justify-center">
          <Image
            src={machonLevLogo}
            alt="לוגו מכון לב"
            width={120}
            height={120}
          />
        </div>

        {/* Diagnosis Message */}
        {score > 0 ? (
          <p className="text-black font-bold mt-4">
            אבחנת המערכת: לא נדרש לשלוח את הילד לאבחון
          </p>
        ) : (
          <p className="text-black font-bold mt-4">
            אבחנת המערכת: מומלץ לשלוח את הילד לאבחון
          </p>
        )}

        {/* Disclaimer */}
        <p className="text-black font-bold mt-4">
          *יש לציין שהתוצאות אינם חד משמעיות והמשחק אינו מהווה חלופה לאבחון
          פסיכולוגי
        </p>
      </div>

      {/* Debugging Score */}
      <h1 className="mt-4 text-xl font-bold">Score: {score}</h1>
    </div>
  );
}
