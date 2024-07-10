import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Handle GET requests
export async function GET() {
  try {
    const orders = await prisma.order.findMany();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// Handle POST requests
export async function POST(req: NextRequest) {
  const { stripeId, totalAmount, eventId, buyerId } = await req.json();
  try {
    const newOrder = await prisma.order.create({
      data: {
        stripeId,
        totalAmount,
        eventId,
        buyerId,
      },
    });
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// Handle PUT requests
export async function PUT(req: NextRequest) {
  const { id, stripeId, totalAmount, eventId, buyerId } = await req.json();
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        stripeId,
        totalAmount,
        eventId,
        buyerId,
      },
    });
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// Handle DELETE requests
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    await prisma.order.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Order deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
