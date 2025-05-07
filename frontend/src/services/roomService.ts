
import { apiRequest } from './apiClient';
import { Room } from '@/types';

export async function fetchRooms(): Promise<Room[]> {
  return apiRequest<Room[]>('/rooms');
}

export async function fetchRoomById(id: string): Promise<Room> {
  return apiRequest<Room>(`/rooms/${id}`);
}
