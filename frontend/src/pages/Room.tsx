
import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IdentityContext, OrderContext } from "@/App";
import { useQuery } from "@tanstack/react-query";
import { fetchRoomById } from "@/services/apiAdapter";
import { fetchMenuItemsByRoomId } from "@/services/apiAdapter";
import { MenuItem } from "@/types";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import RoomHeader from "@/components/menu/RoomHeader";
import ViewToggle from "@/components/menu/ViewToggle";
import MenuList from "@/components/menu/MenuList";
import MenuGrid from "@/components/menu/MenuGrid";

const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { identity } = useContext(IdentityContext);
  const { addToOrder } = useContext(OrderContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Fetch room details
  const { 
    data: room, 
    isLoading: roomLoading 
  } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => fetchRoomById(roomId || ''),
    enabled: !!roomId
  });
  
  // Fetch menu items for this room
  const { 
    data: menuItems, 
    isLoading: menuLoading 
  } = useQuery({
    queryKey: ['menuItems', roomId],
    queryFn: () => fetchMenuItemsByRoomId(roomId || ''),
    enabled: !!roomId
  });

  const handleAddToOrder = (item: MenuItem) => {
    addToOrder({
      id: item.id,
      name: getItemName(item),
      price: item.price
    });
    
    // Play sound effect
    const { playSound } = window as any;
    if (playSound) {
      playSound('click');
    }
    
    toast({
      title: "Added to Order",
      description: `${getItemName(item)} has been added to your ritual.`
    });
  };

  // Get the appropriate name based on identity
  const getItemName = (item: MenuItem) => {
    if (identity === "mummy") {
      return item.nameMummy;
    } else if (identity === "zombie") {
      return item.nameZombie;
    }
    return item.name;
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
    
    // Play sound effect
    const { playSound } = window as any;
    if (playSound) {
      playSound('click');
    }
  };

  // Loading state
  if (roomLoading || menuLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-2xl text-undead-bone">
          Conjuring ancient delicacies...
        </div>
      </div>
    );
  }

  // Error state
  if (!room || !menuItems) {
    return (
      <div className="text-center p-8 border border-undead-blood rounded-lg">
        <h2 className="text-2xl text-undead-blood mb-4">Room Not Found</h2>
        <p className="text-undead-bone mb-6">
          This cursed room seems to have vanished back into the netherworld.
        </p>
        <Button 
          variant="outline" 
          onClick={() => navigate("/menu")}
          className="border-undead-purple text-undead-purple"
        >
          Return to Rooms
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Room header with back button */}
      <div className="mb-6">
        <RoomHeader room={room} onBack={() => navigate('/menu')} />
      </div>
      
      {/* View toggle */}
      <div className="flex justify-end mb-6">
        <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
      </div>

      <motion.h2 
        className="text-2xl font-bold mb-6 text-undead-bone"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Menu Offerings
      </motion.h2>

      {/* Menu items - either list or grid view */}
      {viewMode === 'list' ? (
        <MenuList
          items={menuItems}
          identity={identity || ''}
          expandedItem={expandedItem}
          onToggleExpand={toggleExpand}
          onAddToOrder={handleAddToOrder}
        />
      ) : (
        <MenuGrid
          items={menuItems} 
          identity={identity || ''} 
          onAddToOrder={handleAddToOrder}
        />
      )}
    </div>
  );
};

export default Room;
