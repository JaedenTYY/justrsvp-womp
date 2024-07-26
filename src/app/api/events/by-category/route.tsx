import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
  
    if (!categoryId) {
      return new NextResponse('Category ID not provided', { status: 400 });
    }
  
    try {
      const events = await prisma.event.findMany({
        where: { categoryId: parseInt(categoryId, 10) },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          organizer: true,
        },
      });
  
      const totalEvents = await prisma.event.count({
        where: { categoryId: parseInt(categoryId, 10) },
      });
  
      const totalPages = Math.ceil(totalEvents / limit);
  
      return new NextResponse(JSON.stringify({ data: events, totalPages }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching events by category:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }