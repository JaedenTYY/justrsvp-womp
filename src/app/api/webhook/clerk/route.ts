import { PrismaClient } from '@prisma/client';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("Webhook received");  // Log the start of the request

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET not found');
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers', { svix_id, svix_timestamp, svix_signature });
    return new Response('Error occurred -- no svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  console.log('Payload received:', payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (!id) {
    console.error('Missing ID in event data');
    return new Response('Error occurred -- missing id', { status: 400 });
  }

  try {
    if (eventType === 'user.created') {
      const { email_addresses, image_url, first_name, last_name, username } = evt.data;

      const user = await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          username: username!,
          firstName: first_name ?? undefined,
          lastName: last_name ?? undefined,
          photo: image_url ?? undefined,
        },
      });

      if (user) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: user.id,
          },
        });
      }

      return NextResponse.json({ message: 'OK', user });
    }

    if (eventType === 'user.updated') {
      const { image_url, first_name, last_name, username } = evt.data;

      const user = await prisma.user.update({
        where: { clerkId: id },
        data: {
          firstName: first_name ?? undefined,
          lastName: last_name ?? undefined,
          username: username!,
          photo: image_url ?? undefined,
        },
      });

      return NextResponse.json({ message: 'OK', user });
    }

    if (eventType === 'user.deleted') {
      const user = await prisma.user.delete({
        where: { clerkId: id },
      });

      return NextResponse.json({ message: 'OK', user });
    }

  } catch (err) {
    console.error('Error handling event:', err);
    return new Response('Error occurred', { status: 500 });
  }

  return new Response('', { status: 200 });
}
