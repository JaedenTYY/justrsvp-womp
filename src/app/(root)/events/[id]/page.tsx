'use client'

import { useEffect, useState } from 'react';
import CheckoutButton from '@/components/shared/CheckoutButton';
import Collection from '@/components/shared/Collection';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Image from 'next/image';
import { IEvent, RelatedEventsResponse, SearchParamProps } from '../../../../../types/interface';

const EventDetails = ({ params: { id }, searchParams }: SearchParamProps) => {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<RelatedEventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      console.log(id)
      fetch(`/api/events/by-id?eventId=${id}`)
        .then(response => response.json())
        .then((data: IEvent) => {
          setEvent(data);
          return fetch(`/api/events/by-category?categoryId=${data.category.id}&page=${searchParams.page || '1'}`);
        })
        .then(response => response.json())
        .then((data: RelatedEventsResponse) => {
          setRelatedEvents(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching event data:', error);
          setError('Error fetching event data');
          setLoading(false);
        });
    }
  }, [id, searchParams]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !event) {
    return <div>Error fetching event: {error}</div>;
  }

  const formatDateTime = (dateTime: string | Date) => {
    const date = new Date(dateTime);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateOnly = date.toLocaleDateString(undefined, options);
    const timeOnly = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    return { dateOnly, timeOnly };
  };

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image 
            src={event.imageUrl || '/placeholder.jpg'}
            alt="hero image"
            width={1000}
            height={1000}
            className="h-full min-h-[300px] object-cover object-center"
          />

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className='h2-bold'>{event.title}</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {event.isFree ? 'FREE' : `$${event.price}`}
                  </p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {event.category.name}
                  </p>
                </div>

                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  by{' '}
                  <span className="text-primary-500">{event.organizer.firstName} {event.organizer.lastName}</span>
                </p>
              </div>
            </div>

            <CheckoutButton event={event} />

          <div className="flex flex-col gap-5">
            <div className='flex gap-2 md:gap-3'>
              <Image src="/assets/icons/calendar.svg" alt="calendar" width={32} height={32} />
                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                  <p>
                    {formatDateTime(event.startDate).dateOnly} - {formatDateTime(event.startDate).timeOnly}
                  </p>
                  <p>
                    {formatDateTime(event.endDate).dateOnly} - {formatDateTime(event.endDate).timeOnly}
                  </p>
                </div>
            </div>
              <div className="p-regular-20 flex items-center gap-3">
                <Image src="/assets/icons/location.svg" alt="location" width={32} height={32} />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">What You'll Learn:</p>
              <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
              {event.url && (
                <a href={event.url} target="_blank" rel="noopener noreferrer" className='p-medium-16 lg:p-regular-18 truncate text-primary-500 underline'>
                  {event.url}
                </a>
              )}            
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS with the same category */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Related Events</h2>

        <Collection 
          data={relatedEvents?.data || []} 
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={3}
          page={1}
          totalPages={relatedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default EventDetails;