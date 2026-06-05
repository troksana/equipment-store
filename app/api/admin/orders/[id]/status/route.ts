import { prisma } from "@/lib/prisma";

// PATCH handler for updating order status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Extract order ID from route params
  const { id } = await params;

  // Parse request body to get new status
  const { status } = await req.json();

  // Validate if provided status is allowed
  if (!["DRAFT", "APPROVED", "CANCELLED"].includes(status)) {
    return Response.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  // Check if order exists in database
  const order = await prisma.order.findUnique({
    where: { id },
  });

  // If order is not found, return 404 response
  if (!order) {
    return Response.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  // Update order status in database
  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  });

  // Return updated order as JSON response
  return Response.json(updated);
}