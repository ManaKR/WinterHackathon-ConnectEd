import type { Event, Category, Attendee } from '@/lib/types';
import { BookOpen, Code, Dumbbell, Mic, Palette, Users } from 'lucide-react';

export const CATEGORIES: Category[] = [
  { id: 'academic', name: 'Academic', icon: BookOpen },
  { id: 'social', name: 'Social', icon: Users },
  { id: 'sports', name: 'Sports', icon: Dumbbell },
  { id: 'workshop', name: 'Workshop', icon: Code },
  { id: 'music', name: 'Music', icon: Mic },
  { id: 'art', name: 'Art', icon: Palette },
];

export const EVENTS: Event[] = [
  {
    id: '1',
    name: 'AI in Modern Applications',
    description: 'A deep dive into the practical applications of Artificial Intelligence in today\'s technology landscape. Hosted by the Computer Science department.',
    date: '2024-10-26',
    time: '14:00',
    location: 'Science Building, Room 101',
    category: 'academic',
    image: 'event-academic'
  },
  {
    id: '2',
    name: 'Fall Fest 2024',
    description: 'Annual autumn festival with games, food trucks, and live music. A great way to meet new people and relax before midterms.',
    date: '2024-11-02',
    time: '12:00',
    location: 'Main Quad',
    category: 'social',
    image: 'event-social'
  },
  {
    id: '3',
    name: 'Intramural Basketball Championship',
    description: 'The final game of the intramural basketball season. Come cheer for your favorite team!',
    date: '2024-11-05',
    time: '19:00',
    location: 'University Gymnasium',
    category: 'sports',
    image: 'event-sports'
  },
  {
    id: '4',
    name: 'React for Beginners Workshop',
    description: 'Learn the fundamentals of React.js in this hands-on workshop. No prior experience needed. Laptops required.',
    date: '2024-11-09',
    time: '10:00',
    location: 'Library, Room 204',
    category: 'workshop',
    image: 'event-workshop'
  },
  {
    id: '5',
    name: 'Open Mic Night',
    description: 'Showcase your talents or enjoy performances from your peers. Sign-ups start at 6:30 PM.',
    date: '2024-11-12',
    time: '19:00',
    location: 'Student Union Cafe',
    category: 'music',
    image: 'event-music'
  },
  {
    id: '6',
    name: 'Student Art Exhibition Opening',
    description: 'Celebrate the opening of the semester\'s student art exhibition. Featuring works from various mediums.',
    date: '2024-11-15',
    time: '18:00',
    location: 'Fine Arts Gallery',
    category: 'art',
    image: 'event-art'
  }
];

export const ATTENDEES: Attendee[] = [
  { id: 'att-1', name: 'Alice Johnson', email: 'alice@example.com', eventId: '1' },
  { id: 'att-2', name: 'Bob Williams', email: 'bob@example.com', eventId: '1' },
  { id: 'att-3', name: 'Charlie Brown', email: 'charlie@example.com', eventId: '1' },
  { id: 'att-4', name: 'Diana Prince', email: 'diana@example.com', eventId: '4' },
  { id: 'att-5', name: 'Ethan Hunt', email: 'ethan@example.com', eventId: '4' },
];
