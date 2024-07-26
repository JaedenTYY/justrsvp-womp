"use client";

import { useEffect, useState } from "react";
import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { GetAllEventsParams, IEvent } from "../../../types/interface";

export default function Home() {
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params: GetAllEventsParams = {
          query: "",
          category: "",
          limit: 6,
          page: page,
        };

        const queryString = new URLSearchParams(params as any).toString();
        const response = await fetch(`/api/events?${queryString}`);
        const fetchedEvents = await response.json();

        console.log("Fetched events:", fetchedEvents);

        // Check if fetchedEvents has data property and it's an array
        const eventsData = Array.isArray(fetchedEvents.data) ? fetchedEvents.data : fetchedEvents;
        const totalPages = fetchedEvents.totalPages || 1;

        if (Array.isArray(eventsData)) {
          const transformedEvents: IEvent[] = eventsData.map((event: any) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            location: event.location,
            imageUrl: event.imageUrl,
            startDate: event.startDate || event.startDateTime,
            endDate: event.endDate || event.endDateTime,
            price: event.price,
            isFree: event.isFree,
            url: event.url,
            category: {
              id: event.categoryId,
              name: event.category?.name || "",
            },
            organizer: {
              id: event.organizerId,
              firstName: event.organizer?.firstName || "",
              lastName: event.organizer?.lastName || "",
            },
            organizerId: event.organizerId,
          }));

          setEvents(transformedEvents);
          setTotalPages(totalPages);
          console.log("Events fetched:", transformedEvents);
        } else {
          console.error("Fetched events data is not in the expected format", fetchedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [page]);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Host, Connect, Celebrate: Your Events, Our Platform!
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Book and upskill yourself with helpful tips from over 3000 mentors
              in world-class companies with our engaging community
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>

          <Image
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">
          Trusted by <br /> Thousands of Events
        </h2>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        <Collection 
          data={events}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={totalPages}
          urlParamName="events"
        />
      </section>
    </>
  );
}
