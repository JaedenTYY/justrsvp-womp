import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
  
    if (!eventId) {
      return new NextResponse('Event ID not provided', { status: 400 });
    }
  
    try {
      const event = await prisma.event.findFirstOrThrow({
        where: { id: parseInt(eventId, 10) },
        include: {
          category: true,
          organizer: true,
        },
      });
  
      return new NextResponse(JSON.stringify(event), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      return new NextResponse('Event not found', { status: 404 });
    }
  }





