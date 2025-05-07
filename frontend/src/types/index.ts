
// Room type definitions
export interface Room {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

// Menu item type definitions
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

// OrderItem type definitions
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Order status type
export type OrderStatus = 'preparing' | 'summoning' | 'delivering' | 'completed';

// Order type definitions
export interface Order {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  customerDetails: {
    name: string;
    email: string;
    specialRequests?: string;
  };
  identity: string; // 'zombie' or 'mummy'
  createdAt: string;
  updatedAt: string;
}
