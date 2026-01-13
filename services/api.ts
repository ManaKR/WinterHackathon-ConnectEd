
import { CollegeEvent, Certificate, AppUser, Notification, UserRole } from '../types';
import { INITIAL_EVENTS } from '../constants';

const STORAGE_KEYS = {
  EVENTS: 'campusconnect_events_v1',
  NOTIFICATIONS: 'campusconnect_notifications_v1',
  CERTIFICATES: 'campusconnect_certificates_v1'
};

const SEED_USERS: AppUser[] = [
  { id: 'admin_1', email: 'admin@college.edu', password: 'password', name: 'Professor Oak', role: UserRole.ADMIN },
  { id: 'u1', email: 'student@college.edu', password: 'password', name: 'Ash Ketchum', role: UserRole.STUDENT }
];

// Helper to simulate latency for a "real" feel
const delay = (ms: number = 200) => new Promise(res => setTimeout(res, ms));

// Deep clone helper to prevent accidental mutation of constants
const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

const getLocal = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const setLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
  async authenticate(email: string, pass: string, role: UserRole): Promise<AppUser> {
    await delay(500);
    const localUser = SEED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (!localUser || localUser.password !== pass) throw new Error("Invalid credentials.");
    return localUser;
  },

  async getEvents(): Promise<CollegeEvent[]> {
    await delay();
    let events = getLocal<CollegeEvent[]>(STORAGE_KEYS.EVENTS, []);
    
    if (events.length === 0) {
      // Create a fresh copy of initial events to avoid mutating the constant source
      events = deepClone(INITIAL_EVENTS);
      setLocal(STORAGE_KEYS.EVENTS, events);
    }
    
    // Create a copy before sorting to avoid in-place mutation of the return value
    return [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async saveEvent(event: CollegeEvent): Promise<CollegeEvent> {
    await delay();
    const events = getLocal<CollegeEvent[]>(STORAGE_KEYS.EVENTS, []);
    const index = events.findIndex(e => e.id === event.id);
    
    if (index > -1) {
      events[index] = event;
    } else {
      events.push(event);
    }
    
    setLocal(STORAGE_KEYS.EVENTS, events);
    return event;
  },

  async deleteEvent(id: string): Promise<void> {
    await delay();
    const events = getLocal<CollegeEvent[]>(STORAGE_KEYS.EVENTS, []);
    const filtered = events.filter(e => e.id !== id);
    setLocal(STORAGE_KEYS.EVENTS, filtered);
  },

  async deleteEvents(ids: string[]): Promise<void> {
    await delay();
    const events = getLocal<CollegeEvent[]>(STORAGE_KEYS.EVENTS, []);
    const filtered = events.filter(e => !ids.includes(e.id));
    setLocal(STORAGE_KEYS.EVENTS, filtered);
  },

  async resetDatabase(): Promise<CollegeEvent[]> {
    await delay(1000);
    const freshEvents = deepClone(INITIAL_EVENTS);
    setLocal(STORAGE_KEYS.EVENTS, freshEvents);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, []);
    setLocal(STORAGE_KEYS.CERTIFICATES, []);
    return freshEvents;
  },

  async toggleReminder(eventId: string, userId: string): Promise<CollegeEvent> {
    const events = getLocal<CollegeEvent[]>(STORAGE_KEYS.EVENTS, []);
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found");
    
    event.reminders = event.reminders || [];
    const index = event.reminders.indexOf(userId);
    if (index > -1) {
      event.reminders.splice(index, 1);
    } else {
      event.reminders.push(userId);
    }

    setLocal(STORAGE_KEYS.EVENTS, events);
    return event;
  },

  async processReminders(userId: string): Promise<void> {
    const events = await this.getEvents();
    const now = new Date();
    const notifications = getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);

    for (const event of events) {
      if (event.reminders?.includes(userId)) {
        const eventDate = new Date(event.date);
        const timeDiff = eventDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);

        if (hoursDiff > 0 && hoursDiff <= 24) {
          const alreadyNotified = notifications.some(n => 
            n.userId === userId && 
            n.title === 'Upcoming Event Reminder' && 
            n.message.includes(event.title)
          );

          if (!alreadyNotified) {
            const id = `rem_${event.id}_${Date.now()}`;
            notifications.unshift({
              id,
              userId,
              title: 'Upcoming Event Reminder',
              message: `Reminder: "${event.title}" starts in less than 24 hours at ${event.location}.`,
              timestamp: new Date().toISOString(),
              read: false,
              type: 'warning'
            });
          }
        }
      }
    }
    setLocal(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  async register(eventId: string, userId: string): Promise<CollegeEvent> {
    const events = getLocal<CollegeEvent[]>(STORAGE_KEYS.EVENTS, []);
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found");
    
    if (event.registrations.length >= event.capacity) throw new Error("Event is full");
    
    if (!event.registrations.includes(userId)) {
      event.registrations.push(userId);
      setLocal(STORAGE_KEYS.EVENTS, events);
      
      const notifications = getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
      notifications.unshift({
        id: `reg_${Date.now()}`,
        userId,
        title: 'Registration Success',
        message: `You are booked for ${event.title}!`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'success'
      });
      setLocal(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
    return event;
  },

  async unregister(eventId: string, userId: string): Promise<CollegeEvent> {
    const events = getLocal<CollegeEvent[]>(STORAGE_KEYS.EVENTS, []);
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found");

    event.registrations = (event.registrations || []).filter(id => id !== userId);
    event.checkedIn = (event.checkedIn || []).filter(id => id !== userId);
    event.reminders = (event.reminders || []).filter(id => id !== userId);

    setLocal(STORAGE_KEYS.EVENTS, events);
    return event;
  },

  async clearUserRegistrations(userId: string): Promise<void> {
    await delay(800);
    const events = getLocal<CollegeEvent[]>(STORAGE_KEYS.EVENTS, deepClone(INITIAL_EVENTS));
    
    events.forEach(event => {
      event.registrations = (event.registrations || []).filter(id => id !== userId);
      event.checkedIn = (event.checkedIn || []).filter(id => id !== userId);
      event.reminders = (event.reminders || []).filter(id => id !== userId);
    });
    
    setLocal(STORAGE_KEYS.EVENTS, events);

    // Clear certificates for this user
    const certs = getLocal<Certificate[]>(STORAGE_KEYS.CERTIFICATES, []);
    setLocal(STORAGE_KEYS.CERTIFICATES, certs.filter(c => c.userId !== userId));

    // Clear notifications for this user
    const notifs = getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, notifs.filter(n => n.userId !== userId));
  },

  async toggleCheckIn(eventId: string, userId: string): Promise<CollegeEvent> {
    const events = getLocal<CollegeEvent[]>(STORAGE_KEYS.EVENTS, []);
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found");

    event.checkedIn = event.checkedIn || [];
    const isCheckedIn = event.checkedIn.includes(userId);

    if (isCheckedIn) {
      event.checkedIn = event.checkedIn.filter(id => id !== userId);
    } else {
      event.checkedIn.push(userId);
      await this.issueCertificate({
        id: `cert_${Date.now()}_${userId}`,
        userId,
        eventId,
        eventTitle: event.title,
        issuedAt: new Date().toISOString(),
        issuer: event.organizer
      });
    }
    
    setLocal(STORAGE_KEYS.EVENTS, events);
    return event;
  },

  async checkIn(eventId: string, userId: string, location?: { lat: number; lng: number }): Promise<void> {
    await this.toggleCheckIn(eventId, userId);
  },

  async getNotifications(userId: string): Promise<Notification[]> {
    const notifications = getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    return notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async markAsRead(id: string): Promise<void> {
    const notifications = getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      setLocal(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  },

  async getCertificates(userId: string): Promise<Certificate[]> {
    const certs = getLocal<Certificate[]>(STORAGE_KEYS.CERTIFICATES, []);
    return certs.filter(c => c.userId === userId);
  },

  async issueCertificate(cert: Certificate): Promise<void> {
    const certs = getLocal<Certificate[]>(STORAGE_KEYS.CERTIFICATES, []);
    const exists = certs.some(c => c.eventId === cert.eventId && c.userId === cert.userId);
    if (!exists) {
      certs.push(cert);
      setLocal(STORAGE_KEYS.CERTIFICATES, certs);
    }
  }
};
