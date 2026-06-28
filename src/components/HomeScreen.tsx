import { useState, useRef } from 'react';
import {
  Bell, MapPin, ChevronUp, ArrowUp,
  Car, Droplets, Lightbulb, Trash2, AlertTriangle,
  Home, Sparkles, PlusCircle, User
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────
export interface Issue {
  id: string;
  title: string;
  location: string;
  distance: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  complaints: number;
  days: number;
  upvotes: number;
  description: string;
  icon: 'road' | 'water' | 'light' | 'waste' | 'barrier';
  department: string;
  aiReason: string;
  priorityScore: number;
  tags: string[];
  mapX: number;
  mapY: number;
  status: 'Open' | 'In Progress' | 'Resolved';
  reportedAt: string;
  photo?: string;
}

export const ISSUES: Issue[] = [
  {
    id: '1',
    title: 'Deep pothole — SV Road near D-Mart',
    location: 'SV Road, Andheri West',
    distance: '0.3 km away',
    severity: 'Critical',
    complaints: 87,
    days: 12,
    upvotes: 142,
    description: 'A deep pothole spanning the entire width of the road near D-Mart. Multiple vehicles have been damaged and 2-wheeler riders are at risk, especially during monsoons. Water accumulation makes it invisible at night.',
    icon: 'road',
    department: 'BMC Roads Department',
    aiReason: '87 complaints in 12 days with accident reports',
    priorityScore: 94,
    tags: ['accident-prone', 'monsoon-risk', 'high-traffic'],
    mapX: 180,
    mapY: 100,
    status: 'Open',
    reportedAt: '2026-06-12',
  },
  {
    id: '2',
    title: '4 streetlights out — Andheri flyover stretch',
    location: 'Andheri Flyover, Andheri',
    distance: '1.2 km away',
    severity: 'High',
    complaints: 43,
    days: 8,
    upvotes: 89,
    description: 'Four consecutive streetlights on the Andheri flyover are not functioning for over a week. The stretch is dangerously dark at night, forcing pedestrians to walk on the road.',
    icon: 'light',
    department: 'BMC Electrical Department',
    aiReason: 'Safety hazard — dark stretch with heavy evening traffic',
    priorityScore: 87,
    tags: ['safety-hazard', 'evening-traffic', 'pedestrian-risk'],
    mapX: 260,
    mapY: 60,
    status: 'Open',
    reportedAt: '2026-06-16',
  },
  {
    id: '3',
    title: 'Severe waterlogging — Lokhandwala Circle',
    location: 'Lokhandwala Circle, Andheri West',
    distance: '0.8 km away',
    severity: 'Critical',
    complaints: 121,
    days: 3,
    upvotes: 210,
    description: 'Road completely submerged after light rain. Drainage system is clogged. Vehicles cannot pass, and residents are walking through knee-deep water. Disease risk increasing.',
    icon: 'water',
    department: 'BMC Storm Water Drains',
    aiReason: '121 complaints in 3 days — health emergency',
    priorityScore: 98,
    tags: ['health-emergency', 'monsoon-risk', 'traffic-blocked'],
    mapX: 120,
    mapY: 160,
    status: 'Open',
    reportedAt: '2026-06-21',
  },
  {
    id: '4',
    title: 'Road surface cracking — Oshiwara Link Road',
    location: 'Oshiwara Link Road, Oshiwara',
    distance: '2.1 km away',
    severity: 'Medium',
    complaints: 29,
    days: 20,
    upvotes: 45,
    description: 'Longitudinal cracks across the road surface for 200 meters. The cracks are widening and pieces of asphalt are coming loose. Potholes are beginning to form.',
    icon: 'road',
    department: 'BMC Roads Department',
    aiReason: '29 complaints over 20 days — degradation accelerating',
    priorityScore: 62,
    tags: ['surface-degradation', 'expanding'],
    mapX: 80,
    mapY: 220,
    status: 'In Progress',
    reportedAt: '2026-06-04',
  },
  {
    id: '5',
    title: 'Garbage dumping — JP Road bus stop',
    location: 'JP Road Bus Stop, Versova',
    distance: '1.5 km away',
    severity: 'Low',
    complaints: 15,
    days: 5,
    upvotes: 23,
    description: 'Illegal garbage dumping at the bus stop creating foul smell and mosquito breeding. Passengers are forced to stand in the road. No garbage collection for 5 days.',
    icon: 'waste',
    department: 'BMC Solid Waste Management',
    aiReason: '15 complaints — hygiene issue at public transit point',
    priorityScore: 45,
    tags: ['hygiene', 'public-transit'],
    mapX: 320,
    mapY: 180,
    status: 'Open',
    reportedAt: '2026-06-19',
  },
  {
    id: '6',
    title: 'Missing road divider — Western Express Highway',
    location: 'WEH, Goregaon',
    distance: '3.4 km away',
    severity: 'High',
    complaints: 56,
    days: 7,
    upvotes: 78,
    description: 'Road divider missing for 50 meters near Goregaon exit. Vehicles are crossing lanes dangerously. Near-miss accidents reported daily. Immediate barricading needed.',
    icon: 'barrier',
    department: 'BMC Traffic Department',
    aiReason: '56 complaints — near-miss accidents daily',
    priorityScore: 82,
    tags: ['accident-prone', 'highway', 'urgent'],
    mapX: 340,
    mapY: 40,
    status: 'Open',
    reportedAt: '2026-06-17',
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
const severityColor = (s: Issue['severity']) => {
  switch (s) {
    case 'Critical': return '#E24B4A';
    case 'High':     return '#F5C518';
    case 'Medium':   return '#378ADD';
    case 'Low':      return '#1D9E75';
  }
};
const severityBg = (s: Issue['severity']) => {
  switch (s) {
    case 'Critical': return 'bg-cb-primary/10 text-cb-primary';
    case 'High':     return 'bg-cb-amber/10 text-cb-amber';
    case 'Medium':   return 'bg-cb-info/10 text-cb-info';
    case 'Low':      return 'bg-cb-success/10 text-cb-success';
  }
};
const severityBorder = (s: Issue['severity']) => {
  switch (s) {
    case 'Critical': return 'border-l-cb-primary';
    case 'High':     return 'border-l-cb-amber';
    case 'Medium':   return 'border-l-cb-info';
    case 'Low':      return 'border-l-cb-success';
  }
};

const IssueIcon = ({ type, className }: { type: Issue['icon']; className?: string }) => {
  switch (type) {
    case 'road':    return <Car className={className} />;
    case 'water':   return <Droplets className={className} />;
    case 'light':   return <Lightbulb className={className} />;
    case 'waste':   return <Trash2 className={className} />;
    case 'barrier': return <AlertTriangle className={className} />;
  }
};

// ─── SVG Map ─────────────────────────────────────────────────────────────────
function MapSVG({ issues, onPinTap }: { issues: Issue[]; onPinTap: (id: string) => void }) {
  return (
    <svg viewBox="0 0 420 280" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Background blocks */}
      <rect x="0" y="0" width="140" height="70" fill="#E8F5E9" rx="4" />
      <rect x="140" y="0" width="140" height="70" fill="#ECEFF1" rx="4" />
      <rect x="280" y="0" width="140" height="70" fill="#E8F5E9" rx="4" />
      <rect x="0" y="70" width="140" height="70" fill="#ECEFF1" rx="4" />
      <rect x="140" y="70" width="140" height="70" fill="#E8F5E9" rx="4" />
      <rect x="280" y="70" width="140" height="70" fill="#ECEFF1" rx="4" />
      <rect x="0" y="140" width="140" height="70" fill="#E8F5E9" rx="4" />
      <rect x="140" y="140" width="140" height="70" fill="#ECEFF1" rx="4" />
      <rect x="280" y="140" width="140" height="70" fill="#E8F5E9" rx="4" />
      <rect x="0" y="210" width="140" height="70" fill="#ECEFF1" rx="4" />
      <rect x="140" y="210" width="140" height="70" fill="#E8F5E9" rx="4" />
      <rect x="280" y="210" width="140" height="70" fill="#ECEFF1" rx="4" />

      {/* Roads grid */}
      {[0, 70, 140, 210, 280].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="420" y2={y} stroke="#CBD5E1" strokeWidth="10" />
      ))}
      {[0, 140, 280, 420].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="280" stroke="#CBD5E1" strokeWidth="10" />
      ))}

      {/* Road labels */}
      <text x="70" y="35" fontSize="8" fill="#94A3B8" textAnchor="middle">Lokhandwala</text>
      <text x="210" y="35" fontSize="8" fill="#94A3B8" textAnchor="middle">Andheri</text>
      <text x="350" y="35" fontSize="8" fill="#94A3B8" textAnchor="middle">Goregaon</text>
      <text x="70" y="105" fontSize="8" fill="#94A3B8" textAnchor="middle">Oshiwara</text>
      <text x="210" y="105" fontSize="8" fill="#94A3B8" textAnchor="middle">Andheri W</text>
      <text x="350" y="105" fontSize="8" fill="#94A3B8" textAnchor="middle">Versova</text>

      {/* User location pulse */}
      <circle cx="210" cy="105" r="16" fill="#378ADD" opacity="0.2">
        <animate attributeName="r" values="12;24;12" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="210" cy="105" r="8" fill="#378ADD" stroke="white" strokeWidth="2" />

      {/* Issue pins */}
      {issues.map((issue) => {
        const color = severityColor(issue.severity);
        return (
          <g key={issue.id} onClick={() => onPinTap(issue.id)} style={{ cursor: 'pointer' }}>
            <circle cx={issue.mapX} cy={issue.mapY} r="16" fill={color} opacity="0.2">
              <animate attributeName="r" values="12;22;12" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2.4s" repeatCount="indefinite" />
            </circle>
            {issue.photo ? (
              <g>
                <path d={`M ${issue.mapX} ${issue.mapY} L ${issue.mapX - 4} ${issue.mapY - 12} L ${issue.mapX + 4} ${issue.mapY - 12} Z`} fill={color} />
                <rect x={issue.mapX - 22} y={issue.mapY - 44} width="44" height="34" rx="4" fill="white" stroke={color} strokeWidth="2" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" />
                <defs>
                  <clipPath id={`clip-${issue.id}`}>
                    <rect x={issue.mapX - 20} y={issue.mapY - 42} width="40" height="30" rx="2" />
                  </clipPath>
                </defs>
                <image
                  href={issue.photo}
                  x={issue.mapX - 20}
                  y={issue.mapY - 42}
                  width="40"
                  height="30"
                  clipPath={`url(#clip-${issue.id})`}
                  preserveAspectRatio="xMidYMid slice"
                />
              </g>
            ) : (
              <g>
                <path
                  d={`M${issue.mapX},${issue.mapY - 18} 
                      C${issue.mapX - 10},${issue.mapY - 18} ${issue.mapX - 10},${issue.mapY - 6} ${issue.mapX},${issue.mapY + 6}
                      C${issue.mapX + 10},${issue.mapY - 6} ${issue.mapX + 10},${issue.mapY - 18} ${issue.mapX},${issue.mapY - 18}Z`}
                  fill={color}
                  stroke="white"
                  strokeWidth="1.5"
                />
                <circle cx={issue.mapX} cy={issue.mapY - 14} r="4" fill="white" />
              </g>
            )}
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(300, 248)">
        <rect x="0" y="0" width="110" height="26" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="1" />
        <circle cx="12" cy="13" r="4" fill="#E24B4A" />
        <text x="20" y="16" fontSize="7" fill="#6B7280">Critical</text>
        <circle cx="52" cy="13" r="4" fill="#F5C518" />
        <text x="60" y="16" fontSize="7" fill="#6B7280">High</text>
        <circle cx="82" cy="13" r="4" fill="#378ADD" />
        <text x="90" y="16" fontSize="7" fill="#6B7280">Med</text>
      </g>
    </svg>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
interface HomeScreenProps {
  issues: Issue[];
  onNavigate: (screen: string, issueId?: string) => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
  upvoted: Set<string>;
  onUpvote: (id: string) => void;
}

export default function HomeScreen({ issues, onNavigate, onTabChange, activeTab, upvoted, onUpvote }: HomeScreenProps) {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const handlePinTap = (id: string) => {
    setSelectedIssueId(id);
    setBottomSheetExpanded(false);
  };

  const handleCardTap = (id: string) => {
    onNavigate('issueDetail', id);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = startY.current - e.touches[0].clientY;
    if (delta > 60) setBottomSheetExpanded(true);
    if (delta < -60) setBottomSheetExpanded(false);
  };

  const selectedIssue = issues.find((i) => i.id === selectedIssueId);

  return (
    <div className="w-full h-full flex flex-col bg-cb-cream">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-cb-navy px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-cb-primary flex items-center justify-center text-white font-bold text-[10px]">
            CB
          </div>
          <span className="text-white font-semibold text-[13px]">CivicBridge</span>
        </div>
        <div className="relative">
          <Bell className="w-5 h-5 text-white/70" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-cb-primary rounded-full text-white text-[9px] font-bold flex items-center justify-center">
            3
          </div>
        </div>
      </div>

      {/* Location Bar */}
      <div className="bg-cb-navy-light px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <MapPin className="w-4 h-4 text-cb-info" />
            <div className="absolute top-0 left-0 w-2 h-2 bg-cb-info rounded-full animate-ping" />
          </div>
          <span className="text-white/90 text-[13px] font-medium">Andheri West, Mumbai</span>
        </div>
        <span className="text-cb-amber text-[12px] font-semibold">{issues.length} issues nearby</span>
      </div>

      {/* Map Section */}
      <div className="relative h-[45%] bg-white">
        <MapSVG issues={issues} onPinTap={handlePinTap} />
      </div>

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="flex-1 bg-white rounded-t-[20px] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] -mt-4 relative z-10 flex flex-col overflow-hidden"
      >
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-8 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-[13px] font-semibold text-gray-800">Issues near you</span>
          <button
            onClick={() => setBottomSheetExpanded(!bottomSheetExpanded)}
            className="text-gray-400 transition-transform duration-300"
          >
            <ChevronUp className={`w-5 h-5 transition-transform duration-300 ${bottomSheetExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Pin detail preview */}
        <div className="px-4 pb-2">
          {selectedIssue && !bottomSheetExpanded && (
            <div className={`rounded-xl border-l-4 ${severityBorder(selectedIssue.severity)} bg-gray-50 p-3 transition-all duration-300`}>
              <div className="flex items-start gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${severityColor(selectedIssue.severity)}15` }}
                >
                  <IssueIcon type={selectedIssue.icon} className="w-4 h-4" style={{ color: severityColor(selectedIssue.severity) }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-800 truncate">{selectedIssue.title}</p>
                  <p className="text-[11px] text-gray-500">{selectedIssue.location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${severityBg(selectedIssue.severity)}`}>
                      {selectedIssue.severity}
                    </span>
                    <span className="text-[10px] text-gray-400">{selectedIssue.days} days ago</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCardTap(selectedIssue.id)}
                  className="text-[11px] text-cb-primary font-semibold hover:text-cb-primary/80 transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {issues.map((issue, idx) => (
            <div
              key={issue.id}
              onClick={() => handleCardTap(issue.id)}
              className={`stagger-child rounded-xl border-l-4 ${severityBorder(issue.severity)} bg-white border border-gray-100 shadow-card p-3 btn-tap cursor-pointer`}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${severityColor(issue.severity)}15` }}
                >
                  <IssueIcon type={issue.icon} className="w-4.5 h-4.5" style={{ color: severityColor(issue.severity) }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-800 leading-snug">{issue.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{issue.location} · {issue.distance}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${severityBg(issue.severity)}`}>
                      {issue.severity}
                    </span>
                    <span className="text-[10px] text-gray-400">{issue.days} days ago</span>
                    <span className="text-[10px] text-gray-400">{issue.complaints} complaints</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpvote(issue.id);
                  }}
                  className={`flex flex-col items-center gap-0.5 min-w-[36px] transition-colors duration-200 ${
                    upvoted.has(issue.id) ? 'text-cb-primary' : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-[10px] font-bold">
                    {issue.upvotes + (upvoted.has(issue.id) ? 1 : 0)}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-100 px-2 py-2 flex items-center justify-around z-20">
        {[
          { key: 'map', icon: Home, label: 'Map' },
          { key: 'ai', icon: Sparkles, label: 'AI Priority' },
          { key: 'report', icon: PlusCircle, label: 'Report' },
          { key: 'profile', icon: User, label: 'Profile' },
        ].map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[60px] btn-tap transition-colors duration-200"
            >
              <item.icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-cb-primary' : 'text-gray-400'}`} />
              <span className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-cb-primary' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
