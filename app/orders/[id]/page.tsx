import { prisma } from "@/lib/prisma";
import OrderClient from "./OrderClient";

/**
 * Server Component - Order details page
 * Fetches order data from database and passes it to client component
 */
export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Extract order ID from route params
  const { id } = await params;

  /**
   * Fetch order with related items and equipment data
   */
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          equipment: true,
        },
      },
    },
  });

  // Handle case where order does not exist
  if (!order) {
    return <div>Nie znaleziono zamówienia</div>;
  }

  // Render client component with hydrated data
  return <OrderClient order={order} />;
}