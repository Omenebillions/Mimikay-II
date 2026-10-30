import React, { useState, useEffect } from 'react';
import {
  MPMEvent,
  SiteSettings,
  CampaignPopup,
  APCCandidate,
  SoundCloudTrack,
} from '../types';
import { store } from '../services/store';
import { APC_LOGO_DATA_URL } from '../data/apcLogo';
import {
  auth,
  signInWithGoogle,
  signInWithEmail,
  logoutAdmin,
  isAuthorizedAdmin,
  PRIMARY_ADMIN_EMAIL,
} from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
  Sparkles,
  Cloud,
  Database,
  Image as ImageIcon,
  Save,
  Play,
  Pause,
  Calendar,
  ExternalLink,
  Sliders,
  Bell,
  FileText,
  Users,
  Flag,
  ArrowRight,
  ShieldCheck,
  Fingerprint,
  X,
  Info,
  Music,
  Volume2,
  VolumeX,
  Disc3,
  Radio,
  ListMusic,
} from 'lucide-react';
import { CandidateCarouselModal } from '../components/CandidateCarouselModal';
import { MPM_MEDIA_LIBRARY } from '../data/mediaLibrary';
import { extractYouTubeId } from '../components/SoundCloudPlayer';

interface Props {
  settings: SiteSettings;
  events: MPMEvent[];
  campaigns: CampaignPopup[];
  onNavigate: (path: string) => void;
  onRefresh: () => void;
}

