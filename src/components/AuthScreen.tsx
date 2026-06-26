import { useState } from 'react';

interface AuthScreenProps {
  onAuthSuccess: () => void;
  onBack: () => void;
}

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];

export default function AuthScreen({ onAuthSuccess, onBack }: AuthScreenProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = () => {
    let s = 0;
    if (password.length > 5) s++;
    if (password.length > 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const strength = passwordStrength();
  const strengthColors = ['bg-gray-300', 'bg-cb-primary', 'bg-cb-amber', 'bg-cb-success', 'bg-cb-success'];
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

  const canSubmit = () => {
    if (tab === 'signin') {
      return (email || phone) && password.length >= 6;
    }
    return name && (email || phone) && city && password.length >= 6;
  };

  return (
    <div className="w-full h-full bg-cb-navy flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center py-4 relative">
        <button onClick={onBack} className="absolute left-4 text-white/60 text-sm">Back</button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cb-primary flex items-center justify-center text-white font-bold text-xs">
            CB
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">CivicBridge</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center px-6 mb-4">
        <div className="bg-white/10 rounded-pill p-1 flex">
          <button
            onClick={() => setTab('signin')}
            className={`px-5 py-2 rounded-pill text-[13px] font-semibold transition-all duration-200 ${
              tab === 'signin' ? 'bg-white text-cb-navy' : 'text-white/60 hover:text-white/80'
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`px-5 py-2 rounded-pill text-[13px] font-semibold transition-all duration-200 ${
              tab === 'signup' ? 'bg-white text-cb-navy' : 'text-white/60 hover:text-white/80'
            }`}
          >
            Create account
          </button>
        </div>
      </div>

      {/* White Card */}
      <div className="flex-1 bg-white rounded-t-card mx-0 mt-2 px-6 pt-6 pb-8 overflow-y-auto screen-fade-in-up">
        <div className={`${tab === 'signin' ? 'tab-switch-in' : 'tab-switch-in-rev'}`}>
          {tab === 'signin' ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Phone number or email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter phone or email"
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 text-[15px] focus:outline-none focus:border-cb-primary focus:ring-1 focus:ring-cb-primary/20 transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full h-12 rounded-xl border border-gray-200 px-4 pr-12 text-[15px] focus:outline-none focus:border-cb-primary focus:ring-1 focus:ring-cb-primary/20 transition-all duration-200"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[12px] hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="text-[12px] text-cb-primary font-medium hover:underline transition-all">Forgot password?</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 text-[15px] focus:outline-none focus:border-cb-primary focus:ring-1 focus:ring-cb-primary/20 transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Phone number</label>
                <div className="flex gap-2">
                  <div className="h-12 rounded-xl border border-gray-200 px-3 flex items-center text-[15px] text-gray-500 bg-gray-50">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="flex-1 h-12 rounded-xl border border-gray-200 px-4 text-[15px] focus:outline-none focus:border-cb-primary focus:ring-1 focus:ring-cb-primary/20 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 text-[15px] focus:outline-none focus:border-cb-primary focus:ring-1 focus:ring-cb-primary/20 bg-white transition-all duration-200"
                >
                  <option value="">Select your city</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full h-12 rounded-xl border border-gray-200 px-4 pr-12 text-[15px] focus:outline-none focus:border-cb-primary focus:ring-1 focus:ring-cb-primary/20 transition-all duration-200"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[12px] hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {/* Strength indicator */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strengthColors[strength] || 'bg-gray-300'}`}
                      style={{ width: `${Math.max((strength / 5) * 100, 8)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{strengthLabels[strength] || 'Too weak'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={onAuthSuccess}
          disabled={!canSubmit()}
          className={`w-full mt-6 py-3.5 rounded-pill font-semibold text-[15px] transition-all duration-200 btn-tap ${
            canSubmit()
              ? 'bg-cb-primary text-white shadow-lg shadow-cb-primary/20 hover:shadow-cb-primary/30'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          {tab === 'signin' ? 'Sign in' : 'Create account'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[11px] text-gray-400 font-medium">or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Button */}
        <button
          onClick={onAuthSuccess}
          className="w-full py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 transition-all duration-200 btn-tap"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-[14px] font-medium text-gray-700">Google Sign-In</span>
        </button>

        <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
