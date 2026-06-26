import { ArrowLeft, Share2, MapPin, AlertTriangle, Sparkles } from 'lucide-react';
import { type Issue, ISSUES } from './HomeScreen';

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

interface IssueDetailScreenProps {
  issueId: string;
  onBack: () => void;
  upvoted: Set<string>;
  onUpvote: (id: string) => void;
}

export default function IssueDetailScreen({ issueId, onBack, upvoted, onUpvote }: IssueDetailScreenProps) {
  const issue = ISSUES.find((i) => i.id === issueId) || ISSUES[0];
  const color = severityColor(issue.severity);
  const complaintPercent = Math.min((issue.complaints / 150) * 100, 100);

  return (
    <div className="w-full h-full bg-cb-cream flex flex-col overflow-hidden screen-slide-right">

      {/* Header */}
      <div className="bg-cb-navy px-4 py-3 flex items-center justify-between z-10">
        <button onClick={onBack} className="text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-semibold text-[15px]">Issue Detail</span>
        <button className="text-white/80 hover:text-white transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Mini Map */}
        <div className="h-[180px] bg-white relative overflow-hidden">
          <svg viewBox="0 0 420 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <rect width="420" height="180" fill="#ECEFF1" />
            <line x1="0" y1="90" x2="420" y2="90" stroke="#CBD5E1" strokeWidth="12" />
            <line x1="210" y1="0" x2="210" y2="180" stroke="#CBD5E1" strokeWidth="12" />
            <path
              d={`M${issue.mapX},${issue.mapY - 18} 
                  C${issue.mapX - 10},${issue.mapY - 18} ${issue.mapX - 10},${issue.mapY - 6} ${issue.mapX},${issue.mapY + 6}
                  C${issue.mapX + 10},${issue.mapY - 6} ${issue.mapX + 10},${issue.mapY - 18} ${issue.mapX},${issue.mapY - 18}Z`}
              fill={color}
              stroke="white"
              strokeWidth="1.5"
            />
            <circle cx={issue.mapX} cy={issue.mapY - 14} r="4" fill="white" />
            <circle cx={issue.mapX} cy={issue.mapY} r="22" fill={color} opacity="0.2">
              <animate attributeName="r" values="18;28;18" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Title & badge */}
          <div>
            <h1 className="text-[18px] font-extrabold text-gray-900 leading-snug">{issue.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${severityBg(issue.severity)}`}>
                {issue.severity}
              </span>
              <span className="text-[11px] text-gray-400">Priority {issue.priorityScore}/100</span>
            </div>
          </div>

          {/* Location row */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-[13px] font-medium">{issue.location}</span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cb-primary" />
            <span className="text-[13px] text-gray-600">
              Reported {issue.days} days ago · Still unresolved
            </span>
          </div>

          {/* Description */}
          <p className="text-[14px] text-gray-600 leading-relaxed">{issue.description}</p>

          {/* Complaint Meter */}
          <div className="bg-white rounded-card p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-cb-primary" />
              <span className="text-[13px] font-bold text-gray-800">Complaint Meter</span>
            </div>
            <p className="text-[12px] text-gray-500 mb-2">
              {issue.complaints} people have reported this issue
            </p>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cb-primary to-cb-amber progress-anim"
                style={{ width: `${complaintPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-gray-400">Low concern</span>
              <span className="text-[10px] font-semibold text-cb-primary">High community concern</span>
            </div>
          </div>

          {/* AI Analysis Card */}
          <div className="bg-cb-navy rounded-card p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cb-amber" />
              <span className="text-[13px] font-bold">AI Assessment</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white/60">Priority Score</span>
                <span className="text-[14px] font-bold text-cb-primary">{issue.priorityScore}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white/60">Severity Reason</span>
                <span className="text-[12px] text-white/90 max-w-[180px] text-right">{issue.aiReason}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white/60">Department</span>
                <span className="text-[12px] text-white/90 text-right">{issue.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white/60">Est. Fix Time</span>
                <span className="text-[12px] text-cb-amber text-right">7-14 days if reported</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {issue.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 pb-4">
            <button
              onClick={() => onUpvote(issue.id)}
              className={`flex-1 py-3.5 rounded-pill border-2 font-semibold text-[14px] transition-all duration-200 btn-tap ${
                upvoted.has(issue.id)
                  ? 'border-cb-primary bg-cb-primary text-white'
                  : 'border-cb-primary text-cb-primary hover:bg-cb-primary/5'
              }`}
            >
              {upvoted.has(issue.id) ? 'You are affected' : "I'm also affected"}
            </button>
            <button
              className="flex-1 py-3.5 rounded-pill bg-cb-primary text-white font-semibold text-[14px] shadow-lg shadow-cb-primary/20 btn-tap hover:shadow-cb-primary/30 transition-shadow"
            >
              Share this issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
