
import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onViewChange('grid')}
        className={viewMode === 'grid' ? 'bg-undead-purple' : ''}
      >
        <LayoutGrid className="h-5 w-5" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onViewChange('list')}
        className={viewMode === 'list' ? 'bg-undead-purple' : ''}
      >
        <LayoutList className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ViewToggle;
