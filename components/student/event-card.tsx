import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function EventCard({ event }: { event: Event }) {
    const placeholder = PlaceHolderImages.find(p => p.id === event.image);

    return (
        <Link href={`/student/events/${event.id}`} className="group block h-full">
            <Card className="h-full flex flex-col hover:border-primary/80 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="p-0">
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        {placeholder && (
                            <Image
                                src={placeholder.imageUrl}
                                alt={event.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                data-ai-hint={placeholder.imageHint}
                                className="transition-transform duration-300 group-hover:scale-105"
                            />
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-grow pt-4">
                    <CardTitle className="font-headline text-xl mb-2">{event.name}</CardTitle>
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(event.date), "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex items-center w-full justify-end text-sm font-medium text-primary group-hover:text-accent-foreground transition-colors">
                        View Details <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
