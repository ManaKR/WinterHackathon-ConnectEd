import { CampusMap } from "@/components/map/campus-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES, EVENTS } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Calendar, Clock, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";

export default function StudentEventDetailsPage({ params }: { params: { id: string } }) {
  const event = EVENTS.find(e => e.id === params.id);
  
  if (!event) {
    notFound();
  }

  const category = CATEGORIES.find(c => c.id === event.category);
  const placeholder = PlaceHolderImages.find(p => p.id === event.image);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="p-0">
              <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-t-lg">
                {placeholder && (
                  <Image
                    src={placeholder.imageUrl}
                    alt={event.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    data-ai-hint={placeholder.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  {category && <Badge variant="secondary">{category.name}</Badge>}
                  <h1 className="text-3xl md:text-4xl font-bold font-headline text-white mt-2">{event.name}</h1>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
                <CardTitle className="font-headline text-2xl mb-2">About this event</CardTitle>
                <p className="text-muted-foreground">{event.description}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Event Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CampusMap location={event.location} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <Calendar className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold">Date</h3>
                  <p className="text-muted-foreground">{format(new Date(event.date), "EEEE, MMMM do, yyyy")}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold">Time</h3>
                  <p className="text-muted-foreground">{event.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button size="lg" className="w-full">Register for this Event</Button>
        </div>
      </div>
    </div>
  );
}
