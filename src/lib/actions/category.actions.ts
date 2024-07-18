import prisma from '../prisma';  // Adjust the path to your prisma client as needed
import { revalidatePath } from 'next/cache';
import { handleError } from '../utils';
import { ICategory } from '../../../types/interface';

export async function deleteEvent({ eventId, path }: { eventId: number; path: string }) {
  try {
    await prisma.event.delete({ where: { id: eventId } });
    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}


export const createCategory = async (categoryName: string): Promise<ICategory> => {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: categoryName }),
  });

  if (!response.ok) {
    throw new Error('Error creating category');
  }

  return await response.json();
};

export const getAllCategories = async (): Promise<ICategory[]> => {
  const response = await fetch('/api/categories', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Error fetching categories');
  }

  return await response.json();
};