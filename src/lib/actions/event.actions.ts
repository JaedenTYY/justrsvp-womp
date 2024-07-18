// src/lib/actions/event.actions.ts

import prisma from '../prisma';  // Adjust the path to your prisma client as needed
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache';
import { handleError } from '../utils';
import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from '../../../types/interface';

// CREATE EVENT
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    const newEvent = await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        location: event.location,
        imageUrl: event.imageUrl,
        startDate: event.startDateTime,
        endDate: event.endDateTime,
        price: event.price,
        isFree: event.isFree,
        url: event.url,
        categoryId: parseInt(event.categoryId, 10),
        organizerId: parseInt(userId, 10),
      },
    });
    revalidatePath(path);
    return newEvent;
  } catch (error) {
    handleError(error);
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId, 10) },
      include: {
        organizer: { select: { id: true, firstName: true, lastName: true } },
        category: { select: { id: true, name: true } },
      },
    });

    if (!event) throw new Error('Event not found');

    return event;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE EVENT
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(event.id, 10) },
      data: {
        title: event.title,
        description: event.description,
        location: event.location,
        imageUrl: event.imageUrl,
        startDate: event.startDateTime,
        endDate: event.endDateTime,
        price: event.price,
        isFree: event.isFree,
        url: event.url,
        categoryId: parseInt(event.categoryId, 10),
        organizerId: parseInt(userId, 10),
      },
    });
    revalidatePath(path);
    return updatedEvent;
  } catch (error) {
    handleError(error);
  }
}

// DELETE EVENT
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await prisma.event.delete({
      where: { id: eventId },
    });
    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
  try {
    const skipAmount = (Number(page) - 1) * limit;

    // Construct the where clause
    let whereClause: Prisma.EventWhereInput = {};
    
    if (query) {
      whereClause.title = { contains: query, mode: 'insensitive' };
    }
    
    if (category) {
      whereClause.category = { name: { equals: category, mode: 'insensitive' } };
    }

    // Fetch events
    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        organizer: { select: { id: true, firstName: true, lastName: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' } as Prisma.EventOrderByWithRelationInput,
      skip: skipAmount,
      take: limit,
    });

    // Count total events
    const eventsCount = await prisma.event.count({ where: whereClause });

    return {
      data: events,
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    const skipAmount = (page - 1) * limit;

    const events = await prisma.event.findMany({
      where: { organizerId: parseInt(userId, 10) },
      include: {
        organizer: { select: { id: true, firstName: true, lastName: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' } as Prisma.EventOrderByWithRelationInput,
      skip: skipAmount,
      take: limit,
    });

    const eventsCount = await prisma.event.count({
      where: { organizerId: parseInt(userId, 10) },
    });

    return { data: events, totalPages: Math.ceil(eventsCount / limit) };
  } catch (error) {
    handleError(error);
  }
}

// GET RELATED EVENTS BY CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    const skipAmount = (Number(page) - 1) * limit;

    const events = await prisma.event.findMany({
      where: {
        categoryId: parseInt(categoryId, 10),
        id: { not: parseInt(eventId, 10) },
      },
      include: {
        organizer: { select: { id: true, firstName: true, lastName: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' } as Prisma.EventOrderByWithRelationInput,
      skip: skipAmount,
      take: limit,
    });

    const eventsCount = await prisma.event.count({
      where: {
        categoryId: parseInt(categoryId, 10),
        id: { not: parseInt(eventId, 10) },
      },
    });

    return { data: events, totalPages: Math.ceil(eventsCount / limit) };
  } catch (error) {
    handleError(error);
  }
}

