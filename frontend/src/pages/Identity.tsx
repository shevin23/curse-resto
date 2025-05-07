import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IdentityContext, UserIdentity } from "@/App";
import { Button } from "@/components/ui/button";
import { Skull, Ghost } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    soundManager?: {
      play: (
        source: string,
        options?: {
          volume?: number;
          loop?: boolean;
          interrupt?: boolean;
          onEnd?: () => void;
        }
      ) => void;
      setMute: (muted: boolean) => void;
      isMuted: () => boolean;
      preload: (sources: string[]) => void;
    };
  }
}

const Identity = () => {
  const { identity, setIdentity } = useContext(IdentityContext);
  const [selected, setSelected] = useState<UserIdentity>(identity);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Play sound when component mounts (optional ambient sound)
  useEffect(() => {
    window.soundManager?.play("/sounds/ambient.mp3", {
      volume: 0.1,
      loop: true,
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Variants for motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
  };

  const handleSelectCharacter = (character: UserIdentity) => {
    // Play click sound
    window.soundManager?.play("/sounds/click.mp3", { volume: 0.3 });

    // Play character-specific sound
    if (character === "zombie") {
      window.soundManager?.play("/sounds/zombie.mp3", { volume: 0.5 });
    } else if (character === "mummy") {
      window.soundManager?.play("/sounds/mummy.mp3", { volume: 0.5 });
    }

    setSelected(character);
  };

  const handleIdentitySelection = () => {
    if (!selected) {
      // Play error sound if no selection
      window.soundManager?.play("/sounds/error.mp3", { volume: 0.4 });

      toast({
        title: "Selection Required",
        description: "You must choose an identity before continuing.",
        variant: "destructive",
      });
      return;
    }

    // Play success sound
    window.soundManager?.play("/sounds/success.mp3", { volume: 0.4 });

    setIdentity(selected);
    toast({
      title: "Identity Chosen",
      description:
        selected === "zombie"
          ? "Welcome, brain connoisseur! The menu has been customized for your zombie tastes."
          : "Welcome, ancient one! The menu has been tailored to your royal mummy preferences.",
    });
    navigate("/menu");
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-8 text-undead-bone"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Choose Your Undead Identity
      </motion.h1>

      <motion.p
        className="text-lg mb-10 text-undead-bone text-opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Your choice will personalize your dining experience and menu options
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Zombie Option */}
        <motion.div
          className={`bg-undead-dark border-4 rounded-xl overflow-hidden cursor-pointer ${
            selected === "zombie"
              ? "border-green-500"
              : "border-undead-charcoal"
          }`}
          onClick={() => handleSelectCharacter("zombie")}
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src="/zombie.jpg"
              alt="Zombie"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 flex items-center">
              <Skull className="h-8 w-8 mr-2 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Zombie</h2>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-3 text-undead-green">
              Brain Connoisseur
            </h3>
            <p className="text-undead-bone text-opacity-80 mb-4">
              Embrace your zombie nature with our brain-focused menu and casual
              dining atmosphere. Menu items will feature humorous brain puns and
              bold flavors for the less refined palette.
            </p>
            <ul className="text-left text-undead-bone text-opacity-70 mb-6">
              <li className="mb-2">• Casual, gruesome atmosphere</li>
              <li className="mb-2">• Brain-focused menu items</li>
              <li>• Humorous, direct service style</li>
            </ul>
          </div>
        </motion.div>

        {/* Mummy Option */}
        <motion.div
          className={`bg-undead-dark border-4 rounded-xl overflow-hidden cursor-pointer ${
            selected === "mummy"
              ? "border-yellow-500"
              : "border-undead-charcoal"
          }`}
          onClick={() => handleSelectCharacter("mummy")}
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src="/mummy.jpg"
              alt="Mummy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 flex items-center">
              <Ghost className="h-8 w-8 mr-2 text-yellow-300" />
              <h2 className="text-2xl font-bold text-white">Mummy</h2>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-3 text-yellow-300">
              Royal Ancient One
            </h3>
            <p className="text-undead-bone text-opacity-80 mb-4">
              Experience the royal treatment with our Egyptian-themed menu and
              formal dining setting. Menu items will feature elegant names and
              sophisticated flavors for the ancient palette.
            </p>
            <ul className="text-left text-undead-bone text-opacity-70 mb-6">
              <li className="mb-2">• Elegant, ancient Egyptian atmosphere</li>
              <li className="mb-2">• Sophisticated preserved delicacies</li>
              <li>• Formal, respectful service style</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Button
          className="ritual-button"
          size="lg"
          onClick={handleIdentitySelection}
        >
          Confirm Identity & Continue
        </Button>
      </motion.div>
    </div>
  );
};

export default Identity;
