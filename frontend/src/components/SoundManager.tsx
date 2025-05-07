import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const SoundManager = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioElements = useRef<Record<string, HTMLAudioElement>>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  const isUnlocked = useRef(false);

  // Initialize audio system
  useEffect(() => {
    try {
      // Create Web Audio Context
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // iOS requires audio context to be created/resumed after user interaction
      const unlockAudio = () => {
        if (!isUnlocked.current && audioContextRef.current) {
          if (audioContextRef.current.state === "suspended") {
            audioContextRef.current
              .resume()
              .then(() => {
                isUnlocked.current = true;
                console.log("Audio context successfully unlocked");
              })
              .catch((e) => {
                console.error("Failed to unlock audio context:", e);
              });
          }
          document.removeEventListener("click", unlockAudio);
          document.removeEventListener("touchstart", unlockAudio);
        }
      };

      // Add both mouse and touch listeners for broader device support
      document.addEventListener("click", unlockAudio);
      document.addEventListener("touchstart", unlockAudio);

      return () => {
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("touchstart", unlockAudio);
      };
    } catch (e) {
      console.error("Audio context initialization failed:", e);
    }
  }, []);

  // Global play function with flexible sound source
  const playAudio = (
    source: string,
    options: {
      volume?: number;
      loop?: boolean;
      interrupt?: boolean;
      onEnd?: () => void;
    } = {}
  ) => {
    if (isMuted) return;

    const { volume = 0.5, loop = false, interrupt = true, onEnd } = options;

    try {
      // Create new audio element or reuse existing one
      let audio = audioElements.current[source];
      if (!audio) {
        audio = new Audio(source);
        audio.preload = "auto";
        audioElements.current[source] = audio;
      }

      // Configure audio
      audio.volume = volume;
      audio.loop = loop;

      // Stop current playback if interrupting
      if (interrupt) {
        audio.pause();
        audio.currentTime = 0;
      }

      // Remove previous ended event listeners to avoid leaks

      const handleEnded = () => {
        if (!loop) {
          delete audioElements.current[source];
        }
        onEnd?.();
      };

      audio.addEventListener("ended", handleEnded, { once: true });

      // Play audio with fallback for older browsers
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.error(`Audio playback failed for ${source}:`, e);
          // Show user-friendly message for common errors
          if (e.name === "NotAllowedError") {
            toast.info("Please interact with the page to enable sound");
          }
        });
      }
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  };

  // Expose functions globally with type safety
  useEffect(() => {
    const win = window as any;

    win.soundManager = {
      play: playAudio,
      setMute: (muted: boolean) => {
        setIsMuted(muted);
        // Pause all sounds when muting
        if (muted) {
          Object.values(audioElements.current).forEach((audio) =>
            audio.pause()
          );
        }
      },
      isMuted: () => isMuted,
      preload: (sources: string[]) => {
        sources.forEach((source) => {
          if (!audioElements.current[source]) {
            const audio = new Audio(source);
            audio.preload = "auto";
            audio.load(); // Force load
            audioElements.current[source] = audio;
          }
        });
      },
    };

    return () => {
      // Clean up all audio elements
      Object.values(audioElements.current).forEach((audio) => {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      });
      delete win.soundManager;
    };
  }, [isMuted]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-6 right-6 z-40"
    >
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-undead-dark bg-opacity-70 border-undead-purple hover:bg-undead-purple/50"
        onClick={() => {
          setIsMuted(!isMuted);
          if (!isMuted) {
            playAudio("/sounds/click.mp3", { volume: 0.3 });
          }
        }}
        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5 text-undead-bone" />
        ) : (
          <Volume className="h-5 w-5 text-undead-bone" />
        )}
      </Button>
    </motion.div>
  );
};

export default SoundManager;
