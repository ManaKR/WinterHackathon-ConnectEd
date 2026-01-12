import EventList from "@/components/student/event-list";
import RecommendedEvents from "@/components/student/recommended-events";

export default function StudentDashboard() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome, Student!</h2>
        <p className="text-muted-foreground">
          Here's what's happening on campus.
        </p>
      </div>
      
      <RecommendedEvents />
      <EventList />

    </div>
  );
}
