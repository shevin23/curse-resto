import React, { useState, useRef, useEffect, CSSProperties } from "react";
import { MailQuestion as QuestionMark } from "lucide-react";
import { fetchMenuItems, MenuItem } from "@/services/api";
// Update the import path

interface SpinningWheelProps {
  menuItems: MenuItem[];
  onSelectMenuItem: (menuItem: MenuItem) => void;
  isDisabled?: boolean;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({
  onSelectMenuItem,
  isDisabled = false,
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Fetch menu items on component mount
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setIsLoading(true);
        const items = await fetchMenuItems();
        setMenuItems(items);
        if (items.length > 0 && wheelRef.current) {
          const initialRotation = Math.random() * 360;
          setRotation(initialRotation);
        }
      } catch (err) {
        setError("Failed to load menu items");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  // Color definitions
  const colors = {
    segment1: "#4a148c",
    segment2: "#6a1b9a",
    segment3: "#7b1fa2",
    segment4: "#8e24aa",
    questionMarkBg: "#7c2d12",
    wheelBorder: "#300840",
    wheelBg: "#1a0226",
    pointer: "#f97316",
    buttonGradientStart: "#f97316",
    buttonGradientEnd: "#ea580c",
    buttonHoverStart: "#ea580c",
    buttonHoverEnd: "#c2410c",
    disabledStart: "#9ca3af",
    disabledEnd: "#6b7280",
    white: "#f8fafc",
  };

  const spinWheel = () => {
    if (isSpinning || menuItems.length === 0 || isDisabled) return;

    setIsSpinning(true);
    const fullRotations = 5 + Math.floor(Math.random() * 5);
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + fullRotations * 360 + randomAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      const numberOfItems = menuItems.length;
      const degreePerItem = 360 / numberOfItems;
      const normalizedAngle = totalRotation % 360;
      const selectedIndex =
        Math.floor(normalizedAngle / degreePerItem) % numberOfItems;

      setIsSpinning(false);
      onSelectMenuItem(menuItems[selectedIndex]);
    }, 4000);
  };

  const getItemStyle = (index: number): CSSProperties => {
    const angle = (index * 360) / menuItems.length;
    const radius = 120;
    return {
      position: "absolute",
      left: `calc(50% + ${radius * Math.sin((angle * Math.PI) / 180)}px)`,
      top: `calc(50% - ${radius * Math.cos((angle * Math.PI) / 180)}px)`,
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      width: "40px",
      height: "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
  };

  const getSegmentStyle = (index: number): CSSProperties => {
    const segmentAngle = 360 / menuItems.length;
    const colorOptions = [
      colors.segment1,
      colors.segment2,
      colors.segment3,
      colors.segment4,
    ];
    return {
      position: "absolute",
      width: "50%",
      height: "50%",
      transformOrigin: "0% 100%",
      left: "50%",
      top: "0%",
      transform: `rotate(${index * segmentAngle}deg) skewY(${
        90 - segmentAngle
      }deg)`,
      backgroundColor: colorOptions[index % colorOptions.length],
      border: "1px solid rgba(255,255,255,0.3)",
      boxSizing: "border-box",
    };
  };

  // Wheel styles
  const wheelStyle: CSSProperties = {
    position: "relative",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    overflow: "hidden",
    margin: "2rem auto",
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
    transition: "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)",
    transform: `rotate(${rotation}deg)`,
    willChange: "transform",
  };

  // Center circle styles
  const centerStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50px",
    height: "50px",
    backgroundColor: colors.wheelBg,
    borderRadius: "50%",
    zIndex: 2,
    boxShadow: "0 0 15px rgba(0,0,0,0.7), inset 0 0 10px rgba(255,255,255,0.2)",
    border: "3px solid " + colors.white,
  };

  // Pointer styles
  const pointerStyle: CSSProperties = {
    position: "absolute",
    top: "-30px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "15px solid transparent",
    borderRight: "15px solid transparent",
    borderTop: "30px solid " + colors.pointer,
    zIndex: 3,
    filter: "drop-shadow(0 0 5px rgba(0,0,0,0.5))",
    animation: !isSpinning ? "wiggle 0.5s infinite" : "none",
  };

  // Question mark container styles
  const questionMarkContainerStyle: CSSProperties = {
    width: "45px",
    height: "45px",
    backgroundColor: colors.questionMarkBg,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow:
      "0 4px 8px rgba(0, 0, 0, 0.3), inset 0 0 6px rgba(255, 255, 255, 0.2)",
    border: "2px solid " + colors.white,
    color: colors.white,
    fontWeight: "bold",
  };

  // Button styles
  const buttonStyle: CSSProperties = {
    background: `linear-gradient(135deg, ${colors.buttonGradientStart}, ${colors.buttonGradientEnd})`,
    color: "white",
    border: "none",
    padding: "1rem 2.5rem",
    fontSize: "1.2rem",
    fontWeight: 600,
    borderRadius: "2rem",
    cursor: isDisabled || isSpinning ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: "1rem",
    ...(isDisabled || isSpinning
      ? {
          background: `linear-gradient(135deg, ${colors.disabledStart}, ${colors.disabledEnd})`,
          transform: "none",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        }
      : {}),
  };

  // Animation styles
  const keyframes = `
    @keyframes wiggle {
      0% { transform: translateX(-50%) rotate(0deg); }
      25% { transform: translateX(-50%) rotate(5deg); }
      50% { transform: translateX(-50%) rotate(0deg); }
      75% { transform: translateX(-50%) rotate(-5deg); }
      100% { transform: translateX(-50%) rotate(0deg); }
    }
  `;

  if (isLoading) return <div>Loading menu items...</div>;
  if (error) return <div>Error: {error}</div>;
  if (menuItems.length === 0) return <div>No menu items available</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "500px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <style>{keyframes}</style>
      <h2 style={{ marginBottom: "1rem" }}>Spin for a Random Spooky Dish!</h2>

      <div ref={wheelRef} style={wheelStyle}>
        {/* Wheel Segments */}
        {menuItems.map((_, index) => (
          <div key={`segment-${index}`} style={getSegmentStyle(index)} />
        ))}

        {/* Center Circle */}
        <div style={centerStyle}></div>

        {/* Menu Item Markers */}
        {menuItems.map((item, index) => (
          <div key={`item-${item.id}`} style={getItemStyle(index)}>
            <div style={questionMarkContainerStyle}>
              <QuestionMark size={30} color="rgba(255, 255, 255, 0.9)" />
            </div>
          </div>
        ))}

        {/* Pointer */}
        <div style={pointerStyle}></div>
      </div>

      <button
        style={buttonStyle}
        onClick={spinWheel}
        disabled={isDisabled || isSpinning || menuItems.length === 0}
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel"}
      </button>
    </div>
  );
};

export default SpinningWheel;
