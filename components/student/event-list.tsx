import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES, EVENTS } from "@/lib/data";
import EventCard from "./event-card";

export default function EventList() {
    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight font-headline">All Events</h3>
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    {CATEGORIES.map((category) => (
                        <TabsTrigger key={category.id} value={category.id}>
                            {category.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="all">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {EVENTS.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </TabsContent>

                {CATEGORIES.map((category) => (
                    <TabsContent key={category.id} value={category.id}>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {EVENTS.filter(e => e.category === category.id).map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
