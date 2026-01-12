import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import type { Attendee } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AttendeeList({ attendees, eventId }: { attendees: Attendee[], eventId: string }) {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline">Registered Attendees</CardTitle>
            <CardDescription>
                View and manage attendees for this event.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {attendees.length > 0 ? attendees.map((attendee) => (
                        <TableRow key={attendee.id}>
                        <TableCell className="font-medium">{attendee.name}</TableCell>
                        <TableCell>{attendee.email}</TableCell>
                        <TableCell className="text-right">
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/certificate/${eventId}/${attendee.id}`}>
                                    <Award className="mr-2 h-4 w-4" />
                                    Generate Certificate
                                </Link>
                            </Button>
                        </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">No attendees registered yet.</TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
  );
}
