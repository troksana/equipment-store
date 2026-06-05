import { prisma } from "@/lib/prisma";

// GET handler for fetching a single order by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Extract order ID from route parameters
  const { id } = await params;

  // Fetch order with related items and equipment details
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

  // Return 404 if order does not exist
  if (!order) {
    return Response.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  // Calculate total order value (quantity * unit price)
  const total = order.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  // Return order with computed total
  return Response.json({ ...order, total });
}


// PATCH handler for updating full order data (including items)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Extract order ID from route parameters
  const { id } = await params;

  // Parse request body (updated order data)
  const data = await req.json();

  // Check if order exists
  const existingOrder = await prisma.order.findUnique({
    where: { id },
  });

  // Return 404 if order not found
  if (!existingOrder) {
    return Response.json(
      { error: "ERROR_ORDER_NOT_FOUND" },
      { status: 404 }
    );
  }

  // Allow editing only DRAFT orders
  if (existingOrder.status !== "DRAFT") {
    return Response.json(
      { error: "ERROR_ORDER_NOT_EDIT" },
      { status: 400 }
    );
  }

  // Validate empty items list
  if (!data.items || data.items.length === 0) {
    return Response.json(
      { error: "ERROR_EMPTY_LIST" },
      { status: 400 }
    );
  }

  // Check for duplicate equipment items
  const ids = data.items.map((i: any) => i.equipmentId);
  const hasDuplicates = new Set(ids).size !== ids.length;

  if (hasDuplicates) {
    return Response.json(
      { error: "ERROR_SAME_ITEM" },
      { status: 400 }
    );
  }

  // Validate quantity constraints per item
  for (const item of data.items) {
    const qty = Number(item.quantity);

    if (qty < 1 || qty > 20) {
      return Response.json(
        { error: "ERROR_ITEM_QUANTITY" },
        { status: 400 }
      );
    }
  }

  // Calculate total quantity of all items
  const totalQty = data.items.reduce(
    (sum: number, item: any) => sum + Number(item.quantity),
    0
  );

  // Validate total quantity limit
  if (totalQty > 20) {
    return Response.json(
      { error: "ERROR_LIST_QUANTITY" },
      { status: 400 }
    );
  }

  // Calculate total order value
  const total = data.items.reduce(
    (sum: number, item: any) =>
      sum + item.quantity * (item.price ?? 0),
    0
  );

  // Business rule: high-value orders require HIGH priority
  if (existingOrder.priority !== "HIGH" && total > 5000) {
    return Response.json(
      { error: "ERROR_ORDER_AMOUNT" },
      { status: 400 }
    );
  }

  // Update order and replace all items
  const updated = await prisma.order.update({
    where: { id },
    data: {
      employeeName: data.employeeName,
      department: data.department,
      justification: data.justification,
      priority: data.priority,

      // Replace order items (delete old, create new)
      items: {
        deleteMany: {},
        create: await Promise.all(
          data.items.map(async (item: any) => {
            // Fetch equipment price for snapshot at order time
            const equipment = await prisma.equipment.findUnique({
              where: { id: item.equipmentId },
            });

            return {
              equipmentId: item.equipmentId,
              quantity: item.quantity,
              unitPrice: equipment?.price ?? 0,
            };
          })
        ),
      },
    },
    include: {
      items: true,
    },
  });

  // Return updated order
  return Response.json(updated);
}