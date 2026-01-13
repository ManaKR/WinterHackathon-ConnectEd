
import React, { useState } from 'react';
import { CollegeEvent, AppUser } from '../types';
import { askEventOracle } from '../services/geminiService';
import { api } from '../services/api';

interface EventModalProps {
  event: CollegeEvent;
  user: AppUser;
  onClose: () => void;
  onRegister?: () => void;
  onUnregister?: () => void;
  isRegistered?: boolean;
}

const EventModal: React.FC<EventModalProps> = ({ event, user, onClose, onRegister, onUnregister, isRegistered }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [isReminderSet, setIsReminderSet] = useState(event.reminders?.includes(user.id)); 
  
  const mapLink = event.venueLinks?.find(link => link.maps)?.maps?.uri;

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setIsAsking(true);
    const res = await askEventOracle(event.title, event.description, question);
    setAnswer(res);
    setIsAsking(false);
  };

  const toggleReminder = async () => {
    try {
      await api.toggleReminder(event.id, user.id);
      setIsReminderSet(!isReminderSet);
    } catch (err) {
      alert("Failed to update reminder status.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[56px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300 border border-white/20">
        
        <div className="md:w-5/12 relative h-64 md:h-auto border-r border-slate-100 bg-slate-50">
          <img src={event.imageUrl} className="w-full h-full object-cover" alt={event.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">{event.category}</span>
            <h2 className="text-4xl font-black mt-4 leading-tight tracking-tighter">{event.title}</h2>
          </div>
          <button onClick={onClose} className="absolute top-6 left-6 p-3 bg-white/20 hover:bg-white/40 text-white rounded-2xl backdrop-blur-md transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
        </div>

        <div className="md:w-7/12 p-12 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex-1 space-y-10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Authorized Organizer</p>
                <p className="text-lg font-black text-slate-900">{event.organizer}</p>
              </div>
              <div className="text-right space-y-3">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Engagement</p>
                <div className="flex items-center justify-end gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <p className="text-sm font-black text-indigo-600">{event.registrations.length} Students Joined</p>
                </div>
                {isRegistered && (
                   <button 
                     onClick={toggleReminder}
                     className={`flex items-center gap-2 ml-auto px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isReminderSet ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                   >
                     <svg className="w-3.5 h-3.5" fill={isReminderSet ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2.5" /></svg>
                     {isReminderSet ? 'Reminder Active' : 'Set 24h Alert'}
                   </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2.5" /></svg>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Schedule</span>
                   <span className="text-sm font-bold text-slate-700">{new Date(event.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2.5" /></svg>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Official Venue</span>
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-bold text-slate-700">{event.location}</span>
                     {mapLink && (
                       <a href={mapLink} target="_blank" rel="noopener noreferrer" className="p-1 bg-white rounded-lg text-indigo-600 hover:text-indigo-900 transition-colors shadow-sm">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2.5" /></svg>
                       </a>
                     )}
                   </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Event Objective</h4>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">{event.description}</p>
            </div>

            <div className="bg-indigo-50/30 p-8 rounded-[40px] border border-indigo-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
              <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="p-1.5 bg-indigo-600 text-white rounded-lg">✨</span> Gemini Campus Oracle
              </h4>
              <form onSubmit={handleAsk} className="relative z-10">
                <input 
                  type="text" 
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="Ask about dress codes, requirements, or timings..." 
                  className="w-full pl-6 pr-14 py-4 bg-white border border-indigo-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 text-sm font-medium shadow-sm"
                />
                <button 
                  type="submit" 
                  disabled={isAsking}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-95"
                >
                  {isAsking ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3" /></svg>
                  )}
                </button>
              </form>
              {answer && (
                <div className="mt-4 p-5 bg-white rounded-2xl border border-indigo-50 shadow-sm animate-in slide-in-from-top-4 duration-500">
                  <p className="text-sm text-slate-700 italic leading-relaxed">"{answer}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <button onClick={onClose} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
              Back to Feed
            </button>
            {isRegistered ? (
               <button 
                 onClick={onUnregister}
                 className="flex-1 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-xl bg-red-50 text-red-500 hover:bg-red-100 border border-red-100"
               >
                 Unregister from Event
               </button>
            ) : (
              onRegister && (
                <button 
                  onClick={onRegister}
                  className="flex-1 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-xl bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700"
                >
                  Confirm Registration
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
