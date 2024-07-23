import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: any) {
    const url = new URL(request.url);
    const clerkId = url.searchParams.get("clerkId");
  
    if (!clerkId) {
      return NextResponse.json({ error: "Clerk ID is required" }, { status: 400 });
    }
  
    try {
      // Get the Database ID by Clerk ID
      const user = await prisma.user.findUnique({
        where: { clerkId: clerkId },
      });
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      console.error("Failed to fetch user", error);
      return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
  }