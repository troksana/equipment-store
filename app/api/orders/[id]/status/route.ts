import { prisma } from "@/lib/prisma";

// PATCH handler for updating an order status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Extract order ID from route parameters
  const { id } = await params;

  // Parse request body to get new status value
  const { status } = await req.json();

  // Validate if provided status is allowed
  if (!["DRAFT", "APPROVED", "CANCELLED"].includes(status)) {
    return Response.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  // Fetch order from database
  const order = await prisma.order.findUnique({
    where: { id },
  });

  // Return 404 if order does not exist
  if (!order) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // Prevent editing orders that are not in DRAFT status
  if (order.status !== "DRAFT") {
    return Response.json(
      { error: "ERROR_EDIT_DRAFT_ONLY" },
      { status: 403 }
    );
  }

  // Update order status in database
  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  });

  // Return updated order
  return Response.json(updated);
}