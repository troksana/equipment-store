import { prisma } from "@/lib/prisma";

// GET handler for fetching all equipment items
export async function GET() {
  // Fetch all equipment records from the database
  const equipment = await prisma.equipment.findMany();

  // Return equipment list as JSON response
  return Response.json(equipment);
}