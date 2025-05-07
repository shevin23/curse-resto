
import React from "react";
import { motion } from "framer-motion";
import { Room } from "@/types";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoomHeaderProps {
  room: Room;
  onBack: () => void;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({ room, onBack }) => {
  return (
    <div className="relative h-64 rounded-xl overflow-hidden mb-8">
      <img 
        src={room.imageUrl} 
        alt={room.name} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          className="bg-black bg-opacity-50 text-white" 
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 p-6">
        <motion.h1 
          className="text-4xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {room.name}
        </motion.h1>
        <motion.p 
          className="text-white text-opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {room.description}
        </motion.p>
      </div>
    </div>
  );
};

export default RoomHeader;
