import React, { useState } from 'react';
import { User } from '../types';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  syncUserProfile,
  ADMIN_EMAIL
} from '../lib/firebase';
import { ShieldCheck, Mail, Lock, User as UserIcon, AlertCircle, Loader2 } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const appUser = await syncUserProfile(result.user);
      onLoginSuccess(appUser);
      onClose();
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setError(err.message || 'Google sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        const appUser = await syncUserProfile(userCredential.user, name);
        onLoginSuccess(appUser);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const appUser = await syncUserProfile(userCredential.user);
        onLoginSuccess(appUser);
      }
      onClose();
    } catch (err: any) {
      console.error("Auth submit error:", err);
      let errMsg = 'Authentication failed.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        errMsg = 'An account with this email already exists. Try logging in.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password should be at least 6 characters.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070c10]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121c23] border border-white/15 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative text-[#e5dfd3]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8a9aa8] hover:text-white text-xs font-bold w-7 h-7 rounded-full bg-white/5 flex items-center justify-center"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#e0a96d] text-[#0c1319] flex items-center justify-center text-2xl mx-auto mb-2 shadow-md font-bold">
            🍧
          </div>
          <h2 className="text-xl md:text-2xl font-normal text-[#f5eedc] font-hindi-display">
            {isSignUp ? 'कानपुरिया बर्फ़ का गोला में शामिल हों' : 'अकाउंट में लॉगिन करें'}
          </h2>
          <p className="text-xs text-[#8a9aa8] mt-1">
            Real User Authentication & Profile Cloud Sync
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl mb-4 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Login Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[#18242f] hover:bg-[#202f3d] border border-white/10 rounded-xl text-xs font-medium text-[#f5eedc] transition-all mb-4 flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 mb-4 text-[10px] text-[#6b7b8a] uppercase tracking-wider">
          <div className="flex-1 h-px bg-white/10" />
          <span>or email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isSignUp && (
            <div>
              <label className="text-xs text-[#8a9aa8] block mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#6b7b8a] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Swarit Shukla"
                  className="w-full bg-[#0c1319] border border-white/10 pl-9 pr-3 py-2 rounded-xl text-xs text-[#f5eedc] focus:outline-none focus:border-[#e0a96d]"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-[#8a9aa8] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6b7b8a] absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#0c1319] border border-white/10 pl-9 pr-3 py-2 rounded-xl text-xs text-[#f5eedc] focus:outline-none focus:border-[#e0a96d]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#8a9aa8] block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6b7b8a] absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0c1319] border border-white/10 pl-9 pr-3 py-2 rounded-xl text-xs text-[#f5eedc] focus:outline-none focus:border-[#e0a96d]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#e0a96d] text-[#0c1319] font-bold text-xs rounded-xl shadow-md hover:brightness-110 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{isSignUp ? 'Create Real Account' : 'Log In'}</span>
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-xs text-[#8a9aa8] hover:text-[#e0a96d] transition-colors"
          >
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 text-center text-[10px] text-[#6b7b8a]">
          Admin Access: Log in with <strong className="text-[#e0a96d]">{ADMIN_EMAIL}</strong>
        </div>
      </div>
    </div>
  );
};
