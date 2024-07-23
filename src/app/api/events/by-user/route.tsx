import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = parseInt(searchParams.get("userId") || "", 10);
  
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }
  
    try {
      const events = await prisma.event.findMany({
        where: {
          organizerId: userId,
        },
      });
  
      const orders = await prisma.order.findMany({
        where: {
          buyerId: userId,
        },
      });
  
      return NextResponse.json(
        { events, orders },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching events and orders:", error);
      return NextResponse.json(
        { error: "Failed to fetch events and orders" },
        { status: 500 }
      );
    }
  }