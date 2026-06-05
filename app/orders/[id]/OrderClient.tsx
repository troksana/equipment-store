"use client";

// Translation hook (global i18n context)
import { useTranslation } from "@/app/context/LanguageContext";

/**
 * Client-side order details component.
 * Receives fully loaded order data as props.
 */
export default function OrderClient({ order }: any) {
  const { t, lang, changeLanguage } = useTranslation();

  // Handle case where order was not found or API returned error
  if (order.error) {
    return <div>{t.orderNotFound}</div>;
  }

  /**
   * Calculate total order value
   * (sum of quantity * unit price for each item)
   */
  const total = order.items.reduce(
    (sum: number, item: any) =>
      sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">

      {/* Order title */}
      <h1 className="text-xl font-bold mb-4">{t.order}</h1>

      {/* Order metadata */}
      <div>{t.employee}: {order.employeeName}</div>
      <div>{t.department}: {order.department}</div>
      <div>{t.justification}: {order.justification}</div>
      <div>
        {t.priority}:{" "}
        {t.priorityList?.[order.priority] ?? order.priority}
      </div>

      <br />

      {/* Order status badge */}
      <div>
        {t.status}:{" "}
        <span
          className={`inline-flex items-center h-6 px-2 rounded text-xs ${
            order.status === "APPROVED"
              ? "bg-green-100 text-green-700"
              : order.status === "CANCELLED"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {t.statusList?.[order.status] ?? order.status}
        </span>
      </div>

      <br />

      {/* Items section header */}
      <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
        {t.items}
      </h2>

      {/* Order items list */}
      {order.items.map((item: any) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "1px solid #ddd",
          }}
        >
          {/* Equipment name */}
          <div style={{ flex: 2 }}>
            {item.equipment.name}
          </div>

          {/* Quantity */}
          <div style={{ flex: 1 }}>
            Ilość: {item.quantity}
          </div>

          {/* Unit price */}
          <div style={{ flex: 1 }}>
            Cena: {item.unitPrice.toFixed(2)} PLN
          </div>
        </div>
      ))}

      <br />

      {/* Total order value */}
      <h3 className="text-xl mb-4">
        {t.total}: {(total ?? 0).toFixed(2)} PLN
      </h3>
    </div>
  );
}