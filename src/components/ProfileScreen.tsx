import { useState } from 'react';
import { ArrowLeft, LogOut, Bell, Globe, Share2, Star, ChevronRight } from 'lucide-react';

interface ProfileScreenProps {
  onBack: () => void;
  onSignOut: () => void;
}

const USER = {
  name: 'Rahul Sharma',
  city: 'Mumbai',
  joinDate: 'June 2025',
  avatar: 'RS',
  issuesReported: 7,
  resolved: 4,
  upvotesGiven: 62,
  xp: 650,
  nextLevelXp: 800,
  level: 'Road Warrior',
};

const LEVELS = ['Observer', 'Reporter', 'Advocate', 'Road Warrior', 'Community Hero'];

const RECENT_ACTIVITY = [
  { id: '1', title: 'Deep pothole — SV Road near D-Mart', status: 'Open' as const },
  { id: '2', title: 'Road surface cracking — Oshiwara Link Road', status: 'In Progress' as const },
  { id: '3', title: 'Drainage blockage — 7 Bungalows', status: 'Resolved' as const },
];

const statusPill = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-cb-primary/10 text-cb-primary';
    case 'In Progress': return 'bg-cb-amber/10 text-cb-amber';
    case 'Resolved': return 'bg-cb-success/10 text-cb-success';
    default: return 'bg-gray-100 text-gray-500';
  }
};

export default function ProfileScreen({ onBack, onSignOut }: ProfileScreenProps) {
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState(true);
  const levelIndex = LEVELS.indexOf(USER.level);
  const progress = (USER.xp / USER.nextLevelXp) * 100;

  return (
    <div className="w-full h-full bg-cb-cream flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-cb-navy px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-semibold text-[15px]">Profile</span>
      </div>

      {/* Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Card */}
        <div className="bg-cb-navy px-4 pb-6 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-cb-primary flex items-center justify-center text-white font-bold text-[18px]">
              {USER.avatar}
            </div>
            <div>
              <h2 className="text-white font-bold text-[18px]">{USER.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-white/50 text-[13px]">{USER.city}</span>
                <span className="text-white/30">·</span>
                <span className="text-white/50 text-[13px]">Joined {USER.joinDate}</span>
              </div>
              <span className="inline-block mt-1.5 bg-cb-amber/20 text-cb-amber text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {USER.level}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 -mt-3">
          <div className="bg-white rounded-card shadow-card p-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-[22px] font-extrabold text-cb-primary">{USER.issuesReported}</div>
              <div className="text-[11px] text-gray-500 font-medium mt-0.5">Issues Reported</div>
            </div>
            <div className="text-center border-l border-r border-gray-100">
              <div className="text-[22px] font-extrabold text-cb-success">{USER.resolved}</div>
              <div className="text-[11px] text-gray-500 font-medium mt-0.5">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-[22px] font-extrabold text-cb-info">{USER.upvotesGiven}</div>
              <div className="text-[11px] text-gray-500 font-medium mt-0.5">Upvotes Given</div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Rank Progress */}
          <div className="bg-white rounded-card p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-bold text-gray-800">Citizen Rank</span>
              <span className="text-[11px] text-cb-amber font-bold">{USER.level}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-cb-amber to-cb-primary rounded-full progress-anim"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              {LEVELS.map((l, i) => (
                <span key={l} className={i === levelIndex ? 'text-cb-amber font-bold' : ''}>
                  {l}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-gray-500 text-center mt-1">
              You need <span className="font-bold text-cb-navy">{USER.nextLevelXp - USER.xp}</span> more XP to reach {LEVELS[levelIndex + 1] || 'max'}
            </p>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-card p-4 shadow-card">
            <h3 className="text-[13px] font-bold text-gray-800 mb-3">Recent Activity</h3>
            <div className="space-y-2.5">
              {RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-700 truncate max-w-[220px]">{activity.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusPill(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-gray-500" />
                <span className="text-[14px] text-gray-700">Notifications</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-10 h-6 rounded-full transition-colors duration-200 relative ${notifications ? 'bg-cb-primary' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-200 ${notifications ? 'left-5' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-[14px] text-gray-700">Language</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-[13px] text-gray-600 bg-transparent focus:outline-none"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
              </select>
            </div>

            <button className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <Share2 className="w-4 h-4 text-gray-500" />
                <span className="text-[14px] text-gray-700">Share CivicBridge</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-gray-500" />
                <span className="text-[14px] text-gray-700">Rate the app</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Sign Out */}
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-card bg-white text-cb-primary font-semibold text-[15px] shadow-card hover:bg-red-50 transition-colors duration-200 btn-tap"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>

          <div className="text-center text-[11px] text-gray-400 pb-2">
            CivicBridge v1.0
          </div>
        </div>
      </div>
    </div>
  );
}
