import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IdentityContext, OrderContext } from "../App";
import SpinningWheel from "../components/SpinningWheel";
import MenuItemModal from "../components/MenuItemModal";
import { MenuItem } from "@/types";

const SpinningWheelPage = () => {
  const { identity } = useContext(IdentityContext);
  const { addToOrder } = useContext(OrderContext);
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data - replace with your actual menu items
  const wheelMenuItems: MenuItem[] = [
    // {
    //   id: "brain-souffle",
    //   name: "Brain Soufflé",
    //   nameMummy: "Cranium of Ra",
    //   nameZombie: "Think Tank Supreme",
    //   description:
    //     "A delicately prepared soufflé made with the finest cerebral matter.",
    //   ingredients: ["Fresh brain", "Egg whites", "Nerve ganglion reduction"],
    //   price: 18.99,
    //   curseLevel: 3,
    //   imageUrl: "/brain-souffle.png",
    //   roomId: "brain-tasting-chamber",
    //   uuid: "brain-souffle",
    //   createdAt: "",
    //   updatedAt: "",
    // },
    // Add more items as needed
  ];

  const handleSelectMenuItem = (menuItem: MenuItem) => {
    setSelectedItem(menuItem);
    setShowModal(true);
  };

  const handleAcceptItem = () => {
    if (selectedItem) {
      addToOrder({
        id: selectedItem.id,
        name:
          identity === "mummy"
            ? selectedItem.nameMummy
            : identity === "zombie"
            ? selectedItem.nameZombie
            : selectedItem.name,
        price: selectedItem.price,
      });
    }
    setShowModal(false);
  };

  const handleRejectItem = () => {
    setShowModal(false);
  };

  return (
    <div className="spinning-wheel-page">
      <h1 className="text-2xl font-bold mb-4">Spin the Wheel of Fate!</h1>
      <p className="mb-8">Try your luck and get a random spooky drink!</p>

      <SpinningWheel
        menuItems={wheelMenuItems}
        onSelectMenuItem={handleSelectMenuItem}
        isDisabled={false}
      />

      <button
        onClick={() => navigate("/menu")}
        className="mt-8 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        Back to Menu
      </button>

      <MenuItemModal
        isOpen={showModal}
        menuItem={selectedItem}
        onClose={() => setShowModal(false)}
        onAccept={handleAcceptItem}
        onReject={handleRejectItem}
      />
    </div>
  );
};

export default SpinningWheelPage;
