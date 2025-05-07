
import React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "@/types";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuItemProps {
  item: MenuItem;
  identity: string;
  expanded: boolean;
  onToggleExpand: () => void;
  onAddToOrder: () => void;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({
  item,
  identity,
  expanded,
  onToggleExpand,
  onAddToOrder,
}) => {
  // Get the appropriate name based on identity
  const getItemName = () => {
    if (identity === "mummy") {
      return item.nameMummy;
    } else if (identity === "zombie") {
      return item.nameZombie;
    }
    return item.name;
  };

  return (
    <div className="menu-scroll" onClick={onToggleExpand}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-undead-charcoal">
            {getItemName()}
          </h3>
          <p className="text-undead-charcoal text-opacity-80 mt-1">
            {item.description}
          </p>
        </div>
        <div className="text-xl font-bold text-undead-charcoal">
          ${item.price.toFixed(2)}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4">
            <h4 className="font-semibold text-undead-charcoal">Ingredients:</h4>
            <ul className="list-disc list-inside text-undead-charcoal text-opacity-80">
              {item.ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold text-undead-charcoal">Curse Level:</h4>
            <div className="flex items-center mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-5 h-5 rounded-full mr-1 ${
                    i < item.curseLevel ? 'bg-undead-blood' : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToOrder();
            }}
            className="mt-2 bg-undead-charcoal hover:bg-undead-dark text-undead-bone"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Order
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MenuItemComponent;
