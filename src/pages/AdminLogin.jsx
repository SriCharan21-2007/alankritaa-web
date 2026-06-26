import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Lock, Mail, Eye, EyeOff, Loader, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const { isAuthenticated, login } = useAdmin();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    // Add brief artificial delay for realistic premium secure login feel
    setTimeout(async () => {
      const success = await login(email, password);
      setIsLoading(false);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials. Please try again.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-ivory/30 flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[30rem] h-[30rem] rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] rounded-full bg-burgundy/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gold/10 overflow-hidden relative z-10">
        
        {/* Header/Banner Area */}
        <div className="bg-burgundy px-6 py-8 text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 border border-gold/30 mb-3">
            <Lock className="w-6 h-6 text-gold" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gold tracking-wide">
            Alankrita Admin Portal
          </h2>
          <p className="text-ivory/70 text-xs mt-1">
            Access secure owner panel & customer enquiries
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 xs:p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2 animate-shake">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-light mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gold" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@alankrita.com"
                  className="w-full pl-11 pr-4 py-3 bg-ivory/20 border border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold rounded-lg outline-none text-sm text-charcoal focus:bg-white transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-light mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gold" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-ivory/20 border border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold rounded-lg outline-none text-sm text-charcoal focus:bg-white transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gold hover:text-gold-dark focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-burgundy hover:bg-burgundy-dark text-white font-semibold text-sm tracking-wide rounded-lg shadow-md hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer uppercase mt-2 border border-gold/20"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin text-gold" />
                  <span className="text-gold">Verifying Identity...</span>
                </>
              ) : (
                'Secure Sign In'
              )}
            </button>
          </form>

          {/* Secondary Action */}
          <div className="mt-8 pt-5 border-t border-gold/10 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-burgundy hover:text-gold transition-colors font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Website
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
