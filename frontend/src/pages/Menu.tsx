
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IdentityContext } from "@/App";
import { useQuery } from "@tanstack/react-query";
import { fetchRooms } from "@/services/apiAdapter";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Menu = () => {
  const { identity } = useContext(IdentityContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch rooms from API
  const { data: rooms = [], isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms
  });
  
  useEffect(() => {
    // Redirect to identity selection if no identity is selected
    if (!identity) {
      toast({
        title: "Choose Your Identity First",
        description: "You must select whether you're a zombie or mummy before entering.",
        variant: "destructive",
      });
      navigate("/identity");
    }
  }, [identity, navigate, toast]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
      } 
    }
  };

  const roomVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 15,
        stiffness: 100
      } 
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-2xl text-undead-bone">
          Summoning the cursed rooms...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 border border-undead-blood rounded-lg">
        <h2 className="text-2xl text-undead-blood mb-4">Curse Failed!</h2>
        <p className="text-undead-bone">
          We couldn't summon the rooms from the netherworld. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-6 text-undead-bone text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Cursed Rooms
      </motion.h1>
      
      <motion.p 
        className="text-lg mb-10 text-undead-bone text-opacity-80 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Select a room to explore its culinary offerings
      </motion.p>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Array.isArray(rooms) && rooms.map((room) => (
          <motion.div 
            key={room.id} 
            className="room-card"
            onClick={() => navigate(`/room/${room.id}`)}
            variants={roomVariants}
          >
            <img 
              src={room.imageUrl} 
              alt={room.name} 
              className="w-full h-full object-cover"
            />
            <div className="room-card-content">
              <h2 className="text-2xl font-bold text-white mb-2">{room.name}</h2>
              <p className="text-white text-opacity-80 text-sm line-clamp-2">
                {room.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Menu;
