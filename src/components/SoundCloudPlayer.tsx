import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ChevronUp,
  ChevronDown,
  Music,
  ExternalLink,
  Disc3,
  Radio,
  Sparkles,
} from 'lucide-react';
import { SoundCloudTrack } from '../types';
import { store } from '../services/store';

interface Props {
  soundCloudUrl: string;
  enabled?: boolean;
  autoplay?: boolean;
}

// SoundCloud Widget API interface
interface SCWidget {
  bind: (event: string, callback: (...args: any[]) => void) => void;
  unbind: (event: string) => void;
  load: (url: string, options?: any) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seekTo: (milliseconds: number) => void;
  setVolume: (volume: number) => void;
  getVolume: (callback: (volume: number) => void) => void;
  getDuration: (callback: (duration: number) => void) => void;
  getPosition: (callback: (position: number) => void) => void;
  getSounds: (callback: (sounds: any[]) => void) => void;
  getCurrentSound: (callback: (sound: any) => void) => void;
  getCurrentSoundIndex: (callback: (index: number) => void) => void;
  isPaused: (callback: (paused: boolean) => void) => void;
  next: () => void;
  prev: () => void;
}

declare global {
  interface Window {
    SC?: {
      Widget: {
        (element: HTMLIFrameElement | string): SCWidget;
        Events: {
          LOAD_PROGRESS: string;
          PLAY_PROGRESS: string;
          PLAY: string;
          PAUSE: string;
          FINISH: string;
          SEEK: string;
          READY: string;
          ERROR: string;
        };
      };
    };
    YT?: {
      Player: any;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Utility to parse YouTube ID from YouTube Music, YouTube, and youtu.be links
export function extractYouTubeId(url: string | undefined): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/)|music\.youtube\.com\/watch\?.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

export const SoundCloudPlayer: React.FC<Props> = ({
  soundCloudUrl,
  enabled = true,
  autoplay = true,
}) => {
  const scIframeRef = useRef<HTMLIFrameElement>(null);
  const scWidgetRef = useRef<SCWidget | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);

  const [activeUrl, setActiveUrl] = useState<string>(
    soundCloudUrl || 'https://music.youtube.com/watch?v=5XYQY9bDUGY&si=Eljow2WFuiXzL_Fg'
  );

  const ytId = extractYouTubeId(activeUrl);
  const isYouTube = Boolean(ytId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState<number>(85);
  const [isExpanded, setIsExpanded] = useState(false);
  const [trackTitle, setTrackTitle] = useState(
    isYouTube ? 'APC Campaign Song' : 'APC Campaign Songs'
  );
  const [artistName, setArtistName] = useState('All Progressives Congress');
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [totalSongs, setTotalSongs] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [showAutoplayHint, setShowAutoplayHint] = useState(false);
  const [availableTracks, setAvailableTracks] = useState<SoundCloudTrack[]>(() =>
    store.getSoundCloudTracks()
  );

  // Sync prop changes
  useEffect(() => {
    if (soundCloudUrl && soundCloudUrl !== activeUrl) {
      setActiveUrl(soundCloudUrl);
    }
  }, [soundCloudUrl]);

  // Listen to track library updates from store
  useEffect(() => {
    const handleTracksUpdate = (e: any) => {
      if (e.detail) {
        setAvailableTracks(e.detail);
      } else {
        setAvailableTracks(store.getSoundCloudTracks());
      }
    };
    window.addEventListener('mpm-soundcloud-updated', handleTracksUpdate);
    return () => window.removeEventListener('mpm-soundcloud-updated', handleTracksUpdate);
  }, []);

  // Fetch track title via oembed / noembed when a YouTube URL is active
  useEffect(() => {
    if (ytId) {
      // Find matching track title from library if available
      const known = availableTracks.find(
        (t) => extractYouTubeId(t.url) === ytId
      );
      if (known?.title) {
        setTrackTitle(known.title);
        if (known.artist) setArtistName(known.artist);
      } else {
        setTrackTitle('APC Campaign Song');
        setArtistName('All Progressives Congress');
      }

      // Try fetching official oEmbed title
      fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.title) {
            setTrackTitle(data.title);
            if (data.author_name) setArtistName(data.author_name);
          }
        })
        .catch(() => {
          // Keep default
        });
    }
  }, [ytId, availableTracks]);

  // ===================== YOUTUBE MUSIC / YOUTUBE PLAYER SETUP =====================
  useEffect(() => {
    if (!isYouTube || !ytId) return;

    let destroyed = false;

    // Load YouTube IFrame API script if not present
    if (!window.YT) {
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.body.appendChild(tag);
      }
    }

    const initYt = () => {
      if (destroyed) return;
      if (!window.YT || !window.YT.Player) {
        setTimeout(initYt, 250);
        return;
      }

      const container = document.getElementById('yt-bg-player-placeholder');
      if (!container) {
        setTimeout(initYt, 250);
        return;
      }

      try {
        if (ytPlayerRef.current) {
          try {
            ytPlayerRef.current.destroy();
          } catch {}
          ytPlayerRef.current = null;
        }

        ytPlayerRef.current = new window.YT.Player('yt-bg-player-placeholder', {
          height: '1',
          width: '1',
          videoId: ytId,
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: ytId,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              if (destroyed) return;
              setIsReady(true);
              const player = event.target;
              player.setVolume(volume);

              if (autoplay) {
                // Attempt play. In modern browsers, muted autoplay is always allowed.
                // We start unmuted if permitted, or un-mute upon the first user interaction.
                try {
                  const promise = player.playVideo();
                  if (promise && typeof promise.catch === 'function') {
                    promise.catch(() => {
                      // Browser policy blocked unmuted sound; play muted and wait for user gesture
                      player.mute();
                      player.playVideo();
                      setIsMuted(true);
                      setShowAutoplayHint(true);
                    });
                  }
                } catch {
                  // Fallback
                  player.mute();
                  player.playVideo();
                  setIsMuted(true);
                  setShowAutoplayHint(true);
                }
              }
            },
            onStateChange: (event: any) => {
              if (destroyed) return;
              // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING
              if (event.data === 1) {
                setIsPlaying(true);
                setShowAutoplayHint(false);
                try {
                  const videoData = event.target.getVideoData();
                  if (videoData?.title) {
                    setTrackTitle(videoData.title);
                  }
                } catch {}
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                // Loop video
                event.target.playVideo();
              }
            },
            onError: (err: any) => {
              console.warn('YouTube Player error code:', err?.data);
            },
          },
        });
      } catch (err) {
        console.warn('Error instantiating YouTube player:', err);
      }
    };

    initYt();

    return () => {
      destroyed = true;
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
        ytPlayerRef.current = null;
      }
    };
  }, [isYouTube, ytId, autoplay]);

  // ===================== SOUNDCLOUD WIDGET API SETUP =====================
  useEffect(() => {
    if (isYouTube) return;

    let checkInterval: any = null;

    const initSCWidget = () => {
      if (!scIframeRef.current || !window.SC?.Widget) return false;

      try {
        const widget = window.SC.Widget(scIframeRef.current);
        scWidgetRef.current = widget;

        widget.bind(window.SC.Widget.Events.READY, () => {
          setIsReady(true);
          widget.setVolume(isMuted ? 0 : volume);

          if (autoplay) {
            widget.play();
          }

          widget.getSounds((sounds: any[]) => {
            if (Array.isArray(sounds) && sounds.length > 0) {
              setTotalSongs(sounds.length);
              const first = sounds[0];
              if (first?.title) setTrackTitle(first.title);
            }
          });
        });

        widget.bind(window.SC.Widget.Events.PLAY, () => {
          setIsPlaying(true);
          widget.getCurrentSound((sound: any) => {
            if (sound?.title) setTrackTitle(sound.title);
          });
          widget.getCurrentSoundIndex((idx: number) => {
            setCurrentSongIndex(idx);
          });
        });

        widget.bind(window.SC.Widget.Events.PAUSE, () => {
          setIsPlaying(false);
        });

        widget.bind(window.SC.Widget.Events.FINISH, () => {
          setIsPlaying(false);
        });

        return true;
      } catch (err) {
        console.warn('SC Widget init error:', err);
        return false;
      }
    };

    if (!initSCWidget()) {
      checkInterval = setInterval(() => {
        if (initSCWidget()) {
          clearInterval(checkInterval);
        }
      }, 500);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [isYouTube, activeUrl, autoplay]);

  // ===================== AUTOPLAY USER-GESTURE UNLOCK =====================
  // Handles browser autoplay restrictions by automatically unmuting and starting
  // playback upon the visitor's very first click / tap / scroll on the page!
  useEffect(() => {
    if (!autoplay) return;

    const handleFirstInteraction = () => {
      if (isYouTube && ytPlayerRef.current) {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(volume || 85);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          setIsMuted(false);
          setShowAutoplayHint(false);
        } catch {}
      } else if (!isYouTube && scWidgetRef.current) {
        try {
          scWidgetRef.current.setVolume(volume || 85);
          scWidgetRef.current.play();
          setIsPlaying(true);
          setIsMuted(false);
        } catch {}
      }

      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };
  }, [autoplay, isYouTube, volume]);

  // ===================== CONTROLS: EASY MUTE / UNMUTE =====================
  const handleToggleMute = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isMuted) {
        // Unmute
        const targetVol = volume || 85;
        if (isYouTube && ytPlayerRef.current) {
          try {
            ytPlayerRef.current.unMute();
            ytPlayerRef.current.setVolume(targetVol);
            ytPlayerRef.current.playVideo();
          } catch {}
        } else if (!isYouTube && scWidgetRef.current) {
          try {
            scWidgetRef.current.setVolume(targetVol);
            scWidgetRef.current.play();
          } catch {}
        }
        setIsMuted(false);
        setIsPlaying(true);
        setShowAutoplayHint(false);
      } else {
        // Mute
        if (isYouTube && ytPlayerRef.current) {
          try {
            ytPlayerRef.current.mute();
          } catch {}
        } else if (!isYouTube && scWidgetRef.current) {
          try {
            scWidgetRef.current.setVolume(0);
          } catch {}
        }
        setIsMuted(true);
      }
    },
    [isMuted, volume, isYouTube]
  );

  // ===================== CONTROLS: PLAY / PAUSE =====================
  const handleTogglePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isPlaying) {
        if (isYouTube && ytPlayerRef.current) {
          try {
            ytPlayerRef.current.pauseVideo();
          } catch {}
        } else if (!isYouTube && scWidgetRef.current) {
          try {
            scWidgetRef.current.pause();
          } catch {}
        }
        setIsPlaying(false);
      } else {
        // If unpausing while muted, unmute for optimal user experience
        if (isMuted) {
          setIsMuted(false);
        }
        if (isYouTube && ytPlayerRef.current) {
          try {
            ytPlayerRef.current.unMute();
            ytPlayerRef.current.setVolume(volume || 85);
            ytPlayerRef.current.playVideo();
          } catch {}
        } else if (!isYouTube && scWidgetRef.current) {
          try {
            scWidgetRef.current.setVolume(volume || 85);
            scWidgetRef.current.play();
          } catch {}
        }
        setIsPlaying(true);
        setShowAutoplayHint(false);
      }
    },
    [isPlaying, isMuted, volume, isYouTube]
  );

  // ===================== CONTROLS: VOLUME =====================
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseInt(e.target.value, 10);
    setVolume(newVol);

    if (newVol === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }

    if (isYouTube && ytPlayerRef.current) {
      try {
        if (newVol === 0) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(newVol);
        }
      } catch {}
    } else if (!isYouTube && scWidgetRef.current) {
      try {
        scWidgetRef.current.setVolume(newVol);
      } catch {}
    }
  };

  // ===================== CONTROLS: TRACK SELECTION =====================
  const handleSelectTrack = (track: SoundCloudTrack) => {
    const newYtId = extractYouTubeId(track.url);

    if (newYtId && isYouTube && ytPlayerRef.current) {
      try {
        ytPlayerRef.current.loadVideoById(newYtId);
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(volume || 85);
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
        setIsMuted(false);
        setTrackTitle(track.title);
        if (track.artist) setArtistName(track.artist);
      } catch {
        setActiveUrl(track.url);
      }
    } else if (!newYtId && !isYouTube && scWidgetRef.current) {
      try {
        scWidgetRef.current.load(track.url, {
          auto_play: true,
          show_artwork: true,
          color: '#008037',
        });
        setTrackTitle(track.title);
        if (track.artist) setArtistName(track.artist);
        setIsPlaying(true);
        setIsMuted(false);
      } catch {
        setActiveUrl(track.url);
      }
    } else {
      // Switching between YouTube and SoundCloud
      setActiveUrl(track.url);
      setTrackTitle(track.title);
      if (track.artist) setArtistName(track.artist);
      setIsPlaying(true);
      setIsMuted(false);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (availableTracks.length > 1) {
      const curIdx = availableTracks.findIndex((t) => t.url === activeUrl);
      const nextIdx = (curIdx + 1) % availableTracks.length;
      handleSelectTrack(availableTracks[nextIdx]);
    } else if (!isYouTube && scWidgetRef.current) {
      scWidgetRef.current.next();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (availableTracks.length > 1) {
      const curIdx = availableTracks.findIndex((t) => t.url === activeUrl);
      const prevIdx = (curIdx - 1 + availableTracks.length) % availableTracks.length;
      handleSelectTrack(availableTracks[prevIdx]);
    } else if (!isYouTube && scWidgetRef.current) {
      scWidgetRef.current.prev();
    }
  };

  if (!enabled) return null;

  const scEmbedUrl = !isYouTube
    ? `https://w.soundcloud.com/player/?url=${encodeURIComponent(
        activeUrl
      )}&color=%23008037&auto_play=${autoplay ? 'true' : 'false'}&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`
    : '';

  return (
    <>
      {/* Hidden container for YouTube Music & SoundCloud audio playback */}
      <div
        className="fixed -left-[9999px] -top-[9999px] w-1 h-1 overflow-hidden opacity-0 pointer-events-none"
        aria-hidden="true"
      >
        {isYouTube ? (
          <div ref={ytContainerRef} id="yt-bg-player-placeholder" />
        ) : (
          <iframe
            ref={scIframeRef}
            id="sc-background-player"
            title="SoundCloud Background Audio Player"
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={scEmbedUrl}
          />
        )}
      </div>

      {/* Floating Modern Audio Controller Docked at Bottom-Left */}
      <aside
        aria-label="Background Campaign Audio Player"
        className="fixed bottom-6 left-4 sm:left-6 z-40 flex flex-col items-start select-none"
      >
        <AnimatePresence>
          {/* Expanded Player & Tracklist Drawer */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-gray-200/90 rounded-2xl shadow-2xl overflow-hidden p-4 text-gray-900"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#008037] text-white flex items-center justify-center shadow-xs">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 tracking-tight leading-tight">
                      APC Campaign Anthem
                    </h3>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {isYouTube ? 'YouTube Music Background Player' : 'SoundCloud Background Player'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Collapse player"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Now Playing Info */}
              <div className="pt-3 pb-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold text-[#008037] uppercase tracking-wider">
                    Now Playing
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      isYouTube
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}
                  >
                    {isYouTube ? 'YouTube Music' : 'SoundCloud'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-relaxed">
                  {trackTitle}
                </p>
                {artistName && (
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                    {artistName}
                  </p>
                )}
              </div>

              {/* Volume Slider & Controls */}
              <div className="pt-2 pb-3 border-t border-gray-100 mt-2 space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className={`p-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 text-xs font-bold ${
                      isMuted
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-emerald-50 text-[#008037] hover:bg-emerald-100'
                    }`}
                    title={isMuted ? 'Click to Unmute Music' : 'Click to Mute Music'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                  </button>

                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#008037]"
                      aria-label="Volume level"
                    />
                    <span className="text-[10px] font-bold text-gray-500 w-7 text-right">
                      {isMuted ? '0%' : `${volume}%`}
                    </span>
                  </div>
                </div>

                {/* Playback action buttons */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Previous track"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="px-5 py-2 rounded-xl bg-[#008037] hover:bg-[#0a5d2c] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-white" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Play Anthem</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Next track"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Playlist / Available Campaign Tracks */}
              {availableTracks.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Available Campaign Audio:
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {availableTracks.map((trk) => {
                      const isTrkYt = Boolean(extractYouTubeId(trk.url));
                      const isCurrent =
                        trk.url === activeUrl ||
                        (isTrkYt && extractYouTubeId(trk.url) === ytId);

                      return (
                        <button
                          key={trk.id}
                          type="button"
                          onClick={() => handleSelectTrack(trk)}
                          className={`w-full text-left p-2 rounded-xl border transition-all flex items-center justify-between group text-xs ${
                            isCurrent
                              ? 'bg-emerald-50 border-emerald-300 font-semibold text-[#008037]'
                              : 'hover:bg-gray-50 border-transparent text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Disc3
                              className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${
                                isCurrent
                                  ? 'text-[#008037] animate-spin'
                                  : 'text-gray-400 group-hover:rotate-45'
                              }`}
                            />
                            <div className="truncate">
                              <span className="font-semibold block truncate">
                                {trk.title}
                              </span>
                              <span className="text-[10px] text-gray-500 flex items-center gap-1 truncate">
                                <span
                                  className={`text-[8px] font-bold px-1 rounded ${
                                    isTrkYt
                                      ? 'bg-red-50 text-red-600'
                                      : 'bg-amber-50 text-amber-700'
                                  }`}
                                >
                                  {isTrkYt ? 'YouTube Music' : 'SoundCloud'}
                                </span>
                                {trk.artist && <span>• {trk.artist}</span>}
                              </span>
                            </div>
                          </div>
                          <Play className="w-3 h-3 text-[#008037] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Source Attribution & Direct Link */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                <span className="flex items-center gap-1 font-medium">
                  Playing via{' '}
                  <strong className="text-gray-800">
                    {isYouTube ? 'YouTube Music' : 'SoundCloud'}
                  </strong>
                </span>
                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#008037] hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <span>Open {isYouTube ? 'YouTube Music' : 'SoundCloud'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Tooltip hint when autoplay starts muted due to browser policy */}
        <AnimatePresence>
          {showAutoplayHint && isMuted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-2 bg-gradient-to-r from-emerald-600 to-[#008037] text-white px-3 py-1.5 rounded-xl shadow-lg border border-white/20 text-xs font-bold flex items-center gap-2 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
              onClick={handleToggleMute}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Click to Unmute APC Campaign Song!</span>
              <Volume2 className="w-4 h-4 fill-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Bar / Floating Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="flex items-center gap-2 bg-gray-900/90 hover:bg-gray-900 backdrop-blur-md text-white px-3.5 py-2 rounded-full shadow-2xl border border-white/20 transition-all"
        >
          {/* Animated Audio Visualizer Waves or Static Disc */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none"
            title={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying && !isMuted ? (
              <span className="flex items-end gap-0.5 h-4 w-4">
                <span
                  className="w-1 bg-emerald-400 rounded-full animate-bounce h-4"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-1 bg-amber-300 rounded-full animate-bounce h-2.5"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-1 bg-emerald-400 rounded-full animate-bounce h-3.5"
                  style={{ animationDelay: '300ms' }}
                />
              </span>
            ) : (
              <Disc3
                className={`w-4 h-4 ${
                  isPlaying ? 'text-emerald-400 animate-spin' : 'text-gray-400 hover:text-white'
                }`}
              />
            )}
          </button>

          {/* Track name & status */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex flex-col cursor-pointer max-w-[130px] sm:max-w-[190px] pr-1"
          >
            <span className="text-xs font-bold text-white truncate tracking-tight">
              {trackTitle}
            </span>
            <span className="text-[9px] text-gray-400 flex items-center gap-1 font-medium">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPlaying && !isMuted
                    ? 'bg-emerald-400 animate-pulse'
                    : isMuted
                    ? 'bg-amber-400'
                    : 'bg-gray-500'
                }`}
              />
              {isMuted ? 'Muted' : isPlaying ? 'Playing' : 'Paused'}
              <span className="text-[8px] text-gray-500">•</span>
              <span className="text-[8px] text-emerald-400/90 font-mono">
                {isYouTube ? 'YT Music' : 'SoundCloud'}
              </span>
            </span>
          </div>

          <div className="h-4 w-px bg-white/20" aria-hidden="true" />

          {/* Easy MUTE / UNMUTE Option (The central user requirement) */}
          <button
            type="button"
            onClick={handleToggleMute}
            className={`p-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#008037] ${
              isMuted
                ? 'bg-amber-400 text-gray-900 hover:bg-amber-300 font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title={isMuted ? 'Unmute Audio (Turn Sound On)' : 'Mute Audio (Turn Sound Off)'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-gray-900" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Play / Pause Toggle Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className="p-1.5 rounded-full bg-[#008037] hover:bg-[#0a5d2c] text-white transition-all shadow-xs focus:outline-none"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
          </button>

          {/* Expand / Tracklist button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isExpanded ? 'Minimize player' : 'Expand player & tracklist'}
            aria-label={isExpanded ? 'Minimize player' : 'Expand player & tracklist'}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </motion.div>
      </aside>
    </>
  );
};
