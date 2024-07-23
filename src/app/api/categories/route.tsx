import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Handle GET requests
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// Handle POST requests
export async function POST(req: NextRequest) {
  const { name } = await req.json();
  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// Handle PUT requests
export async function PUT(req: NextRequest) {
  const { id, name } = await req.json();
  try {
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name,
      },
    });
    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// Handle DELETE requests
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    await prisma.category.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Category deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}