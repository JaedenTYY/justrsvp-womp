import Collection from '@/components/shared/Collection';
import { Button } from '@/components/ui/button';
import { getEventsByUser } from '@/lib/actions/event.actions';
import { getOrdersByUser } from '@/lib/actions/order.actions';
import Link from 'next/link';
import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { SearchParamProps } from '../../../../types/interface';

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.sub as string;

  if (!userId) {
    return (
      <div className="wrapper">
        <h3 className="h3-bold text-center">Error loading profile</h3>
        <p className="text-center">User is not authenticated.</p>
      </div>
    );
  }

  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1;

  try {
    const orders = await getOrdersByUser({ userId, page: ordersPage });
    console.log('Orders:', orders);  // Add logging to check the orders response

    const orderedEvents = orders?.data.map((order) => order.event) || [];
    const organizedEvents = await getEventsByUser({ userId, page: eventsPage });
    console.log('Organized Events:', organizedEvents);  // Add logging to check the organized events response

    return (
      <>
        {/* My Tickets */}
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
          <div className="wrapper flex items-center justify-center sm:justify-between">
            <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
            <Button asChild size="lg" className="button hidden sm:flex">
              <Link href="/#events">Explore More Events</Link>
            </Button>
          </div>
        </section>

        <section className="wrapper my-8">
          <Collection
            data={orderedEvents}
            emptyTitle="No event tickets purchased yet"
            emptyStateSubtext="No worries - plenty of exciting events to explore!"
            collectionType="My_Tickets"
            limit={3}
            page={ordersPage}
            urlParamName="ordersPage"
            totalPages={orders?.totalPages}
          />
        </section>

        {/* Events Organized */}
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
          <div className="wrapper flex items-center justify-center sm:justify-between">
            <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
            <Button asChild size="lg" className="button hidden sm:flex">
              <Link href="/events/create">Create New Event</Link>
            </Button>
          </div>
        </section>

        <section className="wrapper my-8">
          <Collection
            data={organizedEvents?.data || []}
            emptyTitle="No events have been created yet"
            emptyStateSubtext="Go create some now"
            collectionType="Events_Organized"
            limit={3}
            page={eventsPage}
            urlParamName="eventsPage"
            totalPages={organizedEvents?.totalPages}
          />
        </section>
      </>
    );
  } catch (error) {
    console.error('Error loading profile:', error);
    return (
      <div className="wrapper">
        <h3 className="h3-bold text-center">Error loading profile</h3>
        <p className="text-center">An unexpected error occurred.</p>
      </div>
    );
  }
};

export default ProfilePage;
