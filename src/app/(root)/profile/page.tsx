'use client'

import React, { useEffect, useState } from 'react';
import Collection from '@/components/shared/Collection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { SearchParamProps } from '../../../../types/interface';

const ProfilePage = ({ searchParams }: SearchParamProps) => {
  const { userId: clerkId } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1;

  useEffect(() => {
    const fetchUserId = async (clerkId: string) => {
      try {
        const response = await fetch(`/api/information?clerkId=${clerkId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch user info", errorText);
        } else {
          const userData = await response.json();
          console.log("User info fetched successfully", userData);
          setUserId(userData.id);
        }
      } catch (error) {
        console.error("An error occurred while fetching user info", error);
      }
    };

    if (clerkId) {
      fetchUserId(clerkId);
    }
  }, [clerkId]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (userId === null) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/events/by-user?userId=${userId}`);
        const data = await response.json();

        if (response.ok) {
          setEvents(data.events);
          setOrders(data.orders);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, ordersPage, eventsPage]);

  if (loading) {
    return <div className="wrapper">Loading...</div>;
  }

  if (error) {
    return (
      <div className="wrapper">
        <h3 className="h3-bold text-center">Error loading profile</h3>
        <p className="text-center">{error}</p>
      </div>
    );
  }

  const orderedEvents = orders.map((order: any) => order.event);

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
          totalPages={Math.ceil(orders.length / 3)}
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
          data={events}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Events_Organized"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={Math.ceil(events.length / 3)}
        />
      </section>
    </>
  );
};

export default ProfilePage;
