
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IdentityContext } from "@/App";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Utensils, Skull, Ghost } from "lucide-react";

const Index = () => {
  const { identity } = useContext(IdentityContext);
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate loading for animation purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + i * 0.2,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Hero section */}
      <motion.div 
        className="relative mb-12 p-8 rounded-xl bg-undead-dark bg-opacity-80 border border-undead-purple shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-undead-bone"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          The Undead Buffet
        </motion.h1>
        <motion.h2 
          className="text-xl md:text-2xl lg:text-3xl text-undead-purple mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          Fine Dining for Zombies & Mummies
        </motion.h2>
        <motion.p 
          className="text-lg mb-8 text-undead-bone text-opacity-90 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.7 }}
        >
          Welcome to the afterlife's premier dining establishment, where the dead come to feast. 
          Our specialties include brain-based delicacies, mummified meats, and a range of decomposing delights.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          {!identity ? (
            <Button 
              className="ritual-button"
              size="lg"
              onClick={() => navigate("/identity")}
            >
              Choose Your Undead Identity
            </Button>
          ) : (
            <>
              <Button 
                className="ritual-button"
                size="lg"
                onClick={() => navigate("/menu")}
              >
                <Utensils className="mr-2 h-5 w-5" />
                Explore Our Cursed Rooms
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/identity")}
                className="border-undead-purple text-undead-purple hover:bg-undead-purple hover:text-undead-bone"
              >
                Change Identity
              </Button>
            </>
          )}
        </motion.div>

        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12">
          <div className="torch-light"></div>
        </div>
      </motion.div>

      {/* Features section */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <motion.div
          className="parchment"
          custom={0}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <Ghost className="h-12 w-12 mx-auto mb-4 text-undead-dark" />
          <h3 className="text-2xl font-bold mb-3 text-undead-dark">Cursed Room Navigation</h3>
          <p className="text-undead-charcoal">
            Explore our establishment through uniquely themed rooms, each offering 
            a different culinary experience. From the elegant Sarcophagus Lounge to 
            the pungent Rotten Cellar, each space has its own ambiance and menu offerings.
          </p>
        </motion.div>

        <motion.div
          className="parchment"
          custom={1}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <Skull className="h-12 w-12 mx-auto mb-4 text-undead-dark" />
          <h3 className="text-2xl font-bold mb-3 text-undead-dark">Zombie & Mummy Experience</h3>
          <p className="text-undead-charcoal">
            Choose your undead identity and enjoy a personalized dining experience.
            Mummies enjoy elegant, formal service with ancient Egyptian flair, while zombies
            receive our more casual, brain-focused offerings with humorous presentation.
          </p>
        </motion.div>
      </div>

      {/* Call to action */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-undead-bone">Ready to feast?</h2>
        <p className="text-xl mb-6 text-undead-bone text-opacity-80">
          Join us for an unforgettable dining experience beyond the grave
        </p>
        <Button 
          className="ritual-button"
          size="lg"
          onClick={() => navigate(!identity ? "/identity" : "/menu")}
        >
          Begin Your Ritual
        </Button>
      </motion.div>
    </div>
  );
};

export default Index;
