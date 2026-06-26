import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Sparkles, ChevronDown, ChevronUp, Send, Bot, User, AlertCircle } from 'lucide-react';
import { ISSUES } from './HomeScreen';

interface AIScreenProps {
  onBack: () => void;
  onNavigate: (screen: string, issueId?: string) => void;
}

const rankedIssues = [...ISSUES].sort((a, b) => b.priorityScore - a.priorityScore);

const rankBadge = (rank: number) => {
  if (rank === 1) return 'bg-cb-primary text-white';
  if (rank === 2) return 'bg-cb-amber text-white';
  if (rank === 3) return 'bg-cb-info text-white';
  return 'bg-gray-200 text-gray-500';
};

const rankBarColor = (rank: number) => {
  if (rank === 1) return 'bg-cb-primary';
  if (rank === 2) return 'bg-cb-amber';
  if (rank === 3) return 'bg-cb-info';
  return 'bg-gray-300';
};

const severityPill = (s: string) => {
  switch (s) {
    case 'Critical': return 'bg-cb-primary/10 text-cb-primary';
    case 'High': return 'bg-cb-amber/10 text-cb-amber';
    case 'Medium': return 'bg-cb-info/10 text-cb-info';
    case 'Low': return 'bg-cb-success/10 text-cb-success';
    default: return 'bg-gray-100 text-gray-500';
  }
};

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  error?: boolean;
}

const QUICK_CHIPS = [
  'Which issue is most dangerous right now?',
  'What should BMC fix first?',
  'Any new issues reported today?',
  'Which issues affect school routes?',
];

const callGeminiAI = async (userMessage: string) => {
  const GEMINI_API_KEY = "AIzaSyD0dbPyq74tDPTQ1ky-xK8hTla6OBhLiLA";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are the AI assistant for CivicBridge,
                a civic road issue reporting app in Mumbai India.

                Current issues data:
                1. Deep pothole SV Road — 87 complaints, 12 days, Critical
                2. Streetlights out Andheri flyover — 43 complaints, 8 days, High
                3. Waterlogging Lokhandwala — 121 complaints, 3 days, Critical
                4. Road cracking Oshiwara — 29 complaints, 20 days, Medium
                5. Garbage JP Road — 15 complaints, 5 days, Low
                6. Missing divider WEH — 56 complaints, 7 days, High

                User asked: ${userMessage}

                Reply in 3-4 lines max. Be specific with numbers.`
              }
            ]
          }
        ]
      })
    }
  );
  const data = await response.json();

  if (data.candidates && data.candidates[0]) {
    return data.candidates[0].content.parts[0].text;
  } else {
    return "Could not get response. Please try again.";
  }
};

export default function AIScreen({ onBack, onNavigate }: AIScreenProps) {
  const [showFormula, setShowFormula] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    const userMsg = text.trim();
    if (!userMsg) return;

    setMessages((m) => [...m, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    setApiError(false);

    try {
      const aiText = await callGeminiAI(userMsg);
      setMessages((m) => [...m, { role: 'ai', text: aiText }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'ai',
          text: 'AI service is temporarily unavailable. Please check your API key and try again.',
          error: true,
        },
      ]);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-cb-cream flex flex-col">
      {/* Header */}
      <div className="bg-cb-navy px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cb-amber" />
            <span className="text-white font-semibold text-[15px]">AI Priority Engine</span>
          </div>
          <p className="text-white/50 text-[11px] mt-0.5">Issues ranked by risk, severity & community reports</p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Collapsible formula */}
        <div className="px-4 py-3">
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="w-full flex items-center justify-between py-2"
          >
            <span className="text-[13px] font-semibold text-gray-700">How priority is calculated</span>
            {showFormula ? (
              <ChevronUp className="w-4 h-4 text-gray-400 transition-transform duration-200" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200" />
            )}
          </button>
          <div className={`collapsible-enter ${showFormula ? 'open' : ''}`}>
            <div className="bg-white rounded-card p-3 shadow-card text-[12px] text-gray-600 leading-relaxed">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-cb-primary/10 text-cb-primary px-2 py-0.5 rounded-md font-bold">40%</span>
                <span>Complaint Volume</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-cb-amber/10 text-cb-amber px-2 py-0.5 rounded-md font-bold">30%</span>
                <span>Days Unresolved</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-cb-info/10 text-cb-info px-2 py-0.5 rounded-md font-bold">20%</span>
                <span>Severity Type</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-bold">10%</span>
                <span>Location Risk</span>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-400">
                = Priority Score (0-100)
              </div>
            </div>
          </div>
        </div>

        {/* Live Priority Ranking */}
        <div className="px-4 pb-3">
          <h3 className="text-[13px] font-semibold text-gray-700 mb-2">Live Priority Ranking</h3>
          <div className="space-y-2.5">
            {rankedIssues.map((issue, idx) => {
              const rank = idx + 1;
              return (
                <div
                  key={issue.id}
                  onClick={() => onNavigate('issueDetail', issue.id)}
                  className="stagger-child bg-white rounded-card p-3 shadow-card flex items-center gap-3 cursor-pointer btn-tap"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${rankBadge(rank)}`}>
                    {rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-gray-800 truncate">{issue.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${severityPill(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      <span className="text-[10px] text-gray-400">{issue.priorityScore}/100</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${rankBarColor(rank)}`}
                        style={{ width: `${issue.priorityScore}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{issue.aiReason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Chat */}
        <div className="px-4 pb-3">
          <h3 className="text-[13px] font-semibold text-gray-700 mb-2">AI Assistant</h3>

          {apiError && (
            <div className="bg-cb-amber/10 border border-cb-amber/20 rounded-card p-3 mb-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-cb-amber flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-cb-amber/80">
                AI service error. Please check your API key and try again.
              </p>
            </div>
          )}

          {/* Chat messages */}
          <div ref={scrollRef} className="space-y-3 mb-3 max-h-[300px] overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-msg-in flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-cb-primary' : 'bg-cb-navy'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
                <div className={`rounded-xl px-3 py-2 max-w-[75%] text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cb-primary text-white'
                    : msg.error
                    ? 'bg-red-50 text-red-700 border border-red-100'
                    : 'bg-white text-gray-700 border border-gray-100 shadow-card'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-cb-navy flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-card">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick chips */}
      <div className="px-4 py-2 bg-white border-t border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-gray-100 text-[11px] font-medium text-gray-600 hover:bg-gray-200 transition-colors duration-200"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about any issue..."
            className="flex-1 h-11 rounded-full border border-gray-200 px-4 text-[14px] focus:outline-none focus:border-cb-primary focus:ring-1 focus:ring-cb-primary/20 transition-all duration-200"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 btn-tap ${
              input.trim() && !loading
                ? 'bg-cb-primary text-white hover:bg-cb-primary/90'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
