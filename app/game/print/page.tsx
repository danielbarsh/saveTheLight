"use client";

import { useApplicationContext } from "@/app/ApplicationContext";
import React from "react";

const DiagnosisBox: React.FC = () => {
  const { score } = useApplicationContext();

  return (
    <div className="bg-black text-white p-4 rounded-md">
      {score > 0 ? (
        <p className="text-lg font-bold">
          אבחנת המערכת: לא נדרש לשלוח את הילד לאבחון
        </p>
      ) : (
        <p className="text-lg font-bold">
          אבחנת המערכת: מומלץ לשלוח את הילד לאבחון
        </p>
      )}
    </div>
  );
};

export default DiagnosisBox;