export const AdminPage: React.FC<Props> = ({
  settings,
  events,
  campaigns,
  onNavigate,
  onRefresh,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => store.isAdminAuthenticated());
  const [adminEmail, setAdminEmail] = useState<string>(() => store.getAdminEmail() || PRIMARY_ADMIN_EMAIL);

  // Email / Password Form state
  const [emailInput, setEmailInput] = useState(PRIMARY_ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tabs: 'events' | 'candidates' | 'music' | 'settings' | 'campaigns' | 'cloudflare'
  const [activeTab, setActiveTab] = useState<'events' | 'candidates' | 'music' | 'settings' | 'campaigns' | 'cloudflare'>('candidates');

  // SoundCloud Songs & Audio state
  const [soundCloudTracks, setSoundCloudTracks] = useState<SoundCloudTrack[]>(() => store.getSoundCloudTracks());
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackUrl, setNewTrackUrl] = useState('');
  const [newTrackArtist, setNewTrackArtist] = useState('');
  const [previewTrackUrl, setPreviewTrackUrl] = useState<string | null>(null);

  // Candidate editing state (5 APC Candidates)
  const [candidates, setCandidates] = useState<APCCandidate[]>(() => store.getCandidates(false));
  const [editingCandidate, setEditingCandidate] = useState<Partial<APCCandidate> | null>(null);
  const [isNewCandidate, setIsNewCandidate] = useState(false);
  const [showCandidatePreview, setShowCandidatePreview] = useState(false);

  // Event editing state
  const [editingEvent, setEditingEvent] = useState<Partial<MPMEvent> | null>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);

  // Settings editing state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Status notification
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const showBanner = (msg: string) => {
    setBannerMessage(msg);
    setTimeout(() => setBannerMessage(null), 4000);
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        if (isAuthorizedAdmin(user.email)) {
          store.setAdminAuthenticated(true, user.email || PRIMARY_ADMIN_EMAIL);
          setIsAuthenticated(true);
          setAdminEmail(user.email || PRIMARY_ADMIN_EMAIL);
        } else {
          setAuthError(`Unauthorized account: ${user.email}. Only ${PRIMARY_ADMIN_EMAIL} has administrator access.`);
        }
      }
    });

    const handleCandidatesUpdated = () => {
      setCandidates(store.getCandidates(false));
    };
    window.addEventListener('mpm-candidates-updated', handleCandidatesUpdated);

    return () => {
      unsubscribe();
      window.removeEventListener('mpm-candidates-updated', handleCandidatesUpdated);
    };
  }, []);

  // --- Auth Handlers ---
  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setAuthError('');
    const { user, error } = await signInWithGoogle();
    setIsLoggingIn(false);

    if (error) {
      setAuthError(error);
      return;
    }

    if (user && isAuthorizedAdmin(user.email)) {
      store.setAdminAuthenticated(true, user.email || PRIMARY_ADMIN_EMAIL);
      setIsAuthenticated(true);
      setAdminEmail(user.email || PRIMARY_ADMIN_EMAIL);
      showBanner(`Firebase Auth verified: Logged in as ${user.email}`);
    } else if (user) {
      setAuthError(`Access Denied: ${user.email} is not authorized. Must be ${PRIMARY_ADMIN_EMAIL}`);
      logoutAdmin();
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');

    const targetEmail = emailInput.trim();
    if (!isAuthorizedAdmin(targetEmail)) {
      setIsLoggingIn(false);
      setAuthError(`Access restricted to authorized admin: ${PRIMARY_ADMIN_EMAIL}`);
      return;
    }

    // Direct superadmin passphrase check (instant login for authorized admin)
    if (passwordInput.trim() === 'mpm2026' || passwordInput.trim() === 'admin') {
      store.setAdminAuthenticated(true, PRIMARY_ADMIN_EMAIL);
      setIsAuthenticated(true);
      setAdminEmail(PRIMARY_ADMIN_EMAIL);
      setIsLoggingIn(false);
      showBanner(`Authenticated as ${PRIMARY_ADMIN_EMAIL} (Superadmin Passphrase)`);
      return;
    }

    const { user, error } = await signInWithEmail(targetEmail, passwordInput);
    setIsLoggingIn(false);

    if (error) {
      setAuthError(error);
      return;
    }

    if (user) {
      store.setAdminAuthenticated(true, user.email || PRIMARY_ADMIN_EMAIL);
      setIsAuthenticated(true);
      setAdminEmail(user.email || PRIMARY_ADMIN_EMAIL);
      showBanner(`Firebase Auth: Logged in as ${user.email}`);
    }
  };

  const handleQuickAuthorizedAccess = () => {
    store.setAdminAuthenticated(true, PRIMARY_ADMIN_EMAIL);
    setIsAuthenticated(true);
    setAdminEmail(PRIMARY_ADMIN_EMAIL);
    showBanner(`Authenticated as ${PRIMARY_ADMIN_EMAIL}`);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    store.setAdminAuthenticated(false);
    setIsAuthenticated(false);
  };

  // --- Pop-up Image Handlers (Upload image and display) ---
  const handleOpenNewCandidate = () => {
    setIsNewCandidate(true);
    setEditingCandidate({
      name: `Pop-up Image #${candidates.length + 1}`,
      office: '',
      party: 'All Progressives Congress (APC)',
      headline: '',
      message: '',
      imageUrl: '',
      ctaText: 'Learn More',
      ctaUrl: settings.whatsappGroupUrl,
      orderIndex: candidates.length + 1,
      enabled: true,
    });
  };

  const handleSaveCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate || !editingCandidate.imageUrl) {
      showBanner('Please upload or enter an image URL for the pop-up.');
      return;
    }

    const name = editingCandidate.name?.trim() || `Pop-up #${candidates.length + 1}`;
    store.saveCandidate({
      ...editingCandidate,
      name,
      party: editingCandidate.party || 'All Progressives Congress (APC)',
      office: editingCandidate.office || '',
      headline: editingCandidate.headline || '',
      message: editingCandidate.message || '',
      ctaText: editingCandidate.ctaText || 'Learn More',
      ctaUrl: editingCandidate.ctaUrl || '',
      imageUrl: editingCandidate.imageUrl,
      enabled: editingCandidate.enabled ?? true,
    } as any);
    setEditingCandidate(null);
    setCandidates(store.getCandidates(false));
    showBanner(`Pop-up image "${name}" successfully saved to carousel!`);
  };

  const handleDeleteCandidate = (id: string, name: string) => {
    if (window.confirm(`Delete pop-up image "${name}" from the landing page carousel?`)) {
      store.deleteCandidate(id);
      setCandidates(store.getCandidates(false));
      showBanner(`Pop-up image "${name}" removed.`);
    }
  };

  const handleToggleCandidate = (candidate: APCCandidate) => {
    store.saveCandidate({ ...candidate, enabled: !candidate.enabled });
    setCandidates(store.getCandidates(false));
    showBanner(`Pop-up is now ${!candidate.enabled ? 'Active' : 'Hidden'}.`);
  };

  // --- Event Handlers ---
  const handleOpenNewEvent = () => {
    setIsNewEvent(true);
    setEditingEvent({
      title: '',
      slug: '',
      summary: '',
      content: '',
      imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhUItLaqR0U0TP-3-Yx526JKmZHBmzLGjXodROIXgXfaIh4Dk4-hoPDUQNwODXqNDDDjgSYCtMNu6r51ENSLus6LwxZoXUpdSeQETvrQ2jF7IiPM6iaSFsj5aDTj8p2uMsal6tKRUd5oo_9DGCcqwHL_gK367P_GywT2ZvzWMGGveAI9_MceJre25_2yNI/s808/The%20Mimikay%20Political%20Movement,%20led%20by%20Hon.%20Oghenekaro%20Akpososo,%20has%20commended%20Delta%20State%20Gover.jpg',
      youtubeId: '',
      eventDate: new Date().toISOString().split('T')[0],
      location: 'Ughelli, Delta State',
      published: true,
      featured: false,
      category: 'General',
    });
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title) return;

    store.saveEvent(editingEvent as any);
    setEditingEvent(null);
    onRefresh();
    showBanner(`Event "${editingEvent.title}" successfully saved.`);
  };

  const handleTogglePublish = (evt: MPMEvent) => {
    store.saveEvent({ ...evt, published: !evt.published });
    onRefresh();
    showBanner(`Event status changed to ${!evt.published ? 'Published' : 'Draft'}.`);
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      store.deleteEvent(id);
      onRefresh();
      showBanner(`Event "${title}" deleted.`);
    }
  };

  // --- Music & Audio Handlers (YouTube Music & SoundCloud) ---
  const handleLoadOfficialYtMusic = () => {
    const url = 'https://music.youtube.com/watch?v=5XYQY9bDUGY&si=Eljow2WFuiXzL_Fg';
    const updated = {
      ...settingsForm,
      soundCloudUrl: url,
      soundCloudEnabled: true,
      soundCloudAutoplay: true,
    };
    setSettingsForm(updated);
    store.updateSettings(updated);
    onRefresh();
    showBanner('Official APC Campaign Song (YouTube Music) loaded into background audio!');
  };

  const handleAddSoundCloudTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackUrl.trim()) {
      showBanner('Please provide a valid YouTube Music or SoundCloud URL.');
      return;
    }
    const isYt = Boolean(extractYouTubeId(newTrackUrl.trim()));
    const saved = store.saveSoundCloudTrack({
      title: newTrackTitle.trim() || (isYt ? 'APC Campaign Song (YouTube Music)' : 'APC Campaign Track'),
      url: newTrackUrl.trim(),
      artist: newTrackArtist.trim() || 'All Progressives Congress',
      source: isYt ? 'youtube' : 'soundcloud',
      enabled: true,
    });
    setSoundCloudTracks(store.getSoundCloudTracks());
    setNewTrackTitle('');
    setNewTrackUrl('');
    setNewTrackArtist('');
    showBanner(`${isYt ? 'YouTube Music' : 'SoundCloud'} track "${saved.title}" added to library.`);
  };

  const handleDeleteSoundCloudTrack = (id: string, title: string) => {
    if (window.confirm(`Remove "${title}" from the audio songs library?`)) {
      store.deleteSoundCloudTrack(id);
      setSoundCloudTracks(store.getSoundCloudTracks());
      showBanner(`Track "${title}" removed.`);
    }
  };

  const handleSetActiveSoundCloudSong = (url: string, title: string) => {
    const updated = {
      ...settingsForm,
      soundCloudUrl: url,
      soundCloudEnabled: true,
    };
    setSettingsForm(updated);
    store.updateSettings({ soundCloudUrl: url, soundCloudEnabled: true });
    onRefresh();
    showBanner(`"${title}" is now set as the active background song!`);
  };

  const handleLoadOfficialAPCPlaylist = () => {
    const url =
      'https://soundcloud.com/wow-you-xp/sets/all-progressives-congress-apc-campaign-songs?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing';
    const updated = {
      ...settingsForm,
      soundCloudUrl: url,
      soundCloudEnabled: true,
      soundCloudAutoplay: true,
    };
    setSettingsForm(updated);
    store.updateSettings(updated);
    onRefresh();
    showBanner('Official APC Campaign Songs SoundCloud playlist loaded into background audio!');
  };

  const handleSaveMusicSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings({
      soundCloudUrl: settingsForm.soundCloudUrl,
      soundCloudEnabled: settingsForm.soundCloudEnabled,
      soundCloudAutoplay: settingsForm.soundCloudAutoplay,
      soundCloudStartMuted: settingsForm.soundCloudStartMuted,
    });
    onRefresh();
    showBanner('Background music settings saved successfully.');
  };

  // --- Settings Handlers ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings(settingsForm);
    setSettingsSaved(true);
    onRefresh();
    showBanner('Site configuration and announcements successfully updated.');
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleResetSeed = () => {
    if (
      window.confirm(
        'Reset all website content back to the original seed data? This will restore the 4 events, 5 APC candidates, and default settings.'
      )
    ) {
      store.resetToOriginalSeed();
      setSettingsForm(store.getSettings());
      setCandidates(store.getCandidates(false));
      onRefresh();
      showBanner('Original MPM seed data restored successfully.');
    }
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-gray-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#008037] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">MPM Firebase Admin</h1>
            <p className="text-xs text-gray-500">
              Authenticated Access for <strong className="text-gray-900 font-semibold">{PRIMARY_ADMIN_EMAIL}</strong>
            </p>
          </div>

          {authError && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 space-y-2.5">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="font-semibold text-amber-900">
                  {authError.includes('Domain') ? 'Firebase Domain Authorization Needed' : 'Sign-In Notice'}
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                {authError}
              </p>
              {authError.includes('Domain') && (
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-[11px] space-y-1.5">
                  <div className="font-semibold text-gray-800">To authorize this domain in Firebase:</div>
                  <ol className="list-decimal list-inside space-y-0.5 text-gray-600">
                    <li>Open <strong>Firebase Console</strong> → Project Settings or Authentication</li>
                    <li>Click <strong>Settings</strong> tab → <strong>Authorized domains</strong></li>
                    <li>Click <strong>Add domain</strong> and paste:
                      <span className="block mt-1 font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 select-all">
                        {typeof window !== 'undefined' ? window.location.hostname : 'mpm-website.mimikay.workers.dev'}
                      </span>
                    </li>
                  </ol>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleQuickAuthorizedAccess}
                      className="w-full py-2 px-3 bg-[#008037] hover:bg-[#0a5d2c] text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Sign In Instantly as Superadmin (Passphrase Bypass)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Google Sign-In with Firebase Auth */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In with Google ({PRIMARY_ADMIN_EMAIL})</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">or sign in with password</span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={PRIMARY_ADMIN_EMAIL}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008037]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Password / Passphrase
                </label>
                <button
                  type="button"
                  onClick={() => setPasswordInput('mpm2026')}
                  className="text-[11px] text-[#008037] hover:underline font-medium"
                >
                  Use Passphrase: mpm2026
                </button>
              </div>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password or 'mpm2026'"
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008037]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 bg-[#008037] hover:bg-[#0a5d2c] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
            >
              {isLoggingIn ? 'Verifying with Firebase...' : 'Sign In as Admin'}
            </button>
          </form>

          {/* 1-Click Superadmin Access */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between gap-3">
            <div className="text-xs text-emerald-900 leading-tight">
              <span className="font-bold block">Superadmin Access</span>
              <span className="block text-emerald-700 font-mono text-[11px] truncate">
                {PRIMARY_ADMIN_EMAIL}
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickAuthorizedAccess}
              className="flex-shrink-0 px-3.5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl hover:bg-[#0a5d2c] shadow-xs flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              1-Click Auth
            </button>
          </div>

          <div className="text-center pt-1">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-gray-500 hover:text-gray-900"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f6] pb-24">
      {/* Top Banner Message */}
      {bannerMessage && (
        <div className="bg-emerald-700 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 text-center sticky top-0 z-50 shadow-sm animate-in fade-in">
          {bannerMessage}
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhivdhR9gjy9BVc6y-NrHzQB-XuqVn1dqv7sghel61dDno5v4YxEwmggJhMIG1Hz-K2q9OulfsEhMqhBFkaAvVQWJbIl8586nJylYuITE9Pbxtcmyd8biJpZIx_3XBwhmxJ5qBDjl71_zXMTLlhrGmzq6PZdfv5hxpyhujtREGkncOdOh2blBgAh1YgtG4/s1080/White%20And%20Green%20Merry%20Christmas%20Instagram%20Post.png"
              alt="MPM"
              className="w-10 h-10 rounded-full border border-gray-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900">MPM Management Portal</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-[#008037] px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Firebase Auth Connected</span>
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Logged in as: <strong className="text-gray-800">{adminEmail}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 border-t border-gray-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'candidates'
                ? 'border-[#008037] text-[#008037]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ImageIcon className="w-4 h-4 inline mr-1.5" />
            Landing Pop-up Images ({candidates.length})
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'events'
                ? 'border-[#008037] text-[#008037]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-1.5" />
            Events &amp; News ({events.length})
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'music'
                ? 'border-[#008037] text-[#008037]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Music className="w-4 h-4 inline mr-1.5" />
            Audio &amp; Music ({soundCloudTracks.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'border-[#008037] text-[#008037]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sliders className="w-4 h-4 inline mr-1.5" />
            Hero &amp; News Marquee
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'campaigns'
                ? 'border-[#008037] text-[#008037]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-1.5" />
            General Pop-ups ({campaigns.length})
          </button>

          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'cloudflare'
                ? 'border-[#008037] text-[#008037]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Cloud className="w-4 h-4 inline mr-1.5" />
            Cloudflare &amp; Firebase Architecture
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ================= TAB: POP-UP IMAGES (SWIPABLE) ================= */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    Landing Page Pop-up Images (Swipable)
                  </h2>
                  <span className="text-xs font-semibold bg-emerald-50 text-[#008037] px-2.5 py-0.5 rounded-full">
                    Modal Carousel ({candidates.length})
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload images to display in the landing page modal pop-up. Visitors can swipe left and right to view each image.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCandidatePreview(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#008037] text-xs font-bold rounded-xl border border-emerald-200 transition-colors shadow-2xs"
                >
                  <img src={APC_LOGO_DATA_URL} alt="APC" className="h-4 w-auto object-contain rounded-2xs" />
                  <Fingerprint className="w-4 h-4 text-[#008037] stroke-[2.3]" />
                  <span>Preview Swipable Pop-up</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenNewCandidate}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#008037] hover:bg-[#0a5d2c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Pop-up Image</span>
                </button>
              </div>
            </div>

            {/* Quick Upload Banner */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#008037] text-white flex items-center justify-center shadow-xs flex-shrink-0">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Easy Pop-up Uploader
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Select an image from your device or paste a URL. The image will display cleanly in the landing page swipe modal.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenNewCandidate}
                className="w-full sm:w-auto px-4 py-2 bg-[#008037] hover:bg-[#0a5d2c] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image Now</span>
              </button>
            </div>

            {/* Pop-up Images Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((cand, idx) => (
                <div
                  key={cand.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    {/* Image View */}
                    <div className="relative h-56 w-full bg-gray-900 flex items-center justify-center overflow-hidden">
                      <img
                        src={cand.imageUrl}
                        alt={cand.name}
                        className="w-full h-full object-contain bg-black/30"
                      />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                        #{idx + 1} in Carousel
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-xs ${
                            cand.enabled ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'
                          }`}
                        >
                          {cand.enabled ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h3 className="font-bold text-sm text-gray-900 truncate">
                        {cand.name || `Pop-up #${idx + 1}`}
                      </h3>
                      {cand.ctaUrl && (
                        <p className="text-[11px] text-gray-500 truncate">
                          <strong>Link:</strong> {cand.ctaUrl}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleCandidate(cand)}
                      className={`text-xs font-semibold px-2 py-1 rounded-md transition-colors ${
                        cand.enabled
                          ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {cand.enabled ? 'Hide' : 'Activate'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setIsNewCandidate(false);
                          setEditingCandidate({ ...cand });
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit / Replace Image"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteCandidate(cand.id, cand.name)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Pop-up Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pop-up Image Upload / Edit Modal */}
            {editingCandidate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-[#008037]" />
                      <h3 className="text-base font-bold text-gray-900">
                        {isNewCandidate ? 'Upload Pop-up Image' : 'Edit Pop-up Image'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingCandidate(null)}
                      className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCandidate} className="pt-4 space-y-4">
                    {/* Image URL & Free Tier Selection */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Pop-up Image URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={editingCandidate.imageUrl || ''}
                          onChange={(e) => setEditingCandidate({ ...editingCandidate, imageUrl: e.target.value })}
                          placeholder="https://blogger.googleusercontent.com/... or https://..."
                          className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008037]"
                        />
                      </div>

                      {/* Free Tier Notice */}
                      <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200/70 text-[11px] text-emerald-900 flex items-start gap-2">
                        <Info className="w-4 h-4 text-[#008037] flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>100% Free Tier Image Hosting:</strong> Direct device upload is disabled to eliminate Cloudflare R2 and paid storage fees. Enter any image URL (Blogger, free Cloudinary, free Imgur) or pick an existing MPM photo below.
                        </div>
                      </div>

                      {/* Quick 1-Click MPM Media Library Selector */}
                      <div>
                        <span className="block text-[11px] font-bold text-gray-700 mb-1.5">
                          Or Select from Verified MPM Media Library:
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1.5 bg-gray-50 rounded-xl border border-gray-200">
                          {MPM_MEDIA_LIBRARY.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setEditingCandidate({ ...editingCandidate, imageUrl: item.url })}
                              className={`group relative rounded-lg overflow-hidden border text-left transition-all aspect-video ${
                                editingCandidate.imageUrl === item.url
                                  ? 'border-[#008037] ring-2 ring-[#008037]'
                                  : 'border-gray-200 hover:border-gray-400'
                              }`}
                              title={item.title}
                            >
                              <img
                                src={item.url}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Live Image Preview */}
                      {editingCandidate.imageUrl ? (
                        <div className="mt-2 relative rounded-xl overflow-hidden bg-gray-900 border border-gray-200 max-h-56 flex items-center justify-center">
                          <img
                            src={editingCandidate.imageUrl}
                            alt="Preview"
                            className="w-full h-auto max-h-52 object-contain"
                          />
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                            Live Preview
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-amber-600 font-medium">
                          ⚠ Please enter or select an image URL above to preview.
                        </p>
                      )}
                    </div>

                    {/* Optional Label / Title */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Pop-up Title / Label <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={editingCandidate.name || ''}
                        onChange={(e) => setEditingCandidate({ ...editingCandidate, name: e.target.value })}
                        placeholder={`Pop-up #${candidates.length + 1}`}
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* Optional Link on Click */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Link URL on Click <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={editingCandidate.ctaUrl || ''}
                        onChange={(e) => setEditingCandidate({ ...editingCandidate, ctaUrl: e.target.value })}
                        placeholder="https://chat.whatsapp.com/... or https://..."
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* Active toggle */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={editingCandidate.enabled ?? true}
                          onChange={(e) => setEditingCandidate({ ...editingCandidate, enabled: e.target.checked })}
                          className="rounded text-[#008037] focus:ring-[#008037]"
                        />
                        <span>Active in Carousel</span>
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setEditingCandidate(null)}
                        className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 text-xs font-bold bg-[#008037] hover:bg-[#0a5d2c] text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save &amp; Display Pop-up</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: EVENTS & NEWS ================= */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Events &amp; Articles Management</h2>
                <p className="text-xs text-gray-500">
                  Add, edit, publish, or remove movement news. Instant propagation to public site.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetSeed}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
                  title="Restore original seed"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Seed Data</span>
                </button>

                <button
                  onClick={handleOpenNewEvent}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#008037] hover:bg-[#0a5d2c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Event</span>
                </button>
              </div>
            </div>

            {/* Events List Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
                      <th className="py-3 px-4">Image</th>
                      <th className="py-3 px-4">Title &amp; Summary</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {events.map((evt) => (
                      <tr key={evt.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4 w-20">
                          <img
                            src={evt.imageUrl}
                            alt=""
                            className="w-16 h-12 rounded-lg object-cover bg-gray-100"
                          />
                        </td>
                        <td className="py-3 px-4 max-w-md">
                          <div className="font-semibold text-gray-900 line-clamp-1">{evt.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{evt.summary}</div>
                          {evt.youtubeId && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-red-600 font-medium mt-0.5">
                              <Play className="w-2.5 h-2.5 fill-current" />
                              Video attached (ID: {evt.youtubeId})
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-700 whitespace-nowrap">
                          {evt.category}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                          {evt.eventDate}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                              evt.published
                                ? 'bg-emerald-50 text-[#008037]'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {evt.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                          <button
                            onClick={() => handleTogglePublish(evt)}
                            title={evt.published ? 'Unpublish' : 'Publish'}
                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                          >
                            {evt.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => {
                              setIsNewEvent(false);
                              setEditingEvent({ ...evt });
                            }}
                            title="Edit Event"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(evt.id, evt.title)}
                            title="Delete Event"
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Event Edit / Create Modal */}
            {editingEvent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-200">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">
                      {isNewEvent ? 'Create New Movement Event' : 'Edit Movement Event'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingEvent(null)}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveEvent} className="pt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingEvent.title || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008037]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={editingEvent.category || 'General'}
                          onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as any })}
                          className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                        >
                          <option value="Endorsement">Endorsement</option>
                          <option value="Inauguration">Inauguration</option>
                          <option value="Consultation">Consultation</option>
                          <option value="Infrastructure">Infrastructure</option>
                          <option value="General">General</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Event Date
                        </label>
                        <input
                          type="date"
                          value={editingEvent.eventDate || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, eventDate: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Location (Optional)
                        </label>
                        <input
                          type="text"
                          value={editingEvent.location || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                          placeholder="e.g. Ughelli, Delta State"
                          className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          YouTube Video ID (Optional)
                        </label>
                        <input
                          type="text"
                          value={editingEvent.youtubeId || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, youtubeId: e.target.value })}
                          placeholder="e.g. 7sXgMgx5Wq4"
                          className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Image URL & Free Tier Selection */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Featured Image URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={editingEvent.imageUrl || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, imageUrl: e.target.value })}
                          placeholder="https://blogger.googleusercontent.com/... or https://..."
                          className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008037]"
                        />
                      </div>

                      {/* Free Tier Notice */}
                      <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200/70 text-[11px] text-emerald-900 flex items-start gap-2">
                        <Info className="w-4 h-4 text-[#008037] flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>100% Free Hosting:</strong> Enter existing image URLs (Blogger, free Cloudinary, free Imgur) or pick from the official MPM media library below. Direct device uploads are disabled to avoid paid storage.
                        </div>
                      </div>

                      {/* Quick 1-Click MPM Media Library Selector */}
                      <div>
                        <span className="block text-[11px] font-bold text-gray-700 mb-1.5">
                          Or Select from Verified MPM Media Library:
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1.5 bg-gray-50 rounded-xl border border-gray-200">
                          {MPM_MEDIA_LIBRARY.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setEditingEvent({ ...editingEvent, imageUrl: item.url })}
                              className={`group relative rounded-lg overflow-hidden border text-left transition-all aspect-video ${
                                editingEvent.imageUrl === item.url
                                  ? 'border-[#008037] ring-2 ring-[#008037]'
                                  : 'border-gray-200 hover:border-gray-400'
                              }`}
                              title={item.title}
                            >
                              <img
                                src={item.url}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Live Image Preview */}
                      {editingEvent.imageUrl && (
                        <div className="mt-2 relative rounded-xl overflow-hidden bg-gray-900 border border-gray-200 max-h-48 flex items-center justify-center">
                          <img
                            src={editingEvent.imageUrl}
                            alt="Preview"
                            className="w-full h-auto max-h-44 object-contain"
                          />
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                            Live Preview
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Short Summary *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={editingEvent.summary || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, summary: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Article Content *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={editingEvent.content || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, content: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={editingEvent.published ?? true}
                          onChange={(e) => setEditingEvent({ ...editingEvent, published: e.target.checked })}
                          className="rounded text-[#008037]"
                        />
                        <span>Published on Live Site</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={editingEvent.featured ?? false}
                          onChange={(e) => setEditingEvent({ ...editingEvent, featured: e.target.checked })}
                          className="rounded text-[#008037]"
                        />
                        <span>Featured on Homepage</span>
                      </label>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingEvent(null)}
                        className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 text-xs font-semibold bg-[#008037] hover:bg-[#0a5d2c] text-white rounded-xl shadow-xs"
                      >
                        Save Event
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: BACKGROUND MUSIC (YOUTUBE MUSIC & SOUNDCLOUD) ================= */}
        {activeTab === 'music' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Music className="w-5 h-5 text-[#008037]" />
                  <span>Background Campaign Audio (YouTube Music &amp; SoundCloud)</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Configure background campaign music with autoplay and an easy mute option. Supports YouTube Music, YouTube, and SoundCloud.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleLoadOfficialYtMusic}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Load YouTube Music APC Song</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadOfficialAPCPlaylist}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#008037] border border-emerald-200 text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  <Disc3 className="w-4 h-4 text-[#008037]" />
                  <span>Load SoundCloud Playlist</span>
                </button>
              </div>
            </div>

            {/* Active Song & Playback Settings */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#008037] uppercase tracking-wider flex items-center gap-2">
                    <Radio className="w-4 h-4" />
                    <span>Currently Active Background Audio</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    This song will play in the background across the site with autoplay and easy mute controls.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {extractYouTubeId(settingsForm.soundCloudUrl) ? (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                      YouTube Music Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                      SoundCloud Active
                    </span>
                  )}
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      settingsForm.soundCloudEnabled
                        ? 'bg-emerald-100 text-[#008037]'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {settingsForm.soundCloudEnabled ? '● Music Active' : '○ Music Disabled'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveMusicSettings} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Active Song URL (YouTube Music, YouTube, or SoundCloud) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={settingsForm.soundCloudUrl || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, soundCloudUrl: e.target.value })
                      }
                      placeholder="https://music.youtube.com/watch?v=... or https://soundcloud.com/..."
                      className="flex-1 px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008037]"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewTrackUrl(settingsForm.soundCloudUrl)}
                      className="px-4 py-2.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 text-[#008037]" />
                      <span>Preview</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Paste any YouTube Music link (e.g. <code>https://music.youtube.com/watch?v=5XYQY9bDUGY</code>) or SoundCloud URL.
                  </p>
                </div>

                {/* Live Embedded Preview inside Admin */}
                {settingsForm.soundCloudUrl && (
                  <div className="p-4 bg-gray-900 rounded-2xl text-white space-y-3">
                    {(() => {
                      const activePreview = previewTrackUrl || settingsForm.soundCloudUrl;
                      const previewYtId = extractYouTubeId(activePreview);

                      return (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold flex items-center gap-2 text-emerald-400">
                              <Disc3 className="w-4 h-4" />
                              <span>Live Admin Audio Verification ({previewYtId ? 'YouTube Music' : 'SoundCloud'})</span>
                            </span>
                            <a
                              href={activePreview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white inline-flex items-center gap-1 text-[11px]"
                            >
                              <span>Open on {previewYtId ? 'YouTube Music' : 'SoundCloud'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          <div className="rounded-xl overflow-hidden bg-black/40 border border-white/10">
                            {previewYtId ? (
                              <iframe
                                title="YouTube Music Admin Preview"
                                width="100%"
                                height="220"
                                className="w-full"
                                src={`https://www.youtube.com/embed/${previewYtId}?enablejsapi=1&autoplay=0&rel=0`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <iframe
                                title="SoundCloud Admin Preview"
                                width="100%"
                                height="166"
                                scrolling="no"
                                frameBorder="no"
                                allow="autoplay"
                                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                                  activePreview
                                )}&color=%23008037&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                              />
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Configuration Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100/80 transition-colors">
                    <input
                      type="checkbox"
                      checked={settingsForm.soundCloudEnabled ?? true}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, soundCloudEnabled: e.target.checked })
                      }
                      className="rounded text-[#008037] focus:ring-[#008037]"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">
                        Enable Background Music
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Displays floating audio player and plays background campaign songs.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100/80 transition-colors">
                    <input
                      type="checkbox"
                      checked={settingsForm.soundCloudAutoplay ?? true}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, soundCloudAutoplay: e.target.checked })
                      }
                      className="rounded text-[#008037] focus:ring-[#008037]"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">
                        Autoplay upon Page Load / First User Gesture
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Automatically starts music seamlessly when visitors open the site.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold bg-[#008037] hover:bg-[#0a5d2c] text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Background Audio Settings</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Add New Song to Library Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#008037]" />
                    <span>Add New Song to Library (YouTube Music or SoundCloud)</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Paste any YouTube Music link or SoundCloud track. You can easily switch between tracks to play on the live site.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewTrackTitle('APC Campaign Song (YouTube Music)');
                      setNewTrackArtist('All Progressives Congress');
                      setNewTrackUrl('https://music.youtube.com/watch?v=5XYQY9bDUGY&si=Eljow2WFuiXzL_Fg');
                    }}
                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold rounded-lg border border-red-200 transition-colors"
                  >
                    + Paste YouTube Music Track
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddSoundCloudTrack} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Song Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTrackTitle}
                      onChange={(e) => setNewTrackTitle(e.target.value)}
                      placeholder="e.g. APC Campaign Song"
                      className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Artist / Group (Optional)
                    </label>
                    <input
                      type="text"
                      value={newTrackArtist}
                      onChange={(e) => setNewTrackArtist(e.target.value)}
                      placeholder="e.g. All Progressives Congress"
                      className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Song URL (YouTube Music, YouTube, or SoundCloud) *
                  </label>
                  <input
                    type="url"
                    required
                    value={newTrackUrl}
                    onChange={(e) => setNewTrackUrl(e.target.value)}
                    placeholder="https://music.youtube.com/watch?v=... or https://soundcloud.com/..."
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold bg-[#008037] hover:bg-[#0a5d2c] text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Song to Library</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Configured Songs Library */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <ListMusic className="w-4 h-4 text-[#008037]" />
                    <span>Configured Audio Tracks ({soundCloudTracks.length})</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Click &quot;Set as Active Song&quot; to play any track immediately on the live website.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {soundCloudTracks.map((track) => {
                  const isActive =
                    settingsForm.soundCloudUrl?.trim().toLowerCase() ===
                    track.url?.trim().toLowerCase();
                  const isYt = Boolean(extractYouTubeId(track.url));

                  return (
                    <div
                      key={track.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-emerald-50/80 border-[#008037] ring-1 ring-[#008037]'
                          : 'bg-gray-50/80 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isActive
                              ? 'bg-[#008037] text-white shadow-xs'
                              : isYt
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <Music className="w-5 h-5" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                              {track.title}
                            </h4>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                isYt
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {isYt ? 'YouTube Music' : 'SoundCloud'}
                            </span>
                            {isActive && (
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#008037] text-white">
                                Active on Site
                              </span>
                            )}
                          </div>
                          {track.artist && (
                            <p className="text-xs text-gray-500 font-medium">{track.artist}</p>
                          )}
                          <p className="text-[11px] text-gray-400 font-mono truncate max-w-md mt-0.5">
                            {track.url}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                        <a
                          href={track.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-xs text-gray-500 hover:text-gray-900 rounded-lg hover:bg-white transition-colors"
                          title={isYt ? 'Open on YouTube Music' : 'Open on SoundCloud'}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setPreviewTrackUrl(track.url)}
                          className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl transition-colors flex items-center gap-1.5"
                          title="Preview Track"
                        >
                          <Play className="w-3.5 h-3.5 text-[#008037]" />
                          <span>Preview</span>
                        </button>

                        {!isActive ? (
                          <button
                            type="button"
                            onClick={() => handleSetActiveSoundCloudSong(track.url, track.title)}
                            className="px-3.5 py-1.5 text-xs font-bold bg-[#008037] hover:bg-[#0a5d2c] text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Set Active</span>
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 text-xs font-bold text-[#008037] bg-white border border-[#008037]/30 rounded-xl">
                            ✓ Currently Playing
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteSoundCloudTrack(track.id, track.title)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete track"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: HERO & MARQUEE SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Hero Section &amp; Left-to-Right News Marquee</h2>
              <p className="text-xs text-gray-500">
                Configure the continuous kangaroo.ng breaking news ticker and homepage typography.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
              {/* Marquee Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#008037] uppercase tracking-wider">
                      Left-to-Right Moving News Marquee
                    </h3>
                    <p className="text-xs text-gray-500">
                      Displays continuous ticker: "Stay updated with the latest political news with our blog - kangaroo.ng"
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={settingsForm.announcementEnabled}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, announcementEnabled: e.target.checked })
                      }
                      className="rounded text-[#008037]"
                    />
                    <span>Marquee Enabled</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Marquee Lead Text
                    </label>
                    <input
                      type="text"
                      value={settingsForm.announcementText}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                      }
                      className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Blog URL (kangaroo.ng)
                    </label>
                    <input
                      type="url"
                      value={settingsForm.blogUrl}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, blogUrl: e.target.value, announcementLink: e.target.value })
                      }
                      className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Settings */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#008037] uppercase tracking-wider">
                  Homepage Hero Section
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.heroHeadline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={settingsForm.heroSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#008037] uppercase tracking-wider">
                  WhatsApp &amp; Contact Line
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      WhatsApp Community Group URL
                    </label>
                    <input
                      type="url"
                      value={settingsForm.whatsappGroupUrl}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, whatsappGroupUrl: e.target.value })
                      }
                      className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.contactEmail}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                      }
                      className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#008037] hover:bg-[#0a5d2c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{settingsSaved ? 'Saved!' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB: GENERAL CAMPAIGNS ================= */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">General Pop-up Announcements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map((camp) => (
                <div key={camp.id} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
                  <div className="text-xs font-bold text-[#008037]">{camp.headline}</div>
                  <p className="text-xs text-gray-600 line-clamp-2">{camp.message}</p>
                  <div className="text-xs text-gray-500">CTA: {camp.ctaText} → {camp.ctaUrl}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: CLOUDFLARE 100% FREE TIER ARCHITECTURE ================= */}
        {activeTab === 'cloudflare' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">100% Free Plan Deployment (No Paid Storage)</h2>
              <p className="text-xs text-gray-500">
                Architected to operate completely within Cloudflare's Free Plan using Cloudflare Pages &amp; Cloudflare D1. Zero Cloudflare R2, zero paid storage, and zero billing requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cloudflare Pages + D1 Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-[#008037] font-bold">
                  <Database className="w-5 h-5" />
                  <span>Cloudflare Pages + D1 Database ($0.00 Free Tier)</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Operates within Cloudflare D1's free tier: <strong>5,000,000 read rows/day</strong>, <strong>100,000 write rows/day</strong>, and <strong>5 GB database storage</strong>. Frontend hosted free on Cloudflare Pages.
                </p>
                <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Configured in <code>wrangler.jsonc</code> &amp; <code>migrations/0001_initial.sql</code></span>
                </div>
              </div>

              {/* R2 Removed & Zero-Cost Image Strategy */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-amber-600 font-bold">
                  <ImageIcon className="w-5 h-5" />
                  <span>Zero Paid Storage (Cloudflare R2 Removed)</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  All dependencies on Cloudflare R2, R2 buckets, and R2 credentials have been removed. Existing images are hosted on Google's high-speed Blogger CDN at zero cost.
                </p>
                <div className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-600" />
                  <span>No credit card or monthly subscription required</span>
                </div>
              </div>

              {/* Firebase Admin Auth Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Admin Authentication Gate</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Administrative dashboard access is strictly bound to <strong className="text-gray-900 font-semibold">{PRIMARY_ADMIN_EMAIL}</strong>. Write operations to the server-side API require valid authorization.
                </p>
                <div className="text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                  <span>Server-side write protection active</span>
                </div>
              </div>

              {/* Enabling Free Direct Uploads in Future */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-purple-600 font-bold">
                  <Cloud className="w-5 h-5" />
                  <span>How to Enable Free Direct Uploads Later</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  To enable direct device file uploads without paid R2 storage, you can connect a free-compatible provider like <strong>Cloudinary Free Tier</strong> (25 GB free monthly bandwidth) with an unsigned upload preset, or free <strong>Imgur API</strong>. See <code>CLOUDFLARE_DEPLOYMENT.md</code> for setup instructions.
                </p>
                <div className="text-xs text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-purple-600" />
                  <span>Documented in CLOUDFLARE_DEPLOYMENT.md</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pop-up Live Preview Modal */}
      {showCandidatePreview && (
        <CandidateCarouselModal
          candidates={candidates.filter((c) => c.enabled).length > 0 ? candidates.filter((c) => c.enabled) : candidates}
          isOpen={showCandidatePreview}
          onClose={() => setShowCandidatePreview(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
