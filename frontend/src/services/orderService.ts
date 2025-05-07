
import { apiRequest } from './apiClient';
import { Order, OrderStatus } from '@/types';

export interface CreateOrderRequest {
  uuid?: string;
  status: OrderStatus;
  identity: string;
  customerName: string;
  customerEmail: string;
  specialRequests?: string;
  orderItems: {
    menuItem: string; // IRI of the menu item
    quantity: number;
    name?: string;
    price?: string;
  }[];
}

export async function createOrder(orderData: {
  identity: string;
  items: { id: string; quantity: number }[];
  customerDetails: {
    name: string;
    email: string;
    specialRequests?: string;
  };
}): Promise<{ success: boolean; orderId: string }> {
  // Transform the request to match API Platform's expected format
  const transformedData: CreateOrderRequest = {
    status: 'preparing',
    identity: orderData.identity,
    customerName: orderData.customerDetails.name,
    customerEmail: orderData.customerDetails.email,
    specialRequests: orderData.customerDetails.specialRequests,
    orderItems: orderData.items.map(item => ({
      menuItem: `/api/menu_items/${item.id}`,
      quantity: item.quantity
    }))
  };
  
  const response = await apiRequest<any>('/orders', {
    method: 'POST',
    body: transformedData,
  });
  
  return {
    success: true,
    orderId: response.id || response.uuid
  };
}

export async function fetchOrderById(id: string): Promise<Order> {
  return apiRequest<Order>(`/orders/${id}`);
}

export async function fetchOrdersByCustomerEmail(email: string): Promise<Order[]> {
  // API Platform filter syntax
  return apiRequest<Order[]>(`/orders?customerEmail=${email}`);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  return apiRequest<Order>(`/orders/${orderId}`, {
    method: 'PATCH',
    body: { status },
  });
}
