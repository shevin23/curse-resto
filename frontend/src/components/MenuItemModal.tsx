import React, { useEffect, useRef } from "react";
import { X, Skull, Flame } from "lucide-react";
import "./MenuItemModal.css";
import { MenuItem } from "@/services/api";

interface MenuItemModalProps {
  isOpen: boolean;
  menuItem: MenuItem | null;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({
  isOpen,
  menuItem,
  onClose,
  onAccept,
  onReject,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto"; // Re-enable scrolling
    };
  }, [isOpen, onClose]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !menuItem) return null;

  // Render curse level as flame icons
  const renderCurseLevel = (level: number) => {
    return Array(5)
      .fill(0)
      .map((_, idx) => (
        <Flame
          key={idx}
          size={20}
          className={`curse-flame ${idx < level ? "active" : "inactive"}`}
        />
      ));
  };

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="menu-item-modal">
        <div className="modal-header">
          <h2>{menuItem.name}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="menu-item-image">
            <img src={menuItem.imageUrl} alt={menuItem.name} />
          </div>

          <div className="menu-item-info">
            <div className="alternate-names">
              <div className="name-card">
                <h4>Mummy Name</h4>
                <p>{menuItem.nameMummy}</p>
              </div>
              <div className="name-card">
                <h4>Zombie Name</h4>
                <p>{menuItem.nameZombie}</p>
              </div>
            </div>

            <div className="curse-level">
              <span className="label">Curse Level:</span>
              <div className="curse-flames">
                {renderCurseLevel(menuItem.curseLevel)}
              </div>
            </div>

            <p className="description">{menuItem.description}</p>

            <div className="price">
              <Skull size={20} />
              <span>${menuItem.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="reject-button" onClick={onReject}>
            No Thanks
          </button>
          <button className="accept-button" onClick={onAccept}>
            I'll Take It!
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;
