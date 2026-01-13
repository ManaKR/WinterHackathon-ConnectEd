
import React, { useState, useMemo } from 'react';
import { CollegeEvent } from '../types';
import { 
  generateEventDescription, 
  generateEventPoster, 
  generateEventSummary 
} from '../services/geminiService';
import { CAMPUS_VENUES } from '../constants';
import { api } from '../services/api';

interface AdminDashboardProps {
  events: CollegeEvent[];
  onAddEvent: (event: Omit<CollegeEvent, 'id' | 'registrations' | 'checkedIn' | 'reminders'>) => void;
  onDeleteEvent: (id: string) => void;
  onDeleteEvents: (ids: string[]) => void;
  onUpdateEvent?: (event: CollegeEvent) => void;
  onResetDatabase?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ events, onAddEvent, onDeleteEvent, onDeleteEvents, onUpdateEvent, onResetDatabase }) => {
  const [activeTab, setActiveTab] = useState<'management' | 'database'>('management');
  const [showForm, setShowForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedRegistry, setSelectedRegistry] = useState<CollegeEvent | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isUpdatingCheckIn, setIsUpdatingCheckIn] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Technical' as CollegeEvent['category'],
    organizer: '',
    capacity: 50,
    imageUrl: '',
    venueLinks: [] as any[],
    aiSummary: ''
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const stats = useMemo(() => {
    const totalRegs = events.reduce((acc, curr) => acc + (curr.registrations?.length || 0), 0);
    return { totalRegs };
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [events, searchQuery]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const loc = e.target.value;
    const venue = CAMPUS_VENUES.find(v => v.name === loc);
    const links = venue ? [{ maps: { title: venue.name, uri: venue.url } }] : [];
    setFormData(prev => ({ ...prev, location: loc, venueLinks: links }));
  };

  const handleMagicFill = async () => {
    if (!formData.title) return alert("Please enter an event title first!");
    setIsGenerating(true);
    try {
      const desc = await generateEventDescription(formData.title, formData.category);
      const poster = await generateEventPoster(formData.title, formData.category);
      const summary = await generateEventSummary(desc);
      setFormData(prev => ({ ...prev, description: desc, aiSummary: summary, imageUrl: poster }));
      showToast("AI Assets Fabricated!");
    } catch (err) {
      showToast("Gemini AI busy, try again.", 'error');
    } finally { setIsGenerating(false); }
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Permanently delete this event? This action cannot be undone.")) return;
    setIsDeleting(id);
    try {
      await onDeleteEvent(id);
      if (selectedRegistry?.id === id) setSelectedRegistry(null);
      showToast("Event purged from records.");
    } catch (err) {
      showToast("Deletion failed.", 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Purge ${selectedEvents.length} records?`)) return;
    try {
      await onDeleteEvents(selectedEvents);
      setSelectedEvents([]);
      showToast("Bulk records synchronized.");
    } catch (err) {
      showToast("Bulk operation failed.", "error");
    }
  };

  const handleManualCheckIn = async (studentId: string) => {
    if (!selectedRegistry || !onUpdateEvent) return;
    setIsUpdatingCheckIn(studentId);
    try {
      const updated = await api.toggleCheckIn(selectedRegistry.id, studentId);
      onUpdateEvent(updated);
      setSelectedRegistry(updated);
      showToast("Attendance status toggled.");
    } catch (err) {
      showToast("Failed to update status.", "error");
    } finally {
      setIsUpdatingCheckIn(null);
    }
  };

  const handleDownloadCSV = (event: CollegeEvent) => {
    try {
      const headers = ['Student ID', 'Email', 'Role', 'Status', 'Verified', 'Event', 'Date'];
      const rows = (event.registrations || []).map(rid => [
        `STU_${rid.toUpperCase()}`,
        `${rid}@college.edu`,
        'STUDENT',
        'ACTIVE',
        (event.checkedIn || []).includes(rid) ? 'YES' : 'NO',
        `"${event.title}"`,
        new Date(event.date).toLocaleDateString()
      ]);
      const csv = "\ufeff" + [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Registry_${event.title.substring(0, 10)}.csv`;
      a.click();
      showToast("CSV Downloaded");
    } catch (e) {
      showToast("Export failed", 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent(formData);
    setFormData({ title: '', description: '', date: '', location: '', category: 'Technical', organizer: '', capacity: 50, imageUrl: '', venueLinks: [], aiSummary: '' });
    setShowForm(false);
    showToast("Event is now Live!");
  };

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto animate-in fade-in duration-700 relative">
      
      {toast && (
        <div className={`fixed top-12 right-12 z-[300] px-8 py-5 rounded-[32px] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-12 duration-300 border-l-4 ${toast.type === 'success' ? 'bg-slate-900 border-indigo-500 text-white' : 'bg-red-600 border-white text-white'}`}>
           <span className="text-xl">{toast.type === 'success' ? '✨' : '⚠️'}</span>
           <span className="font-black text-xs uppercase tracking-widest">{toast.message}</span>
        </div>
      )}

      {/* Overview Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
               <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </div>
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Admin Control Tower</span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Command Center</h1>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-[32px] shadow-sm border border-slate-100">
          <button onClick={() => setActiveTab('management')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'management' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}>Event Registry</button>
          <button onClick={() => setActiveTab('database')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'database' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}>Raw Feed</button>
        </div>
      </div>

      {/* Pulse Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Outreach</p>
            <p className="text-4xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{stats.totalRegs}</p>
            <div className="mt-4 flex items-center text-xs text-emerald-500 font-bold">
               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeWidth="2.5"/></svg>
               +12% vs last week
            </div>
         </div>
         <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group cursor-pointer" onClick={() => setShowForm(true)}>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Quick Action</p>
              <p className="text-3xl font-black text-white">Draft Event</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">Launch Event Studio</p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-125 transition-transform duration-700">
               <svg className="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" /></svg>
            </div>
         </div>
      </div>

      {activeTab === 'management' && (
        <div className="bg-white rounded-[56px] shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-12 duration-700">
          <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Event Logs</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Operational Audit and Engagement</p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <input 
                  type="text" 
                  placeholder="Search events, venues..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm font-bold"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5"/></svg>
              </div>
              {selectedEvents.length > 0 && (
                <button onClick={handleBulkDelete} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all border border-red-100 flex items-center gap-2 group">
                   <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                   <span className="text-[10px] font-black uppercase tracking-widest">Purge {selectedEvents.length}</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-10 py-6 w-12">
                    <div className="flex items-center justify-center">
                       <input 
                        type="checkbox" 
                        checked={events.length > 0 && selectedEvents.length === events.length} 
                        onChange={() => setSelectedEvents(selectedEvents.length === events.length ? [] : events.map(e => e.id))} 
                        className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" 
                      />
                    </div>
                  </th>
                  <th className="px-10 py-6">Identity & Venue</th>
                  <th className="px-10 py-6">Engagement Load</th>
                  <th className="px-10 py-6">Participant Reach</th>
                  <th className="px-10 py-6 text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredEvents.map(event => (
                  <tr key={event.id} className={`group hover:bg-slate-50 transition-all ${selectedEvents.includes(event.id) ? 'bg-indigo-50/30' : ''}`}>
                    <td className="px-10 py-8">
                       <div className="flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={selectedEvents.includes(event.id)} 
                            onChange={() => setSelectedEvents(prev => prev.includes(event.id) ? prev.filter(id => id !== event.id) : [...prev, event.id])} 
                            className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" 
                          />
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm">
                           <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col">
                           <span className="font-black text-lg text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{event.title}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">📍 {event.location} • {event.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex flex-col max-w-[120px]">
                          <div className="flex justify-between items-center mb-1.5">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Load</span>
                             <span className="text-xs font-black text-indigo-600">{Math.round((event.registrations?.length || 0) / (event.capacity || 1) * 100)}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, ((event.registrations?.length || 0) / (event.capacity || 1)) * 100)}%` }}></div>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex -space-x-3">
                          {[...Array(Math.min(3, (event.registrations || []).length))].map((_, i) => (
                            <div key={i} className="w-9 h-9 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm">ST</div>
                          ))}
                          {(event.registrations?.length || 0) > 3 && (
                            <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] font-black text-white">+{event.registrations.length - 3}</div>
                          )}
                          {(!event.registrations || event.registrations.length === 0) && (
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Signups</span>
                          )}
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex justify-end gap-2">
                          <button onClick={() => setSelectedRegistry(event)} className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:shadow-xl rounded-[20px] transition-all" title="Manage Registry">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          <button onClick={() => handleDeleteClick(event.id)} className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:shadow-xl rounded-[20px] transition-all" title="Delete">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEvents.length === 0 && (
              <div className="py-32 text-center bg-slate-50/30">
                 <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-xs">No Records Found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="bg-slate-900 p-12 rounded-[56px] shadow-2xl animate-in zoom-in-95 text-white">
          <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-white">Raw Persistence Layer</h3>
              <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mt-1">Live State Data Feed</p>
            </div>
            <button onClick={onResetDatabase} className="px-8 py-4 bg-red-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-900/20">Purge Data Cache</button>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <pre className="relative z-10 text-[12px] text-emerald-400/90 font-mono p-10 rounded-[32px] overflow-auto max-h-[600px] leading-relaxed custom-scrollbar bg-black/40 border border-white/5 backdrop-blur-xl">
              {JSON.stringify(events, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Event Studio Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-5xl rounded-[64px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
              <div className="md:w-5/12 bg-slate-50 p-16 flex flex-col border-r border-slate-100">
                 <div className="flex-1 space-y-10">
                    <div>
                       <div className="w-12 h-12 bg-indigo-600 rounded-[20px] flex items-center justify-center shadow-2xl mb-6">
                         <span className="text-white text-xl font-black">E</span>
                       </div>
                       <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Event Studio</h2>
                       <p className="text-sm text-slate-500 font-medium mt-4 leading-relaxed">Design your next campus landmark with the help of Gemini Vision & Synthesis.</p>
                    </div>

                    <div className="space-y-6">
                       <button onClick={handleMagicFill} disabled={isGenerating} className="w-full p-8 bg-white border border-indigo-100 rounded-[32px] shadow-sm hover:shadow-xl hover:border-indigo-500 group transition-all text-left">
                          <div className="flex items-center gap-4 mb-3">
                             <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {isGenerating ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : '✨'}
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Gemini AI</span>
                          </div>
                          <p className="text-slate-900 font-black text-lg">Auto-Generate Assets</p>
                          <p className="text-xs text-slate-400 font-medium mt-1">AI creates high-res posters and summaries.</p>
                       </button>

                       <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100">
                          <div className="flex items-center gap-3 mb-2">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Smart Mapping</span>
                          </div>
                          <p className="text-xs text-emerald-700 font-bold">Venue coordinates are synchronized automatically based on location selection.</p>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setShowForm(false)} className="px-10 py-5 bg-white border border-slate-200 text-slate-400 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all">Discard Draft</button>
              </div>

              <div className="md:w-7/12 p-16 overflow-y-auto custom-scrollbar">
                 <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Identity</label>
                       <input required placeholder="eg. Cyber-Sec Summit" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[24px] outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all text-xl font-black text-slate-900 placeholder:text-slate-300" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification</label>
                          <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[24px] font-bold outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white appearance-none transition-all">
                             <option>Technical</option><option>Cultural</option><option>Workshop</option><option>Seminar</option><option>Sports</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Occupancy</label>
                          <input required type="number" placeholder="Cap" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[24px] font-bold outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Venue</label>
                       <select required value={formData.location} onChange={handleLocationChange} className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[24px] font-bold outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white appearance-none transition-all">
                          <option value="">Select Point...</option>
                          {CAMPUS_VENUES.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                          <option value="Custom">Other Location</option>
                       </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Timeline</label>
                          <input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[24px] font-bold outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Organizer</label>
                          <input required placeholder="Department/Club" value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[24px] font-bold outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all" />
                       </div>
                    </div>

                    <div className="pt-10">
                       <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xl shadow-2xl shadow-slate-200 hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-4">
                          Deploy to Campus
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}

      {/* Attendance Registry Modal */}
      {selectedRegistry && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-2xl rounded-[64px] p-16 shadow-2xl animate-in zoom-in-95 duration-500">
              <div className="flex justify-between items-start mb-12">
                 <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{selectedRegistry.title}</h2>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mt-3">Active Registry Control</p>
                 </div>
                 <button onClick={() => setSelectedRegistry(null)} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-all group">
                    <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                 </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                 {(selectedRegistry.registrations || []).length === 0 ? (
                   <div className="py-24 text-center border-4 border-dashed border-slate-100 rounded-[48px]">
                      <p className="text-slate-300 font-black uppercase text-xs tracking-widest">Awaiting Enrollments</p>
                   </div>
                 ) : (
                   selectedRegistry.registrations.map(rid => (
                     <div key={rid} className="flex justify-between items-center p-6 bg-slate-50 rounded-[32px] border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm">ID</div>
                           <div className="flex flex-col">
                              <span className="font-black text-slate-900">STU_{rid.toUpperCase()}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Account</span>
                           </div>
                        </div>
                        <button 
                          onClick={() => handleManualCheckIn(rid)}
                          disabled={isUpdatingCheckIn === rid}
                          className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedRegistry.checkedIn.includes(rid) ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 hover:bg-indigo-600 hover:text-white'}`}
                        >
                          {isUpdatingCheckIn === rid ? '...' : (selectedRegistry.checkedIn.includes(rid) ? 'Verified' : 'Manual Triage')}
                        </button>
                     </div>
                   ))
                 )}
              </div>

              <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                 <div>
                    <p className="text-4xl font-black text-slate-900">{(selectedRegistry.registrations || []).length}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Confirmed Participants</p>
                 </div>
                 <button onClick={() => handleDownloadCSV(selectedRegistry)} className="px-10 py-5 bg-indigo-600 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V3m0 9l-3-3m3 3l3-3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Export Roster
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
