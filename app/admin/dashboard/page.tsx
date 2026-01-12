import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddEventForm } from "@/components/admin/add-event-form";
import { EventsTable } from "@/components/admin/events-table";
import { EVENTS } from "@/lib/data";


export default function AdminDashboard() {

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Add New Event</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new event. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <AddEventForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold tracking-tight font-headline">Manage Events</h3>
        <EventsTable events={EVENTS} />
      </div>
    </div>
  );
}
