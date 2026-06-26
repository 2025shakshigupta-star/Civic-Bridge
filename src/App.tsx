import { useState, useEffect, useCallback, useRef } from 'react';
import HeroScreen from './components/HeroScreen';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import IssueDetailScreen from './components/IssueDetailScreen';
import ReportScreen from './components/ReportScreen';
import AIScreen from './components/AIScreen';
import ProfileScreen from './components/ProfileScreen';

type Screen = 'hero' | 'auth' | 'home' | 'issueDetail' | 'report' | 'ai' | 'profile';

export default function App() {
  const [screen, setScreen] = useState<Screen>('hero');
  const [prevScreen, setPrevScreen] = useState<Screen | null>(null);
  const [issueId, setIssueId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('map');
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [nextScreen, setNextScreen] = useState<Screen | null>(null);
  const [screenAnim, setScreenAnim] = useState('screen-fade-in');
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cb_upvoted');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setUpvoted(new Set(parsed));
      }
      const auth = localStorage.getItem('cb_authenticated');
      if (auth === 'true') setIsAuthenticated(true);
    } catch { /* ignore */ }
  }, []);

  // Persist upvotes
  useEffect(() => {
    localStorage.setItem('cb_upvoted', JSON.stringify([...upvoted]));
  }, [upvoted]);

  const navigate = useCallback((next: Screen, id?: string) => {
    if (exiting) return;
    setPrevScreen(screen);
    setNextScreen(next);
    setExiting(true);
    if (id) setIssueId(id);

    // Choose exit animation based on current screen
    let exitAnim = 'screen-fade-in';
    if (screen === 'hero') exitAnim = 'screen-slide-out-up';
    else if (screen === 'home') exitAnim = 'screen-slide-out-left';
    else exitAnim = 'screen-fade-in';
    setScreenAnim(exitAnim);

    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      setScreen(next);
      let enterAnim = 'screen-fade-in';
      if (next === 'auth') enterAnim = 'screen-fade-in-up-large';
      else if (next === 'issueDetail') enterAnim = 'screen-slide-right';
      else if (next === 'report') enterAnim = 'screen-slide-up';
      else if (next === 'home') enterAnim = 'screen-fade-in';
      else if (next === 'ai' || next === 'profile') enterAnim = 'screen-fade-in-up';
      else if (next === 'hero') enterAnim = 'screen-fade-in';
      setScreenAnim(enterAnim);
      setExiting(false);
      setNextScreen(null);
    }, 300);
  }, [screen, exiting]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    if (tab === 'map') navigate('home');
    else if (tab === 'ai') navigate('ai');
    else if (tab === 'report') navigate('report');
    else if (tab === 'profile') navigate('profile');
  }, [navigate]);

  const handleUpvote = useCallback((id: string) => {
    setUpvoted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setIsAuthenticated(true);
    localStorage.setItem('cb_authenticated', 'true');
    navigate('home');
    setActiveTab('map');
  }, [navigate]);

  const handleSignOut = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('cb_authenticated');
    setUpvoted(new Set());
    localStorage.removeItem('cb_upvoted');
    navigate('hero');
  }, [navigate]);

  const handleBack = useCallback(() => {
    if (prevScreen) {
      setScreen(prevScreen);
      setPrevScreen(null);
    } else {
      setScreen('home');
    }
    setActiveTab('map');
    setScreenAnim('screen-fade-in');
  }, [prevScreen]);

  // Render current screen
  const renderScreen = () => {
    switch (screen) {
      case 'hero':
        return (
          <div className={`absolute inset-0 ${screenAnim}`}>
            <HeroScreen
              onGetStarted={() => navigate(isAuthenticated ? 'home' : 'auth')}
              onSeeLive={() => navigate(isAuthenticated ? 'home' : 'auth')}
            />
          </div>
        );
      case 'auth':
        return (
          <div className={`absolute inset-0 ${screenAnim}`}>
            <AuthScreen
              onAuthSuccess={handleAuthSuccess}
              onBack={() => navigate('hero')}
            />
          </div>
        );
      case 'home':
        return (
          <div className={`absolute inset-0 ${screenAnim}`}>
            <HomeScreen
              onNavigate={navigate}
              onTabChange={handleTabChange}
              activeTab={activeTab}
              upvoted={upvoted}
              onUpvote={handleUpvote}
            />
          </div>
        );
      case 'issueDetail':
        return issueId ? (
          <div className={`absolute inset-0 z-10 ${screenAnim}`}>
            <IssueDetailScreen
              issueId={issueId}
              onBack={handleBack}
              upvoted={upvoted}
              onUpvote={handleUpvote}
            />
          </div>
        ) : null;
      case 'report':
        return (
          <div className={`absolute inset-0 z-10 ${screenAnim}`}>
            <ReportScreen
              onClose={handleBack}
              onNavigate={navigate}
            />
          </div>
        );
      case 'ai':
        return (
          <div className={`absolute inset-0 z-10 ${screenAnim}`}>
            <AIScreen
              onBack={handleBack}
              onNavigate={navigate}
            />
          </div>
        );
      case 'profile':
        return (
          <div className={`absolute inset-0 z-10 ${screenAnim}`}>
            <ProfileScreen
              onBack={handleBack}
              onSignOut={handleSignOut}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-0 md:p-4">
      <div className="w-full max-w-[420px] h-[100dvh] md:h-[850px] bg-cb-cream rounded-none md:rounded-[24px] overflow-hidden shadow-2xl relative isolate">
        {/* Exiting screen overlay */}
        {exiting && nextScreen && (
          <div className={`absolute inset-0 z-50 ${screenAnim}`}>
            {renderScreen()}
          </div>
        )}
        {/* Current screen */}
        {!exiting && renderScreen()}
      </div>
    </div>
  );
}
