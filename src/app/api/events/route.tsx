import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Handle GET requests
export async function GET() {
  try {
    const events = await prisma.event.findMany();
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// Handle POST requests
export async function POST(req: NextRequest) {
  const {
    title,
    description,
    location,
    imageUrl,
    startDate,
    endDate,
    price,
    isFree,
    url,
    categoryId,
    organizerId,
  } = await req.json();
  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        location,
        imageUrl,
        startDate,
        endDate,
        price,
        isFree,
        url,
        categoryId,
        organizerId,
      },
    });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

// Handle PUT requests
export async function PUT(req: NextRequest) {
  const {
    id,
    title,
    description,
    location,
    imageUrl,
    startDate,
    endDate,
    price,
    isFree,
    url,
    categoryId,
    organizerId,
  } = await req.json();
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        location,
        imageUrl,
        startDate,
        endDate,
        price,
        isFree,
        url,
        categoryId,
        organizerId,
      },
    });
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// Handle DELETE requests
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    await prisma.event.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Event deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
