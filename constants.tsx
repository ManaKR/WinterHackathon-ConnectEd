
import { CollegeEvent } from './types';

export const CAMPUS_VENUES = [
  { name: 'Melodium', url: 'https://maps.app.goo.gl/86dPd4cHdM59ijaH9' },
  { name: 'Basketball Court', url: 'https://maps.app.goo.gl/yKnBYdnHMVTd7VUN6' },
  { name: 'Canteen', url: 'https://maps.app.goo.gl/AKqmYziry2dJ3KeHA' },
  { name: 'Aero Club', url: 'https://maps.app.goo.gl/mw5YrRakUSNDGt529' },
  { name: 'Arena SJEC', url: 'https://maps.app.goo.gl/2kfAvdwgE5hut2Eo7' },
  { name: 'College Ground', url: 'https://maps.app.goo.gl/pqqqYPoMmEReivDx8' }
];

export const INITIAL_EVENTS: CollegeEvent[] = [
  {
    id: '1',
    title: 'Inter-College Basketball Championship',
    description: 'The annual slam dunk contest and championship match. Bring your team spirit!',
    date: '2024-12-10T09:00',
    location: 'Basketball Court',
    category: 'Sports',
    organizer: 'Physical Education Dept',
    capacity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
    registrations: ['u1'],
    checkedIn: [],
    // Added missing reminders property to satisfy CollegeEvent interface
    reminders: [],
    venueLinks: [{ maps: { title: 'Basketball Court', uri: 'https://maps.app.goo.gl/yKnBYdnHMVTd7VUN6' } }]
  },
  {
    id: '2',
    title: 'Aero-Modeling Workshop',
    description: 'Learn to build and fly your first drone with the Aero Club experts.',
    date: '2024-12-15T10:30',
    location: 'Aero Club',
    category: 'Technical',
    organizer: 'Aero Club SJEC',
    capacity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop',
    registrations: [],
    checkedIn: [],
    // Added missing reminders property to satisfy CollegeEvent interface
    reminders: [],
    venueLinks: [{ maps: { title: 'Aero Club', uri: 'https://maps.app.goo.gl/mw5YrRakUSNDGt529' } }]
  },
  {
    id: '3',
    title: 'Cultural Night 2024',
    description: 'A night of music, dance, and drama at the Melodium auditorium.',
    date: '2024-12-20T18:00',
    location: 'Melodium',
    category: 'Cultural',
    organizer: 'Cultural Committee',
    capacity: 300,
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop',
    registrations: [],
    checkedIn: [],
    // Added missing reminders property to satisfy CollegeEvent interface
    reminders: [],
    venueLinks: [{ maps: { title: 'Melodium', uri: 'https://maps.app.goo.gl/86dPd4cHdM59ijaH9' } }]
  }
];

export const APP_THEME = {
  primary: 'indigo-600',
  secondary: 'slate-100',
  accent: 'emerald-500'
};
