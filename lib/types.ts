import type { LucideIcon } from 'lucide-react';

export type Category = {
  id: 'academic' | 'social' | 'sports' | 'workshop' | 'music' | 'art';
  name: string;
  icon: LucideIcon;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: Category['id'];
  image: string;
};

export type Attendee = {
  id: string;
  name: string;
  email: string;
  eventId: string;
};
