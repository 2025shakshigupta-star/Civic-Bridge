import { useEffect, useState } from 'react';

interface HeroScreenProps {
  onGetStarted: () => void;
  onSeeLive: () => void;
}

export default function HeroScreen({ onGetStarted, onSeeLive }: HeroScreenProps) {
  const [ticker, setTicker] = useState(2841);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((t) => t + Math.floor(Math.random() * 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-cb-navy overflow-hidden flex flex-col">
      {/* Animated Road Scene */}
      <div className="absolute inset-0">
        {/* Sky / gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A] via-[#111d2e] to-[#152235]" />

        {/* City skyline */}
        <svg className="absolute bottom-[28%] left-0 w-full h-[140px]" viewBox="0 0 420 140" preserveAspectRatio="none">
          <path d="M0,140 L0,80 L20,80 L20,60 L40,60 L40,90 L55,90 L55,40 L75,40 L75,100 L90,100 L90,55 L110,55 L110,85 L130,85 L130,35 L150,35 L150,75 L165,75 L165,50 L185,50 L185,95 L205,95 L205,45 L225,45 L225,80 L245,80 L245,60 L265,60 L265,100 L285,100 L285,55 L305,55 L305,85 L325,85 L325,40 L345,40 L345,90 L365,90 L365,65 L385,65 L385,105 L405,105 L405,70 L420,70 L420,140 Z" fill="#0a1420" />
          {/* Windows */}
          {Array.from({ length: 30 }).map((_, i) => (
            <rect
              key={i}
              x={10 + Math.random() * 380}
              y={50 + Math.random() * 60}
              width={4}
              height={4}
              fill="#F5C518"
              className="window-flicker"
              style={{ '--delay': `${Math.random() * 3}s` } as React.CSSProperties}
              opacity={0.7}
            />
          ))}
        </svg>

        {/* Fog/haze overlay */}
        <div className="absolute bottom-[20%] left-0 w-full h-[60px] bg-gradient-to-t from-[#152235]/80 to-transparent backdrop-blur-[2px] opacity-60" />

        {/* Road */}
        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-[#1a1a2e]">
          {/* Road divider lines */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] flex items-center">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-[20px] h-[2px] bg-[#F5C518]/50 mx-[12px]" />
            ))}
          </div>
        </div>

        {/* Cars */}
        <div className="absolute bottom-[8%] left-0 w-full overflow-hidden">
          <svg className="w-[420px] h-[40px]" viewBox="0 0 420 40">
            {/* Car 1 */}
            <g className="car-1">
              <rect x="0" y="18" width="36" height="12" rx="3" fill="#E24B4A" />
              <rect x="6" y="12" width="18" height="8" rx="2" fill="#E24B4A" />
              <circle cx="8" cy="30" r="4" fill="#333" />
              <circle cx="28" cy="30" r="4" fill="#333" />
              <rect x="34" y="20" width="6" height="4" fill="#F5C518" />
            </g>
            {/* Car 2 */}
            <g className="car-2">
              <rect x="0" y="18" width="32" height="10" rx="3" fill="#378ADD" />
              <rect x="4" y="12" width="16" height="8" rx="2" fill="#378ADD" />
              <circle cx="7" cy="28" r="3" fill="#333" />
              <circle cx="25" cy="28" r="3" fill="#333" />
              <rect x="30" y="20" width="5" height="3" fill="#F5C518" />
            </g>
            {/* Car 3 */}
            <g className="car-3">
              <rect x="0" y="20" width="40" height="14" rx="3" fill="#1D9E75" />
              <rect x="8" y="14" width="20" height="8" rx="2" fill="#1D9E75" />
              <circle cx="9" cy="34" r="4" fill="#333" />
              <circle cx="31" cy="34" r="4" fill="#333" />
              <rect x="38" y="22" width="6" height="4" fill="#F5C518" />
            </g>
            {/* Car 4 reverse */}
            <g className="car-4">
              <rect x="0" y="16" width="34" height="12" rx="3" fill="#F5C518" />
              <rect x="5" y="10" width="17" height="8" rx="2" fill="#F5C518" />
              <circle cx="7" cy="28" r="3.5" fill="#333" />
              <circle cx="26" cy="28" r="3.5" fill="#333" />
              <rect x="0" y="18" width="5" height="4" fill="#fff" />
            </g>
          </svg>
        </div>
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col h-full px-6 pt-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cb-primary flex items-center justify-center text-white font-bold text-xs">
              CB
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">CivicBridge</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1">
            <div className="w-2 h-2 rounded-full bg-cb-primary pulse-live" />
            <span className="text-white text-[10px] font-medium uppercase tracking-wide">LIVE</span>
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center mt-4">
          <h1 className="text-white text-[32px] font-extrabold leading-[1.15] stagger-child">
            Roads are broken.
            <br />
            We <span className="text-cb-primary">fix</span> that.
          </h1>

          <p className="text-white/60 text-[15px] mt-4 leading-relaxed max-w-[320px] stagger-child">
            Report potholes, flooding, broken lights — track them until they&apos;re resolved. Powered by AI.
          </p>

          {/* Stat ticker */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 stagger-child">
            <div className="text-cb-primary font-bold text-[15px] tabular-nums">
              {ticker.toLocaleString()}
            </div>
            <div className="text-white/60 text-[11px] font-medium">issues resolved this month across India</div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col w-full gap-3 mt-8 stagger-child">
            <button
              onClick={onGetStarted}
              className="w-full py-3.5 rounded-pill bg-cb-primary text-white font-semibold text-[15px] shadow-lg shadow-cb-primary/20 btn-hover"
            >
              Get started free
            </button>
            <button
              onClick={onSeeLive}
              className="w-full py-3.5 rounded-pill border border-white/30 text-white font-semibold text-[15px] bg-white/5 backdrop-blur-sm btn-hover"
            >
              See live issues near me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
