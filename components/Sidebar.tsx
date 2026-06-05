"use client";

import Link from "next/link";
import { useTranslation } from "@/app/context/LanguageContext";

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="w-64 bg-white border-r p-5 hidden md:block">
      <h2 className="text-xl font-bold mb-6">📦 {t.system}</h2>

      <nav className="space-y-2">
        <Link className="block p-2 rounded hover:bg-gray-100" href="/orders">
          {t.orders}
        </Link>

        <Link className="block p-2 rounded hover:bg-gray-100" href="/admin">
          {t.admin}
        </Link>
      </nav>
    </aside>
  );
}