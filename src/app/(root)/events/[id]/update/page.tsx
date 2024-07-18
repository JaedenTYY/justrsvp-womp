import EventForm from "@/components/shared/EventForm"
import { getEventById } from "@/lib/actions/event.actions"
import { auth } from "@clerk/nextjs/server";

type UpdateEventProps = {
  params: {
    id: string
  }
}

const UpdateEvent = async ({ params: { id } }: UpdateEventProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.sub as string;
  const event = await getEventById(id);

  if (!event) {
    return (
      <div>
        <h2>Event not found</h2>
      </div>
    );
  }

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Update Event</h3>
      </section>

      <div className="wrapper my-8">
        <EventForm 
          type="Update" 
          event={{
            ...event,
            startDateTime: new Date(event.startDate),  // Convert to Date objects if necessary
            endDateTime: new Date(event.endDate),
          }} 
          eventId={event.id} 
          userId={userId} 
        />
      </div>
    </>
  )
}

export default UpdateEvent
