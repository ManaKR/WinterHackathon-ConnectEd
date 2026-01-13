
// Fix: Corrected import from react and removed redundant type definitions already present in types.ts
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CollegeEvent, AppUser, Certificate } from '../types';
import { verifyAttendance } from '../services/geminiService';
import { api } from '../services/api';
import EventModal from './EventModal';

interface StudentDashboardProps {
  user: AppUser;
  events: CollegeEvent[];
  onRegister: (eventId: string) => void;
  onUnregister: (eventId: string) => void;
  onVerify: (eventId: string, location?: { lat: number; lng: number }) => Promise<void>;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, events, onRegister, onUnregister, onVerify }) => {
  const [view, setView] = useState<'browse' | 'activities' | 'certificates'>('browse');
  const [activitySubTab, setActivitySubTab] = useState<'upcoming' | 'history'>('upcoming');
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CollegeEvent | null>(null);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showCamera, setShowCamera] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadCerts = async () => {
      const certs = await api.getCertificates(user.id);
      setCertificates(certs);
    };
    loadCerts();
  }, [user.id, events]);

  const registeredEvents = useMemo(() => events.filter(e => (e.registrations || []).includes(user.id)), [events, user.id]);
  const upcomingEvents = useMemo(() => registeredEvents.filter(e => !(e.checkedIn || []).includes(user.id)), [registeredEvents, user.id]);
  const historyEvents = useMemo(() => registeredEvents.filter(e => (e.checkedIn || []).includes(user.id)), [registeredEvents, user.id]);

  const filteredBrowse = useMemo(() => {
    return events.filter(e => !(e.registrations || []).includes(user.id)).filter(e => 
      e.title.toLowerCase().includes(search.toLowerCase()) || 
      e.location.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search, user.id]);

  const startCamera = async (eventId: string) => {
    setShowCamera(eventId);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setCameraError("Camera access denied. Please enable permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(null);
  };

  const captureAndVerify = async () => {
    if (!videoRef.current || !canvasRef.current || !showCamera) return;
    
    setIsVerifying(showCamera);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    
    try {
      const result = await verifyAttendance(base64Image);
      if (result.verified) {
        await onVerify(showCamera, { lat: 0, lng: 0 }); 
        stopCamera();
        setActivitySubTab('history');
      } else {
        alert(`Verification Denied: ${result.reason}`);
      }
    } catch (err) {
      alert("Verification system busy. Try again.");
    } finally {
      setIsVerifying(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {showCamera && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl">
          <div className="bg-white/5 border border-white/10 rounded-[64px] p-12 max-w-2xl w-full text-center space-y-8 animate-in zoom-in-95">
             <h3 className="text-3xl font-black text-white tracking-tighter">Biometric Authentication</h3>
             <div className="relative aspect-video rounded-[48px] overflow-hidden border-4 border-indigo-500/30 bg-black">
                <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" playsInline />
                <canvas ref={canvasRef} className="hidden" />
                {isVerifying && (
                  <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
             </div>
             {cameraError && <p className="text-red-400 font-bold">{cameraError}</p>}
             <div className="flex gap-4">
               <button onClick={stopCamera} className="flex-1 py-5 bg-white/10 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-white/20 transition-all">Cancel</button>
               <button onClick={captureAndVerify} disabled={!!isVerifying} className="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all active:scale-95">Confirm Identity</button>
             </div>
          </div>
        </div>
      )}

      <div className="bg-slate-900 rounded-[56px] p-12 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-[32px] flex items-center justify-center text-5xl font-black border-4 border-white/10 ring-8 ring-white/5">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-5xl font-black tracking-tighter mb-2">Hello, {user.name.split(' ')[0]}!</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Verified Campus Access</span>
               <span className="px-4 py-2 bg-white/5 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">ID: {user.id.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex gap-6">
             <div className="bg-white/5 backdrop-blur-md p-8 rounded-[40px] border border-white/10 text-center min-w-[140px] hover:bg-white/10 transition-all">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Upcoming</p>
                <p className="text-4xl font-black">{upcomingEvents.length}</p>
             </div>
             <div className="bg-white/5 backdrop-blur-md p-8 rounded-[40px] border border-white/10 text-center min-w-[140px] hover:bg-white/10 transition-all">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Badges</p>
                <p className="text-4xl font-black">{certificates.length}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          {view === 'browse' ? 'Explore Campus Life' : view === 'activities' ? 'Your Timeline' : 'Achievement Gallery'}
        </h1>
        
        <nav className="flex space-x-1 bg-slate-100 p-2 rounded-3xl border border-slate-200">
          {[
            { id: 'browse', label: 'Feed', icon: '🔍' },
            { id: 'activities', label: 'My Hub', icon: '📅' },
            { id: 'certificates', label: 'Vault', icon: '🏆' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-3 ${view === tab.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {view === 'browse' && (
        <div className="space-y-12">
          <div className="relative group max-w-2xl">
            <svg className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Discover workshops, fests, or sports..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-20 pr-10 py-7 bg-white border border-slate-200 rounded-[40px] outline-none focus:ring-8 focus:ring-indigo-50 shadow-sm transition-all text-slate-700 font-bold text-xl placeholder:text-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredBrowse.map(event => (
              <div 
                key={event.id} 
                onClick={() => setSelectedEvent(event)}
                className="group bg-white rounded-[56px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 cursor-pointer flex flex-col h-full relative"
              >
                <div className="h-72 relative overflow-hidden">
                  <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt={event.title} />
                  <div className="absolute top-8 left-8 flex flex-col gap-2">
                    <span className="px-5 py-2 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-black text-indigo-600 shadow-sm uppercase tracking-widest border border-indigo-100">{event.category}</span>
                  </div>
                </div>
                <div className="p-12 flex flex-col flex-1">
                  <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                    <svg className="w-5 h-5 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2.5" /></svg>
                    {new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 leading-tight mb-6 tracking-tight group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                  <div className="mt-auto pt-10 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{event.capacity - (event.registrations || []).length} Slots Left</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'activities' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-500">
          <div className="flex justify-center">
            <div className="bg-slate-100 p-2 rounded-[32px] flex border border-slate-200">
               <button onClick={() => setActivitySubTab('upcoming')} className={`px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activitySubTab === 'upcoming' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Upcoming</button>
               <button onClick={() => setActivitySubTab('history')} className={`px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activitySubTab === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Verified History</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10">
            {(activitySubTab === 'upcoming' ? upcomingEvents : historyEvents).map(event => (
              <div key={event.id} className="group flex flex-col lg:flex-row p-10 rounded-[56px] border border-slate-100 bg-white items-center gap-12 hover:shadow-2xl transition-all duration-700 relative">
                <div className="w-full lg:w-56 h-56 rounded-[40px] overflow-hidden relative shadow-sm">
                  <img src={event.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  {activitySubTab === 'history' && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-white p-4 rounded-full shadow-2xl">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4" /></svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <span className="px-5 py-2 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-full mb-6 inline-block">{event.category}</span>
                  <h4 className="font-black text-4xl text-slate-900 leading-none mb-4 tracking-tighter">{event.title}</h4>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">📍 {event.location} • 🗓️ {new Date(event.date).toLocaleDateString()}</p>
                </div>
                <div className="min-w-[240px]">
                  {activitySubTab === 'upcoming' ? (
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => startCamera(event.id)} 
                        className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95"
                      >
                        Verify Presence
                      </button>
                      <button 
                        onClick={() => setSelectedEvent(event)} 
                        className="w-full py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setView('certificates')} className="w-full py-6 bg-emerald-50 text-emerald-600 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-100 transition-all border border-emerald-100">
                      View Badge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'certificates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in zoom-in-95 duration-700">
          {certificates.length === 0 ? (
            <div className="col-span-full py-32 text-center bg-slate-50 rounded-[56px] border-4 border-dashed border-slate-200">
               <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-sm">Vault Awaiting Achievements</p>
            </div>
          ) : (
            certificates.map(cert => (
              <div key={cert.id} className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-xl relative overflow-hidden group hover:scale-105 transition-all">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
                 <div className="mb-8">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full">Certificate of Completion</span>
                 </div>
                 <h4 className="text-2xl font-black text-slate-900 mb-2 leading-tight tracking-tight">{cert.eventTitle}</h4>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-10">Issued by: {cert.issuer}</p>
                 <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black shadow-sm">✓</div>
                 </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          user={user}
          onClose={() => setSelectedEvent(null)}
          isRegistered={(selectedEvent.registrations || []).includes(user.id)}
          onRegister={() => { onRegister(selectedEvent.id); setSelectedEvent(null); }}
          onUnregister={() => { onUnregister(selectedEvent.id); setSelectedEvent(null); }}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
