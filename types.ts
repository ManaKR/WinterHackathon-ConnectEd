
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface AppUser {
  id: string;
  email: string;
  password?: string; // Simulated for security demo
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'success' | 'info' | 'warning';
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
}

export interface CollegeEvent {
  id: string;
  title: string;
  description: string;
  aiSummary?: string;
  date: string;
  location: string;
  coordinates?: { lat: number; lng: number }; // For Geo-fencing
  venueLinks?: any[]; 
  category: 'Workshop' | 'Seminar' | 'Cultural' | 'Sports' | 'Technical';
  organizer: string;
  capacity: number;
  imageUrl?: string;
  registrations: string[];
  checkedIn: string[];
  reminders: string[]; // Track student IDs who want 24h reminders
}

export interface Certificate {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  issuedAt: string;
  issuer: string;
}
