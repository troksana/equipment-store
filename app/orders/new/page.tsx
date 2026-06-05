"use client";

// React hooks for state and lifecycle management
import { useEffect, useState } from "react";

// Next.js router for navigation after form submit
import { useRouter } from "next/navigation";

// Translation hook (global i18n context)
import { useTranslation } from "@/app/context/LanguageContext";

// Available priority values for orders
export const PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

/**
 * New Order Page (client-side)
 * Handles creation of a new order with items and validation
 */
export default function NewOrderPage() {
  const router = useRouter();

  // Global translations
  const { t, lang, changeLanguage } = useTranslation();

  // Available equipment list
  const [equipment, setEquipment] = useState<any[]>([]);

  // Selected items for the order
  const [items, setItems] = useState<any[]>([]);

  // Form state for order details
  const [form, setForm] = useState({
    employeeName: "",
    department: "",
    justification: "",
    priority: "LOW",
  });

  // Error message state
  const [error, setError] = useState("");

  /**
   * Load equipment list on page mount
   */
  useEffect(() => {
    fetch("/api/equipment")
      .then((res) => res.json())
      .then(setEquipment);
  }, []);

  /**
   * Add equipment item to selected list
   */
  function addItem(eq: any) {
    setItems([
      ...items,
      {
        equipmentId: eq.id,
        name: eq.name,
        price: eq.price,
        quantity: 1,
      },
    ]);
  }

  /**
   * Update quantity of selected item
   */
  function updateQty(index: number, qty: number) {
    const copy = [...items];
    copy[index].quantity = qty;
    setItems(copy);
  }

  /**
   * Remove item from selected list
   */
  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  /**
   * Submit new order to API
   */
  async function handleSubmit(e: any) {
    e.preventDefault();

    setError("");

    // Send order data to backend API
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form, items }),
    });

    const data = await response.json();

    // Handle validation or API errors
    if (!response.ok) {
      setError(t.errorList?.[data.error] ?? data.error);
      return;
    }

    // Redirect to orders list after success
    router.push("/orders");
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">

      {/* Page title */}
      <h1 className="text-xl font-bold mb-4">{t.newOrder}</h1>

      {/* Order creation form */}
      <form onSubmit={handleSubmit}>

        {/* Employee name input */}
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder={t.employeeName}
          onChange={(e) =>
            setForm({ ...form, employeeName: e.target.value })
          }
        />

        {/* Department input */}
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder={t.department}
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
        />

        {/* Justification input */}
        <textarea
          className="w-full p-2 border rounded mb-3"
          placeholder={t.justification}
          onChange={(e) =>
            setForm({ ...form, justification: e.target.value })
          }
        />

        {/* Priority selector */}
        <select
          className="w-full p-2 border rounded mb-3"
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {t.priorityList?.[p] ?? p}
            </option>
          ))}
        </select>

        {/* Error message */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {t.save}
        </button>
      </form>

      <br />

      {/* Equipment section */}
      <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
        {t.items}
      </h2>

      {/* Equipment list */}
      {equipment.map((eq) => (
        <div
          key={eq.id}
          className="flex items-center justify-between border-b py-3 gap-4"
        >
          <div className="flex-1 font-medium">{eq.name}</div>

          <div className="w-32 text-right text-gray-600">
            {eq.price} PLN
          </div>

          <button
            onClick={() => addItem(eq)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t.add}
          </button>
        </div>
      ))}

      <br />

      {/* Selected items section */}
      <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
        {t.selected}
      </h2>

      {/* Selected items list */}
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b py-3 gap-4"
        >
          <div className="flex-1 font-medium">{item.name}</div>

          {/* Quantity input */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{t.quantity}</span>

            <input
              type="number"
              value={item.quantity}
              min={1}
              max={20}
              onChange={(e) => updateQty(i, Number(e.target.value))}
              className="w-20 p-2 border rounded"
            />
          </div>

          {/* Remove item button */}
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {t.remove}
          </button>
        </div>
      ))}
    </div>
  );
}