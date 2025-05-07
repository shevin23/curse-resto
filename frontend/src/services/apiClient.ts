
// Base API client for making requests to the Symfony API Platform backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface ApiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  authenticate?: boolean;
}

/**
 * Handles API requests to the Symfony API Platform backend
 * 
 * @param endpoint - API endpoint path (without base URL)
 * @param options - Request options
 * @returns Promise with typed response data
 */
export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { 
    method = 'GET', 
    headers = {}, 
    body,
    authenticate = true 
  } = options;
  
  const requestHeaders: HeadersInit = {
    'Accept': 'application/ld+json',
    'Content-Type': 'application/ld+json',
    ...headers
  };
  
  // Get authentication token if available
  if (authenticate) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }
  
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include', // Include cookies for authentication
  };
  
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }
  
  try {
    console.log(`API Request: ${method} ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    
    if (!response.ok) {
      // Attempt to parse error response
      let errorData: any = {};
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
      } catch (e) {
        // Ignore parsing error, use default message
      }
      
      const error = new Error(
        errorData.message || 
        errorData['hydra:description'] || 
        errorData.detail ||
        `API Error: ${response.status} ${response.statusText}`
      );
      
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }
    
    // Check if there's content to parse
    const contentType = response.headers.get('content-type');
    
    if (contentType && (contentType.includes('application/json') || contentType.includes('application/ld+json'))) {
      const data = await response.json();
      
      // If response contains hydra collection, extract the items
      if (data['@type'] === 'hydra:Collection' || data.member) {
        return normalizeApiData(data.member) as T;
      }
      
      // For single item responses
      return normalizeApiData(data) as T;
    }
    
    return {} as T;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

/**
 * Utility to extract ID from API Platform IRIs
 * Example: "/api/rooms/123" -> "123"
 */
export function extractIdFromIri(iri: string): string {
  const parts = iri.split('/');
  return parts[parts.length - 1];
}

/**
 * Format data from API Platform to match our interfaces
 * Can handle both collections and single items
 */
export function normalizeApiData<T>(data: any): T {
  if (Array.isArray(data)) {
    return data.map(item => normalizeItem(item)) as unknown as T;
  }
  return normalizeItem(data) as T;
}

/**
 * Normalize a single API Platform item to match our frontend interfaces
 */
function normalizeItem(item: any): any {
  if (!item || typeof item !== 'object') return item;
  
  const normalized: any = {};
  
  // Convert numeric ID to string if needed
  if (item.id !== undefined) {
    normalized.id = String(item.id);
  } else if (item['@id']) {
    normalized.id = extractIdFromIri(item['@id']);
  }
  
  // Map other properties
  Object.entries(item).forEach(([key, value]) => {
    // Skip API Platform specific fields
    if (key.startsWith('@') || key === 'id') return;
    
    // Handle imageUrl correctly by prepending the base URL if it's a relative path
    if (key === 'imageUrl' && typeof value === 'string' && value.startsWith('/')) {
      // Trim the leading '/' to avoid double slashes
      const cleanPath = value.startsWith('/') ? value.substring(1) : value;
      normalized[key] = `${window.location.origin}/${cleanPath}`;
    } else {
      // Standard property mapping
      normalized[key] = value;
    }
  });
  
  return normalized;
}
