import { useState, useRef } from 'react';
import { ArrowLeft, Camera, MapPin, ArrowRight } from 'lucide-react';

const ISSUE_TYPES = [
  { id: 'pothole', label: 'Pothole / Road damage', icon: '🕳️' },
  { id: 'streetlight', label: 'Streetlight out', icon: '💡' },
  { id: 'flooding', label: 'Flooding / Waterlogging', icon: '🌊' },
  { id: 'garbage', label: 'Garbage dumping', icon: '🗑️' },
  { id: 'barrier', label: 'Missing barrier / divider', icon: '🚧' },
  { id: 'other', label: 'Other', icon: '❓' },
];

const SEVERITY_OPTIONS = ['Minor', 'Moderate', 'Severe', 'Critical'] as const;

interface ReportScreenProps {
  onClose: () => void;
  onNavigate: (screen: string, issueId?: string) => void;
}

export default function ReportScreen({ onClose, onNavigate }: ReportScreenProps) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState('Andheri West, SV Road');
  const [severity, setSeverity] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber] = useState(() => `CB-2026-${String(Math.floor(Math.random() * 9000) + 1000).slice(-4)}`);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleTrack = () => {
    onNavigate('issueDetail', '3');
  };

  const handleReportAnother = () => {
    setStep(1);
    setSelectedType(null);
    setDescription('');
    setPhoto(null);
    setLocation('Andheri West, SV Road');
    setSeverity(null);
    setSubmitted(false);
  };

  // ─── Success Screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="w-full h-full bg-cb-cream flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full bg-cb-success/10 flex items-center justify-center mb-6 scale-in-spring">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline className="checkmark-draw" points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="text-[24px] font-extrabold text-gray-900 stagger-child">
          Issue reported!
        </h2>

        <p className="text-[14px] text-gray-500 mt-1 stagger-child">
          Ticket number: <span className="font-bold text-cb-navy">{ticketNumber}</span>
        </p>

        <p className="text-[13px] text-gray-500 text-center mt-3 leading-relaxed stagger-child">
          Your report is now live. We&apos;ll notify you when the status changes.
        </p>

        <div className="w-full flex flex-col gap-3 mt-8 stagger-child">
          <button
            onClick={handleTrack}
            className="w-full py-3.5 rounded-pill bg-cb-primary text-white font-semibold text-[15px] shadow-lg shadow-cb-primary/20 btn-hover"
          >
            Track this issue
          </button>
          <button
            onClick={handleReportAnother}
            className="w-full py-3.5 rounded-pill border border-gray-300 text-gray-700 font-semibold text-[15px] btn-hover"
          >
            Report another
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Form ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full bg-cb-cream flex flex-col">
      {/* Header */}
      <div className="bg-cb-navy px-4 py-3 flex items-center gap-3">
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-semibold text-[15px]">Report Issue</span>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold text-gray-700">Step {step} of 3</span>
          <span className="text-[11px] text-gray-400">
            {step === 1 ? 'Select issue type' : step === 2 ? 'Describe the issue' : 'Review & submit'}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-cb-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="step-animate">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {ISSUE_TYPES.map((type) => {
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex flex-col items-center gap-2 py-5 px-3 rounded-xl border-2 transition-all duration-200 btn-tap ${
                      isSelected
                        ? 'border-cb-primary bg-cb-primary/5 scale-[1.02]'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <span className="text-[28px]">{type.icon}</span>
                    <span className={`text-[12px] font-semibold text-center leading-tight ${isSelected ? 'text-cb-primary' : 'text-gray-700'}`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Photo upload */}
              <div>
                <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Photo</label>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-[140px] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  {photo ? (
                    <img src={photo} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-gray-400" />
                      <span className="text-[13px] text-gray-400 font-medium">Tap to upload photo</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe how severe it is..."
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] focus:outline-none focus:border-cb-primary focus:ring-1 focus:ring-cb-primary/20 resize-none transition-all duration-200"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Location</label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 h-12 rounded-xl border border-gray-200 px-4 bg-white">
                    <MapPin className="w-4 h-4 text-cb-info" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1 text-[14px] focus:outline-none"
                    />
                  </div>
                  <button className="h-12 px-3 rounded-xl border border-gray-200 text-[12px] font-medium text-cb-primary bg-white whitespace-nowrap hover:bg-cb-primary/5 transition-colors duration-200">
                    Detect
                  </button>
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Severity</label>
                <div className="flex gap-2 flex-wrap">
                  {SEVERITY_OPTIONS.map((s) => {
                    const isSelected = severity === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSeverity(s)}
                        className={`px-4 py-2 rounded-pill text-[13px] font-semibold transition-all duration-200 btn-tap ${
                          isSelected
                            ? 'bg-cb-primary text-white shadow-md shadow-cb-primary/20'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-white rounded-card p-4 shadow-card space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[20px]">
                    {ISSUE_TYPES.find((t) => t.id === selectedType)?.icon}
                  </span>
                  <span className="text-[14px] font-bold text-gray-800">
                    {ISSUE_TYPES.find((t) => t.id === selectedType)?.label}
                  </span>
                </div>
                {photo && (
                  <img src={photo} alt="Uploaded" className="w-full h-[120px] object-cover rounded-xl" />
                )}
                <div>
                  <span className="text-[12px] text-gray-400 font-medium">Description</span>
                  <p className="text-[14px] text-gray-700 mt-0.5">{description || 'No description provided'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cb-info" />
                  <span className="text-[13px] text-gray-700">{location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-400 font-medium">Severity:</span>
                  <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${
                    severity === 'Critical' ? 'bg-cb-primary/10 text-cb-primary' :
                    severity === 'Severe' ? 'bg-cb-amber/10 text-cb-amber' :
                    severity === 'Moderate' ? 'bg-cb-info/10 text-cb-info' :
                    'bg-cb-success/10 text-cb-success'
                  }`}>
                    {severity}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-4 py-4 bg-white border-t border-gray-100">
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3.5 rounded-pill border border-gray-300 text-gray-700 font-semibold text-[15px] btn-tap hover:bg-gray-50 transition-colors duration-200"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step === 3) {
                handleSubmit();
              } else {
                setStep(step + 1);
              }
            }}
            disabled={
              (step === 1 && !selectedType) ||
              (step === 2 && (!description || !severity)) ||
              (step === 3 && false)
            }
            className={`flex-1 py-3.5 rounded-pill font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 btn-tap ${
              (step === 1 && !selectedType) || (step === 2 && (!description || !severity))
                ? 'bg-gray-200 text-gray-400'
                : 'bg-cb-primary text-white shadow-lg shadow-cb-primary/20 hover:shadow-cb-primary/30'
            }`}
          >
            {step === 3 ? 'Submit report' : 'Continue'}
            {step !== 3 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
