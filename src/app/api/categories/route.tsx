import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ICategory } from '../../../../types/interface';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Handle GET requests
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return { error: 'Failed to fetch categories' };
  }

}

// Handle POST requests
export async function POST(req: NextRequest) {
  const { name } = await req.json();
  try {
    const newCategory = await prisma.category.create({
      data: { name },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return { error: 'Failed to create category' };
  }

}

// Handle PUT requests
export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, name } = req.body;
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update category' });
  }
}

// Handle DELETE requests
export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;
    await prisma.category.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete category' });
  }
}

