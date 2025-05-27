import axios from 'axios';
import { TorDetails } from '../types';

/**
 * Base URL for the Onionoo API
 */
export const DEFAULT_API_URL = 'https://onionoo.torproject.org';

/**
 * Builds a URL for the Onionoo API details endpoint with the given search parameters
 * @param baseUrl - The base URL for the Onionoo API
 * @param searchTerm - The search term to use
 * @returns The full URL for the API request
 */
export function buildDetailsUrl(baseUrl: string, searchTerm?: string): string {
  const url = new URL(`${baseUrl}/details`);
  
  if (searchTerm) {
    url.searchParams.append('search', searchTerm);
  }
  
  return url.toString();
}

/**
 * Builds a URL for the Onionoo API with specific search parameters
 * @param baseUrl - The base URL for the Onionoo API
 * @param params - The search parameters to use
 * @returns The full URL for the API request
 */
export function buildAdvancedUrl(baseUrl: string, params: Record<string, string>): string {
  const url = new URL(`${baseUrl}/details`);
  
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  
  return url.toString();
}

/**
 * Fetches data from the Onionoo API
 * @param url - The URL to fetch from
 * @returns The parsed JSON response
 * @throws Error if the request fails
 */
export async function fetchFromApi<T>(url: string): Promise<T> {
  try {
    const response = await axios.get(url);
    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch from API: ${error.message} (Status: ${error.response?.status || 'unknown'})`);
    }
    throw new Error('Unknown error occurred while fetching from API');
  }
}

/**
 * Fetches details from the Onionoo API
 * @param baseUrl - The base URL for the Onionoo API
 * @param searchTerm - The search term to use
 * @returns The parsed details response
 */
export async function fetchDetails(
  baseUrl: string = DEFAULT_API_URL,
  searchTerm?: string
): Promise<TorDetails> {
  const url = buildDetailsUrl(baseUrl, searchTerm);
  return await fetchFromApi<TorDetails>(url);
}

/**
 * Fetches details from the Onionoo API with advanced search parameters
 * @param baseUrl - The base URL for the Onionoo API
 * @param params - The search parameters to use
 * @returns The parsed details response
 */
export async function fetchAdvancedDetails(
  baseUrl: string = DEFAULT_API_URL,
  params: Record<string, string>
): Promise<TorDetails> {
  const url = buildAdvancedUrl(baseUrl, params);
  return await fetchFromApi<TorDetails>(url);
} 