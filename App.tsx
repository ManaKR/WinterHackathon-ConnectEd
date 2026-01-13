
import React, { useState, useEffect } from 'react';
import { AppUser, UserRole, CollegeEvent } from './types';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import { api } from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [events, setEvents] = useState<CollegeEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const fetchedEvents = await api.getEvents();
        setEvents(fetchedEvents);
      } catch (err) {
        console.error("Failed to fetch initial events:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (user && user.role === UserRole.STUDENT) {
      api.processReminders(user.id);
    }
  }, [user, events]);

  const handleLogin = async (email: string, pass: string, role: UserRole) => {
    try {
      const authenticatedUser = await api.authenticate(email, pass, role);
      setUser(authenticatedUser);
    } catch (err: any) {
      alert(err.message || "Login failed. Please check your credentials.");
    }
  };

  const handleLogout = () => setUser(null);

  const handleAddEvent = async (eventData: Omit<CollegeEvent, 'id' | 'registrations' | 'checkedIn' | 'reminders'>) => {
    const newEvent: CollegeEvent = {
      ...eventData,
      id: `evt_${Date.now()}`,
      registrations: [],
      checkedIn: [],
      reminders: []
    };
    try {
      const saved = await api.saveEvent(newEvent);
      setEvents(prev => [saved, ...prev]);
    } catch (err) {
      alert("Failed to save event.");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await api.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert("Delete action failed.");
    }
  };

  const handleDeleteEvents = async (ids: string[]) => {
    try {
      await api.deleteEvents(ids);
      setEvents(prev => prev.filter(e => !ids.includes(e.id)));
    } catch (err) {
      alert("Bulk delete failed.");
    }
  };

  const handleUpdateEvent = async (updatedEvent: CollegeEvent) => {
    try {
      await api.saveEvent(updatedEvent);
      setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    } catch (err) {
      alert("Failed to sync event changes.");
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm("Restore the original campus defaults?")) return;
    try {
      const restored = await api.resetDatabase();
      setEvents(restored);
    } catch (err) {
      alert("Failed to reset database.");
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) return;
    try {
      const updatedEvent = await api.register(eventId, user.id);
      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
    } catch (err) {
      alert("Registration system currently busy.");
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!user) return;
    try {
      const updatedEvent = await api.unregister(eventId, user.id);
      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
    } catch (err) {
      alert("Failed to unregister.");
    }
  };

  const handleVerifyAttendance = async (eventId: string, location?: { lat: number; lng: number }) => {
    if (!user) return;
    try {
      await api.checkIn(eventId, user.id, location);
      const updatedEvents = await api.getEvents();
      setEvents(updatedEvents);
    } catch (err: any) {
      throw err;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Updating Campus State...</h2>
      </div>
    </div>
  );

  return (
    <Layout user={user} onLogout={handleLogout}>
      {!user ? (
        <div className="flex items-center justify-center py-12">
          <LoginForm onLogin={handleLogin} />
        </div>
      ) : user.role === UserRole.ADMIN ? (
        <AdminDashboard 
          events={events} 
          onAddEvent={handleAddEvent} 
          onDeleteEvent={handleDeleteEvent}
          onDeleteEvents={handleDeleteEvents}
          onUpdateEvent={handleUpdateEvent}
          onResetDatabase={handleResetDatabase}
        />
      ) : (
        <StudentDashboard 
          user={user} 
          events={events} 
          onRegister={handleRegister}
          onUnregister={handleUnregister}
          onVerify={handleVerifyAttendance}
        />
      )}
    </Layout>
  );
};

export default App;
