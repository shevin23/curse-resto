// Mock API service to simulate backend calls

// Types for our data models
export interface MenuItem {
  id: string;
  name: string;
  nameMummy: string; // Egyptian style name
  nameZombie: string; // Humorous brain-related name
  description: string;
  ingredients: string[];
  price: number;
  roomId: string;
  curseLevel: number; // 1-5, representing spice or decay rating
  imageUrl: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

// Mock data for rooms
const rooms: Room[] = [
  {
    id: "sarcophagus-lounge",
    name: "Sarcophagus Lounge",
    description:
      "An elegant gathering space adorned with ancient Egyptian artifacts and comfortable seating made from repurposed sarcophagi. Perfect for a quiet drink or appetizers.",
    imageUrl: "/sarcophagus-lounge.jpg",
  },
  {
    id: "brain-tasting-chamber",
    name: "Brain Tasting Chamber",
    description:
      "Our speciality room featuring our finest cerebral delicacies. Each dish prepared to preserve the delicate flavors of gray matter.",
    imageUrl: "/brain-chamber.jpg",
  },
  {
    id: "crypt-kitchen",
    name: "Crypt Kitchen",
    description:
      "Watch our undead chefs prepare meals in this open-concept kitchen built within an ancient crypt. Main courses and chef's specialties served here.",
    imageUrl: "/crypt-kitchen.jpg",
  },
  {
    id: "rotten-cellar",
    name: "Rotten Cellar",
    description:
      "Our aged foods section, where delicacies have been left to properly decompose to perfection. Features our most pungent and flavorful dishes.",
    imageUrl: "/rotten-cellar.jpg",
  },
];

// Mock data for menu items
const menuItems: MenuItem[] = [
  {
    id: "brain-souffle",
    name: "Brain Soufflé",
    nameMummy: "Cranium of Ra",
    nameZombie: "Think Tank Supreme",
    description:
      "A delicately prepared soufflé made with the finest cerebral matter, served with a side of nerve ganglion sauce.",
    ingredients: [
      "Fresh brain",
      "Egg whites",
      "Nerve ganglion reduction",
      "Skull dust",
    ],
    price: 18.99,
    roomId: "brain-tasting-chamber",
    curseLevel: 3,
    imageUrl: "/brain-souffle.png",
  },
  {
    id: "mummified-duck",
    name: "Mummified Duck",
    nameMummy: "Embalment of Amun-Duck",
    nameZombie: "Wrapped Quacker",
    description:
      "Duck prepared in the traditional mummification process, wrapped in preserved bandages made of edible rice paper.",
    ingredients: [
      "Aged duck",
      "Natron salt",
      "Preserved herbs",
      "Edible bandages",
    ],
    price: 24.99,
    roomId: "sarcophagus-lounge",
    curseLevel: 4,
    imageUrl: "/mummified-duck.png",
  },
  {
    id: "pharaohs-feast",
    name: "Pharaoh's Feast",
    nameMummy: "Banquet of Tutankhamun",
    nameZombie: "Big Boss Platter",
    description:
      "A royal spread fit for the rulers of the underworld. Includes a sampling of our finest dishes arranged on a golden platter.",
    ingredients: [
      "Chef's selection",
      "Golden honey",
      "Sacred beetles",
      "Mummified fruits",
    ],
    price: 42.99,
    roomId: "sarcophagus-lounge",
    curseLevel: 5,
    imageUrl: "/pharaohs-feast.png",
  },
  {
    id: "tomb-tacos",
    name: "Tomb Tacos",
    nameMummy: "Folded Papyrus of Anubis",
    nameZombie: "Skull Shell Munchies",
    description:
      "Crispy taco shells made from ancient grain tortillas, filled with your choice of decaying meats and garnished with tomb-grown herbs.",
    ingredients: [
      "Ancient grain shells",
      "Decayed meat",
      "Tomb herbs",
      "Mummy dust",
    ],
    price: 16.99,
    roomId: "crypt-kitchen",
    curseLevel: 2,
    imageUrl: "/tomb-tacos.png",
  },
  {
    id: "rotting-ribeye",
    name: "Rotting Ribeye",
    nameMummy: "Decayed Offering of Osiris",
    nameZombie: "Maggot-Aged Beef Slab",
    description:
      "Prime cut ribeye steak aged to perfection through natural decomposition processes. The maggots add a unique tang.",
    ingredients: [
      "Aged ribeye",
      "Maggot secretions",
      "Decay fungi",
      "Bone marrow",
    ],
    price: 34.99,
    roomId: "rotten-cellar",
    curseLevel: 5,
    imageUrl: "/rotting-ribeye.jpg",
  },
  {
    id: "cerebral-smoothie",
    name: "Cerebral Smoothie",
    nameMummy: "Elixir of Thought",
    nameZombie: "Brain Shake",
    description:
      "Blended brain matter mixed with yogurt cultures and fermented fruits. Served ice cold to preserve the delicate neural flavors.",
    ingredients: [
      "Blended brain",
      "Fermented berries",
      "Yogurt cultures",
      "Crushed ice",
    ],
    price: 9.99,
    roomId: "brain-tasting-chamber",
    curseLevel: 2,
    imageUrl: "/cerebral-smoothie.jpg",
  },
  {
    id: "mummy-wrap",
    name: "Mummy Wrap",
    nameMummy: "Sacred Bandage Roll",
    nameZombie: "Tight Wrap Surprise",
    description:
      "Our take on a wrap sandwich, with layers of preserved meats and pickled vegetables wrapped tightly in an edible bandage-like flatbread.",
    ingredients: [
      "Flatbread",
      "Preserved meats",
      "Pickled vegetables",
      "Mummy spices",
    ],
    price: 14.99,
    roomId: "crypt-kitchen",
    curseLevel: 3,
    imageUrl: "/mummy-wrap.jpg",
  },
  {
    id: "bog-body-stew",
    name: "Bog Body Stew",
    nameMummy: "Marsh Preservation Broth",
    nameZombie: "Swamp Thing Soup",
    description:
      "A hearty stew made with meats preserved naturally in peat bogs for hundreds of years, giving it a unique earthy flavor.",
    ingredients: [
      "Bog-preserved meat",
      "Peat moss",
      "Root vegetables",
      "Stagnant water",
    ],
    price: 19.99,
    roomId: "rotten-cellar",
    curseLevel: 4,
    imageUrl: "/bog-body-stew.jpg",
  },
];

// API mock functions
export const fetchRooms = async (): Promise<Room[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return rooms;
};

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700));
  return menuItems;
};

export const fetchRoomById = async (id: string): Promise<Room | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return rooms.find((room) => room.id === id) || null;
};

export const fetchMenuItemsByRoomId = async (
  roomId: string
): Promise<MenuItem[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  return menuItems.filter((item) => item.roomId === roomId);
};

// Submission endpoint mock
export interface OrderSubmission {
  identity: string;
  items: {
    id: string;
    quantity: number;
  }[];
  customerDetails: {
    name: string;
    email: string;
    specialRequests?: string;
  };
}

export const submitOrder = async (
  order: OrderSubmission
): Promise<{ success: boolean; orderId: string }> => {
  // Simulate API delay and processing
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Always succeed in our mock
  return {
    success: true,
    orderId: `UB-${Math.floor(Math.random() * 10000)}`,
  };
};
