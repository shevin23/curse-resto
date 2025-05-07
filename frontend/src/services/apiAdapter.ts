
import { Room, MenuItem, Order, OrderStatus } from "@/types";
import * as mockApi from "./api";
import * as roomService from "./roomService";
import * as menuItemService from "./menuItemService";
import * as orderService from "./orderService";

// Environment flag to determine whether to use real API or mock
// Default to true if not specified
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API !== "false";

console.log(`API adapter initialized. Using ${USE_REAL_API ? "real" : "mock"} API.`);

// Room services
export const fetchRooms = async (): Promise<Room[]> => {
  try {
    if (USE_REAL_API) {
      return await roomService.fetchRooms();
    } else {
      return await mockApi.fetchRooms();
    }
  } catch (error) {
    console.error("Error fetching rooms:", error);
    // Fallback to mock data if real API fails
    return await mockApi.fetchRooms();
  }
};

export const fetchRoomById = async (id: string): Promise<Room | null> => {
  try {
    if (USE_REAL_API) {
      return await roomService.fetchRoomById(id);
    } else {
      return await mockApi.fetchRoomById(id);
    }
  } catch (error) {
    console.error(`Error fetching room ${id}:`, error);
    // Fallback to mock data if real API fails
    return await mockApi.fetchRoomById(id);
  }
};

// Menu item services
export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  try {
    if (USE_REAL_API) {
      return await menuItemService.fetchMenuItems();
    } else {
      return await mockApi.fetchMenuItems();
    }
  } catch (error) {
    console.error("Error fetching menu items:", error);
    // Fallback to mock data if real API fails
    return await mockApi.fetchMenuItems();
  }
};

export const fetchMenuItemsByRoomId = async (roomId: string): Promise<MenuItem[]> => {
  try {
    if (USE_REAL_API) {
      return await menuItemService.fetchMenuItemsByRoomId(roomId);
    } else {
      return await mockApi.fetchMenuItemsByRoomId(roomId);
    }
  } catch (error) {
    console.error(`Error fetching menu items for room ${roomId}:`, error);
    // Fallback to mock data if real API fails
    return await mockApi.fetchMenuItemsByRoomId(roomId);
  }
};

// Order services
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

export const submitOrder = async (order: OrderSubmission): Promise<{success: boolean; orderId: string}> => {
  try {
    if (USE_REAL_API) {
      return await orderService.createOrder(order);
    } else {
      return await mockApi.submitOrder(order);
    }
  } catch (error) {
    console.error("Error submitting order:", error);
    // Fallback to mock submission if real API fails
    return await mockApi.submitOrder(order);
  }
};

export const fetchOrderById = async (id: string): Promise<Order | null> => {
  try {
    if (USE_REAL_API) {
      return await orderService.fetchOrderById(id);
    } else {
      // Assuming mock API has this function
      return null;
    }
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    return null;
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order | null> => {
  try {
    if (USE_REAL_API) {
      return await orderService.updateOrderStatus(orderId, status);
    } else {
      // Assuming mock API doesn't have this function
      return null;
    }
  } catch (error) {
    console.error(`Error updating order status ${orderId}:`, error);
    return null;
  }
};

export const fetchOrdersByCustomerEmail = async (email: string): Promise<Order[]> => {
  try {
    if (USE_REAL_API) {
      return await orderService.fetchOrdersByCustomerEmail(email);
    } else {
      // Assuming mock API doesn't have this function
      return [];
    }
  } catch (error) {
    console.error(`Error fetching orders for email ${email}:`, error);
    return [];
  }
};
