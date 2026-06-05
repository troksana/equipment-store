"use client";

import { useTranslation } from "@/app/context/LanguageContext";

export default function LanguageSwitcher() {
  const { changeLanguage } = useTranslation();

  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => changeLanguage("pl")}>Polski</button>

      <button
        onClick={() => changeLanguage("en")}
        style={{ marginLeft: 10 }}
      >
        English
      </button>
    </div>
  );
}