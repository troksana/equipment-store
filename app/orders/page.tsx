"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/app/context/LanguageContext";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const { t, lang, changeLanguage } = useTranslation();

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  const ordersWithStats = orders.map((order) => {
    const itemsCount = order.items.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );

    const total = order.items.reduce(
      (sum: number, item: any) =>
        sum + item.quantity * item.unitPrice,
      0
    );

    return {
      ...order,
      itemsCount,
      total,
    };
  });

  return (
    <div className="max-w-5xl mx-auto">

  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">{t.orders}</h1>

    <Link
      href="/orders/new"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      + {t.newOrder}
    </Link>
  </div>

  <div className="space-y-4">
    {ordersWithStats.map((o) => (
      <div
        key={o.id}
        className="bg-white p-4 rounded-lg shadow-sm border flex justify-between"
      >

        <div>
          <div className="font-semibold text-lg">
            {o.employeeName}
          </div>

          <div className="text-sm text-gray-500">
            {o.department}
          </div>

          <div className="mt-2 text-sm">
            Produkty: {o.itemsCount}
          </div>

          <div className="text-sm font-medium">
            {Number(o.total).toFixed(2)} PLN
          </div>
        </div>

        <div className="flex flex-col gap-2 items-end">

          <span
            className={`text-xs px-2 py-1 rounded ${
              o.status === "APPROVED"
                ? "bg-green-100 text-green-700"
                : o.status === "CANCELLED"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {o.status}
          </span>

          <div className="flex gap-3 text-sm">
            <Link className="text-blue-600 hover:underline" href={`/orders/${o.id}`}>
              {t.details}
            </Link>

            {o.status === "DRAFT" && (
              <Link className="text-gray-600 hover:underline" href={`/orders/${o.id}/edit`}>
                {t.edit}
              </Link>
            )}
          </div>
        </div>

      </div>
    ))}
  </div>
</div>
  );
}