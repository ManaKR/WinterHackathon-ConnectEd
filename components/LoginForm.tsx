
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginFormProps {
  onLogin: (email: string, pass: string, role: UserRole) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password, role);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
      <div className="hidden lg:block space-y-8 animate-in slide-in-from-left-12 duration-1000">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200">
            <span className="text-white text-4xl font-black">C</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter text-slate-900 leading-[1.1]">
            Your Campus, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Connected.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
            The ultimate event management system for the modern university experience. Powered by Gemini AI.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-6 pt-8">
          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Live Events</p>
            <p className="text-3xl font-black text-slate-900">24</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Registrations</p>
            <p className="text-3xl font-black text-slate-900">1.8k</p>
          </div>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto lg:mx-0 lg:ml-auto">
        <div className="lg:hidden text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-6">
            <span className="text-white text-4xl font-bold">C</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">CampusConnect</h1>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-700">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900">Welcome back</h2>
            <p className="text-slate-500 text-sm font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole(UserRole.STUDENT)}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${role === UserRole.STUDENT ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.ADMIN)}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${role === UserRole.ADMIN ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Administrator
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">University Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
                placeholder="you@college.edu"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Secure Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] font-black text-lg shadow-xl shadow-indigo-100 transition-all active:scale-95 mt-4"
            >
              Sign In to Portal
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-sm font-medium">
              Demo Users: <span className="text-indigo-600 font-bold">student@college.edu / password</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
