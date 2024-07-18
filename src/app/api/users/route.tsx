import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { UpdateUserParams } from "../../../../types/interface";
import { updateUser } from "@/lib/actions/user.actions";


export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Handle POST requests
export async function POST(req: NextRequest) {
  const { clerkId, email, username, firstName, lastName, photo } =
    await req.json();
  try {
    const newUser = await prisma.user.create({
      data: {
        clerkId,
        email,
        username,
        firstName,
        lastName,
        photo,
      },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// Handle PUT requests
export async function PUT(req: NextRequest) {
  const { clerkId, email, username, firstName, lastName, photo } = await req.json();
  try {
    const user: UpdateUserParams = { firstName, lastName, username, photo };
    const updatedUser = await updateUser(clerkId, user);
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }
  }
}

// Handle DELETE requests
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
