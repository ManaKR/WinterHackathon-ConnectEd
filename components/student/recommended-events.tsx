import { recommendEvents, RecommendEventsInput, RecommendEventsOutput } from '@/ai/flows/ai-event-recommendations';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EVENTS } from '@/lib/data';
import EventCard from './event-card';

async function getRecommendations(): Promise<RecommendEventsOutput | null> {
    const studentProfile = {
        interests: ['AI', 'React', 'Web Development'],
        pastActivity: ['Attended "Intro to Python" workshop'],
    };

    const upcomingEventsForAI = EVENTS.map(e => ({
        name: e.name,
        description: e.description,
        category: e.category,
        dateTime: new Date(e.date).toISOString(),
        location: e.location,
    }));
    
    const input: RecommendEventsInput = {
        studentProfile,
        upcomingEvents: upcomingEventsForAI,
    };

    try {
        const recommendations = await recommendEvents(input);
        return recommendations;
    } catch (error) {
        console.error("Error fetching AI recommendations:", error);
        return null;
    }
}

export default async function RecommendedEvents() {
    const recommendations = await getRecommendations();
    
    if (!recommendations || recommendations.recommendedEvents.length === 0) {
        return null;
    }

    const recommendedEventDetails = recommendations.recommendedEvents.map(recEvent => {
        return EVENTS.find(event => event.name === recEvent.name);
    }).filter(Boolean) as (typeof EVENTS[0])[];
    
    if (recommendedEventDetails.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight font-headline">Recommended For You</h3>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {recommendedEventDetails.map((event) => (
                        <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1 h-full">
                                <EventCard event={event} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}
