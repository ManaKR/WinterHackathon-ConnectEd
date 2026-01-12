import Logo from "@/components/campus-connect/logo";
import { Separator } from "@/components/ui/separator";
import { ATTENDEES, EVENTS } from "@/lib/data";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default function CertificatePage({ params }: { params: { slug: string[] } }) {
  const [eventId, attendeeId] = params.slug;
  const event = EVENTS.find(e => e.id === eventId);
  const attendee = ATTENDEES.find(a => a.id === attendeeId);

  if (!event || !attendee) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-card text-card-foreground border-4 border-primary p-8 rounded-lg shadow-2xl aspect-[1.414/1] flex flex-col items-center justify-center">
        <div className="text-center w-full">
          <div className="flex items-center justify-center">
            <Logo />
          </div>

          <p className="text-2xl font-headline mt-8">
            Certificate of Participation
          </p>

          <Separator className="my-6 bg-primary h-0.5" />

          <p className="text-lg text-muted-foreground">This certificate is proudly presented to</p>

          <h2 className="text-5xl font-bold font-headline text-primary my-6">
            {attendee.name}
          </h2>

          <p className="text-lg text-muted-foreground">
            for their active participation in the event
          </p>

          <h3 className="text-3xl font-bold font-headline my-4">
            "{event.name}"
          </h3>

          <p className="text-lg text-muted-foreground">
            held on {format(new Date(event.date), 'MMMM do, yyyy')}.
          </p>

          <div className="flex justify-between mt-20 w-full max-w-lg mx-auto">
            <div className="text-center">
              <p className="font-bold font-headline text-lg">Event Coordinator</p>
              <Separator className="my-2 bg-muted-foreground" />
              <p className="text-sm text-muted-foreground">Signature</p>
            </div>
            <div className="text-center">
              <p className="font-bold font-headline text-lg">Dean of Students</p>
              <Separator className="my-2 bg-muted-foreground" />
              <p className="text-sm text-muted-foreground">Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
