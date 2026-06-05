"use client";

// React hooks for state and lifecycle
import { useEffect, useState } from "react";

// Next.js navigation utilities
import { useRouter, useParams } from "next/navigation";

// Translation hook
import { useTranslation } from "@/app/context/LanguageContext";

// Allowed priority values (used in form dropdown)
export const PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

export default function EditOrderPage() {
  const router = useRouter();

  // Route params (order ID)
  const params = useParams();
  const id = params.id as string;

  // Global translations
  const { t, lang, changeLanguage } = useTranslation();

  // Available equipment list
  const [equipment, setEquipment] = useState<any[]>([]);

  // Selected order items
  const [items, setItems] = useState<any[]>([]);

  // Error message state
  const [error, setError] = useState("");

  // Loading state for submit button
  const [loading, setLoading] = useState(false);

  // Form state for order details
  const [form, setForm] = useState({
    employeeName: "",
    department: "",
    justification: "",
    priority: "LOW",
  });

  /**
   * Load order details and equipment list on mount
   */
  useEffect(() => {
    async function load() {
      // Fetch order details
      const orderRes = await fetch(`/api/orders/${id}`);
      const order = await orderRes.json();

      // Fill form with existing order data
      setForm({
        employeeName: order.employeeName,
        department: order.department,
        justification: order.justification,
        priority: order.priority,
      });

      // Map order items into local state structure
      setItems(
        order.items.map((item: any) => ({
          id: item.id,
          equipmentId: item.equipmentId,
          name: item.equipment?.name,
          price: item.unitPrice,
          quantity: item.quantity,
        }))
      );
    }

    // Load equipment catalog
    fetch("/api/equipment")
      .then((res) => res.json())
      .then(setEquipment);

    load();
  }, [id]);

  /**
   * Add equipment item to order
   */
  function addItem(eq: any) {
    setItems([
      ...items,
      { equipmentId: eq.id, name: eq.name, price: eq.price, quantity: 1 },
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
   * Remove item from order
   */
  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  /**
   * Submit updated order to API
   */
  async function handleSubmit(e: any) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, items }),
      });

      const data = await response.json();

      // Handle API error response
      if (!response.ok) {
        setError(t.errorList?.[data.error] ?? data.error);
        return;
      }

      // Redirect back to orders list on success
      router.push("/orders");
    } catch (err) {
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      {/* Page title */}
      <h1 className="text-xl font-bold mb-4">{t.editOrder}</h1>

      {/* Order form */}
      <form onSubmit={handleSubmit}>

        {/* Employee name */}
        <input
          className="w-full p-2 border rounded mb-3"
          value={form.employeeName}
          onChange={(e) =>
            setForm({ ...form, employeeName: e.target.value })
          }
        />

        {/* Department */}
        <input
          className="w-full p-2 border rounded mb-3"
          value={form.department}
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
        />

        {/* Justification */}
        <textarea
          className="w-full p-2 border rounded mb-3"
          value={form.justification}
          onChange={(e) =>
            setForm({ ...form, justification: e.target.value })
          }
        />

        {/* Priority selector */}
        <select
          className="w-full p-2 border rounded mb-3"
          value={form.priority}
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
        {loading ? (
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {t.saving}
          </button>
        ) : (
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {t.saveChanges}
          </button>
        )}
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

          <div className="w-32 text-right">
            {eq.price.toFixed(2)} PLN
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
          className="flex items-center justify-between border-b py-2 gap-4"
        >
          <div className="flex-1">{item.name}</div>

          {/* Quantity input */}
          <div className="flex items-center gap-2">
            <span>{t.quantity}</span>

            <input
              type="number"
              value={item.quantity}
              min={1}
              max={20}
              onChange={(e) => updateQty(i, Number(e.target.value))}
              className="w-20 p-2 border rounded"
            />
          </div>

          {/* Remove button */}
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