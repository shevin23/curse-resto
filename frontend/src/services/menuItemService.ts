
import { apiRequest } from './apiClient';
import { MenuItem } from '@/types';

export async function fetchMenuItems(): Promise<MenuItem[]> {
  return apiRequest<MenuItem[]>('/menu_items');
}

export async function fetchMenuItemsByRoomId(roomId: string): Promise<MenuItem[]> {
  // API Platform filter syntax
  return apiRequest<MenuItem[]>(`/menu_items?roomId=${roomId}`);
}
