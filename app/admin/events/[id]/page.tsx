import { AttendeeList } from "@/components/admin/attendee-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ATTENDEES, CATEGORIES, EVENTS } from "@/lib/data";
import { Calendar, Clock, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default function AdminEventDetailsPage({ params }: { params: { id: string } }) {
  const event = EVENTS.find(e => e.id === params.id);
  
  if (!event) {
    notFound();
  }

  const category = CATEGORIES.find(c => c.id === event.category);
  const attendeesForEvent = ATTENDEES.filter(a => a.eventId === event.id);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Badge variant="secondary">{category?.name}</Badge>
          <h2 className="text-3xl font-bold tracking-tight font-headline mt-2">{event.name}</h2>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Date</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-lg font-bold">{format(new Date(event.date), "PPP")}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-lg font-bold">{event.time}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Location</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-lg font-bold">{event.location}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendees</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-lg font-bold">{attendeesForEvent.length} Registered</div>
            </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <AttendeeList attendees={attendeesForEvent} eventId={event.id} />
      </div>

    </div>
  );
}
