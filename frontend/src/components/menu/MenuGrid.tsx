
import React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "@/types";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuGridProps {
  items: MenuItem[];
  identity: string;
  onAddToOrder: (item: MenuItem) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  identity,
  onAddToOrder,
}) => {
  // Get the appropriate name based on identity
  const getItemName = (item: MenuItem) => {
    if (identity === "mummy") {
      return item.nameMummy;
    } else if (identity === "zombie") {
      return item.nameZombie;
    }
    return item.name;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 15
      } 
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.div 
          key={item.id}
          className="menu-scroll p-4"
          style={{ "--scroll-index": index } as React.CSSProperties}
          variants={itemVariants}
        >
          <h3 className="text-xl font-bold text-undead-charcoal text-center mb-3">
            {getItemName(item)}
          </h3>
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 rounded-full bg-undead-bone flex items-center justify-center overflow-hidden">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <ShoppingCart size={30} className="text-undead-charcoal" />
              )}
            </div>
          </div>
          <p className="text-undead-charcoal text-opacity-80 text-center mb-3 line-clamp-2">
            {item.description}
          </p>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xl font-bold text-undead-charcoal">
              ${item.price.toFixed(2)}
            </div>
            <div>
              {Array.from({ length: 5 }).map((_, i) => (
                <span 
                  key={i}
                  className={`inline-block w-3 h-3 rounded-full mx-0.5 ${
                    i < item.curseLevel ? 'bg-undead-blood' : 'bg-gray-300'
                  }`}
                ></span>
              ))}
            </div>
          </div>
          <Button 
            onClick={() => onAddToOrder(item)}
            className="w-full bg-undead-charcoal hover:bg-undead-dark text-undead-bone"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Order
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MenuGrid;
