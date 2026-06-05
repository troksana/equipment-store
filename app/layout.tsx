import type { Metadata } from "next";
import "./globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { LanguageProvider } from "@/app/context/LanguageContext";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Orders System",
  description: "Internal Orders App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">

        <LanguageProvider>
          <div className="flex min-h-screen">

            <Sidebar />

            <main className="flex-1 p-6">
              <LanguageSwitcher />
              {children}
            </main>

          </div>
        </LanguageProvider>

      </body>
    </html>
  );
}