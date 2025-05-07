
import React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "@/types";
import MenuItemComponent from "./MenuItem";

interface MenuListProps {
  items: MenuItem[];
  identity: string;
  expandedItem: string | null;
  onToggleExpand: (itemId: string) => void;
  onAddToOrder: (item: MenuItem) => void;
}

const MenuList: React.FC<MenuListProps> = ({
  items,
  identity,
  expandedItem,
  onToggleExpand,
  onAddToOrder,
}) => {
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
      className="grid grid-cols-1 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.div 
          key={item.id} 
          style={{ "--scroll-index": index } as React.CSSProperties}
          variants={itemVariants}
        >
          <MenuItemComponent
            item={item}
            identity={identity}
            expanded={expandedItem === item.id}
            onToggleExpand={() => onToggleExpand(item.id)}
            onAddToOrder={() => onAddToOrder(item)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MenuList;
