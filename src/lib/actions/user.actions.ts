import { PrismaClient } from '@prisma/client';
import { handleError } from '../utils';
import { auth } from '@clerk/nextjs/server';
import { CreateUserParams, UpdateUserParams } from '../../../types/interface';


const prisma = new PrismaClient();

export async function createUser(user: CreateUserParams) {
  try {
    const newUser = await prisma.user.create({
      data: {
        clerkId: user.clerkId,
        email: user.email,
        username: user.username,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        photo: user.photo ?? undefined,
      },
    });
    return newUser;
  } catch (error) {
    handleError(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId: clerkId },
      data: {
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        username: user.username,
        photo: user.photo ?? undefined,
      },
    });

    if (!updatedUser) throw new Error('User update failed');
    return updatedUser;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { clerkId: clerkId },
    });

    return deletedUser;
  } catch (error) {
    handleError(error);
  }
}
