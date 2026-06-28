import { useState } from 'react';
import { ArrowLeft, Share2, MapPin, AlertTriangle, Sparkles, Link2, MessageSquare, Check } from 'lucide-react';
import { type Issue } from './HomeScreen';

interface IssueDetailScreenProps {
  issueId: string;
  issues: Issue[];
  onBack: () => void;
  upvoted: Set<string>;
  onUpvote: (id: string) => void;
}

export default function IssueDetailScreen({ issueId, issues, onBack, upvoted, onUpvote }: IssueDetailScreenProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const issue = issues.find((i) => i.id === issueId) || issues[0];
  const color =
    issue.severity === 'Critical' ? '#E24B4A' :
    issue.severity === 'High' ? '#F5C518' :
    issue.severity === 'Medium' ? '#378ADD' :
    '#1D9E75';

  const severityBgStyle =
    issue.severity === 'Critical' ? 'bg-cb-primary/10 text-cb-primary' :
    issue.severity === 'High' ? 'bg-cb-amber/10 text-cb-amber' :
    issue.severity === 'Medium' ? 'bg-cb-info/10 text-cb-info' :
    'bg-cb-success/10 text-cb-success';

  const complaintPercent = Math.min((issue.complaints / 150) * 100, 100);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?issueId=${issue.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  const handleShareWhatsApp = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?issueId=${issue.id}`;
    const text = `Help report and fix this civic issue on CivicBridge: "${issue.title}" at ${issue.location}. Check it out here: ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareModal(false);
  };

  return (
    <div className="w-full h-full bg-cb-cream flex flex-col overflow-hidden screen-slide-right relative">

      {/* Header */}
      <div className="bg-cb-navy px-4 py-3 flex items-center justify-between z-10">
        <button onClick={onBack} className="text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-semibold text-[15px]">Issue Detail</span>
        <button onClick={() => setShowShareModal(true)} className="text-white/80 hover:text-white transition-colors btn-tap">
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
            
            <circle cx={issue.mapX} cy={issue.mapY} r="16" fill={color} opacity="0.2">
              <animate attributeName="r" values="12;22;12" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2.4s" repeatCount="indefinite" />
            </circle>

            {issue.photo ? (
              <g>
                <path d={`M ${issue.mapX} ${issue.mapY} L ${issue.mapX - 4} ${issue.mapY - 12} L ${issue.mapX + 4} ${issue.mapY - 12} Z`} fill={color} />
                <rect x={issue.mapX - 22} y={issue.mapY - 44} width="44" height="34" rx="4" fill="white" stroke={color} strokeWidth="2" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" />
                <defs>
                  <clipPath id={`clip-detail-${issue.id}`}>
                    <rect x={issue.mapX - 20} y={issue.mapY - 42} width="40" height="30" rx="2" />
                  </clipPath>
                </defs>
                <image
                  href={issue.photo}
                  x={issue.mapX - 20}
                  y={issue.mapY - 42}
                  width="40"
                  height="30"
                  clipPath={`url(#clip-detail-${issue.id})`}
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
          </svg>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Title & badge */}
          <div>
            <h1 className="text-[18px] font-extrabold text-gray-900 leading-snug">{issue.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${severityBgStyle}`}>
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

          {/* Dynamic Photo Display */}
          {issue.photo && (
            <div className="bg-white rounded-card p-2 shadow-card overflow-hidden border border-gray-100">
              <img
                src={issue.photo}
                alt={issue.title}
                className="w-full h-[220px] object-cover rounded-xl"
              />
            </div>
          )}

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
              onClick={() => setShowShareModal(true)}
              className="flex-1 py-3.5 rounded-pill bg-cb-primary text-white font-semibold text-[14px] shadow-lg shadow-cb-primary/20 btn-tap hover:shadow-cb-primary/30 transition-shadow"
            >
              Share this issue
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal Bottom Sheet */}
      {showShareModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in">
          <div className="w-full bg-white rounded-t-[24px] p-6 space-y-4 shadow-2xl max-w-[420px] screen-slide-up">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-gray-900">Share Civic Issue</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 text-[13px] font-semibold"
              >
                Close
              </button>
            </div>
            
            <p className="text-[12px] text-gray-500 leading-normal">
              Share this road issue with your neighbors or local ward officers to gather more upvotes.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors btn-tap text-gray-700 font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-cb-success mb-1" />
                    <span className="text-[12px] text-cb-success">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-5 h-5 text-gray-500 mb-1" />
                    <span className="text-[12px]">Copy Link</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleShareWhatsApp}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors btn-tap text-gray-700 font-semibold"
              >
                <MessageSquare className="w-5 h-5 text-cb-success mb-1" />
                <span className="text-[12px]">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
