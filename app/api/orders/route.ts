import { prisma } from "@/lib/prisma";

/**
 * CREATE NEW ORDER
 * Validates request body and creates order with items
 */
export async function POST(req: Request) {
  // Parse request body
  const body = await req.json();

  /**
   * Validate that items array exists and is not empty
   */
  if (!body.items || body.items.length === 0) {
    return Response.json(
      { error: "ERROR_EMPTY_LIST" },
      { status: 400 }
    );
  }

  /**
   * Check for duplicate equipment IDs in items list
   */
  const ids = body.items.map((i: any) => i.equipmentId);
  const hasDuplicates = new Set(ids).size !== ids.length;

  if (hasDuplicates) {
    return Response.json(
      { error: "ERROR_SAME_ITEM" },
      { status: 400 }
    );
  }

  /**
   * Validate quantity range per item (1–20)
   */
  for (const item of body.items) {
    const qty = Number(item.quantity);

    if (qty < 1 || qty > 20) {
      return Response.json(
        { error: "ERROR_ITEM_QUANTITY" },
        { status: 400 }
      );
    }
  }

  /**
   * Validate total quantity limit (max 20 items)
   */
  const totalQty = body.items.reduce(
    (sum: number, item: any) => sum + Number(item.quantity),
    0
  );

  if (totalQty > 20) {
    return Response.json(
      { error: "ERROR_LIST_QUANTITY" },
      { status: 400 }
    );
  }

  /**
   * Calculate total order value
   */
  const totalValue = body.items.reduce(
    (sum: number, item: any) =>
      sum + Number(item.quantity) * Number(item.price),
    0
  );

  /**
   * Business rule:
   * Non-HIGH priority orders cannot exceed 5000 PLN
   */
  if (body.priority !== "HIGH" && totalValue > 5000) {
    return Response.json(
      {
        error: "ERROR_ORDER_AMOUNT",
      },
      { status: 400 }
    );
  }

  /**
   * Create order in database with nested items
   */
  const order = await prisma.order.create({
    data: {
      employeeName: body.employeeName,
      department: body.department,
      justification: body.justification,
      priority: body.priority,
      status: "DRAFT",
      items: {
        create: body.items.map((item: any) => ({
          equipmentId: item.equipmentId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.price),
        })),
      },
    },
  });

  return Response.json(order);
}

/**
 * GET ALL ORDERS
 * Returns list of orders with computed statistics
 */
export async function GET() {
  // Fetch orders with related items
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  /**
   * Enrich orders with computed fields:
   * - total price
   * - number of items
   */
  const enriched = orders.map((order) => {
    const total = order.items.reduce(
      (sum, item) =>
        sum + item.quantity * item.unitPrice,
      0
    );

    return {
      ...order,
      total,
      itemsCount: order.items.length,
    };
  });

  return Response.json(enriched);
}