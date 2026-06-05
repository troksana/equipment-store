"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/app/context/LanguageContext";

export default function AdminPage() {
  // State for storing list of orders
  const [orders, setOrders] = useState<any[]>([]);

  // Translation hook (handles language switching and translations)
  const { t, lang, changeLanguage } = useTranslation();

  // Fetch all orders from API and update state
  async function load() {
    const res = await fetch("/api/orders");

    if (!res.ok) {
  console.error("API error", await res.text());
  return;
}

    const data = await res.json();
    setOrders(data);
  }

  // Load orders once when component mounts
  useEffect(() => {
    load();
  }, []);

  // Change order status (APPROVED, CANCELLED, DRAFT)
  // Sends PATCH request to API and refreshes order list
  async function changeStatus(id: string, status: string) {
    await fetch(`/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    // Reload updated orders after status change
    load();
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page title */}
      <h1 className="text-2xl font-bold mb-6">{t.adminPanel}</h1>

      <div className="space-y-4">
        {/* Render list of orders */}
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white p-4 rounded shadow flex justify-between"
            style={{
              border: "1px solid #ccc",
              marginBottom: 10,
              padding: 10,
            }}
          >
            {/* Order basic info: employee and department */}
            <div className="font-semibold">
              <b>{o.employeeName}</b> — {o.department}
            </div>

            {/* Status badge with dynamic color based on order status */}
            <span
              className={`inline-flex items-center h-6 px-2 rounded text-xs ${
                o.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : o.status === "CANCELLED"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {/* Localized status label */}
              {t.statusList?.[o.status] ?? o.status}
            </span>

            {/* Order total value */}
            <div>
              {t.value}: {Number(o.total ?? 0).toFixed(2)} PLN
            </div>

            {/* Action buttons for status changes */}
            <div style={{ marginTop: 10 }}>
              {/* Approve order button */}
              {o.status !== "APPROVED" && (
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => changeStatus(o.id, "APPROVED")}
                  style={{ cursor: "pointer" }}
                >
                  {t.approve}
                </button>
              )}

              {/* Cancel order button */}
              {o.status !== "CANCELLED" && (
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => changeStatus(o.id, "CANCELLED")}
                  style={{ marginLeft: 10, cursor: "pointer" }}
                >
                  {t.cancel}
                </button>
              )}

              {/* Reset order back to draft status */}
              {o.status !== "DRAFT" && (
                <button
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                  onClick={() => changeStatus(o.id, "DRAFT")}
                  style={{ marginLeft: 10, cursor: "pointer" }}
                >
                  {t.backToDraft}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}