import { TorLensOptions, TorDetails, TorRelay, TorBridge } from './types';
import { DEFAULT_API_URL, fetchDetails, fetchAdvancedDetails } from './utils/api';

/**
 * TorLens - A library for fetching and analyzing Tor node information
 */
export class TorLens {
  private baseUrl: string;

  /**
   * Creates a new TorLens instance
   * @param options - Configuration options
   */
  constructor(options: TorLensOptions = {}) {
    this.baseUrl = options.baseUrl || DEFAULT_API_URL;
  }

  /**
   * Fetches Tor node details based on a search term
   * @param searchTerm - The term to search for (nickname, fingerprint, IP address, etc.)
   * @returns Details about matching Tor nodes
   */
  async search(searchTerm?: string): Promise<TorDetails> {
    return await fetchDetails(this.baseUrl, searchTerm);
  }

  /**
   * Performs an advanced search with multiple parameters
   * @param params - The search parameters to use
   * @returns Details about matching Tor nodes
   */
  async advancedSearch(params: Record<string, string>): Promise<TorDetails> {
    return await fetchAdvancedDetails(this.baseUrl, params);
  }

  /**
   * Fetches a specific relay by its fingerprint
   * @param fingerprint - The relay's fingerprint
   * @returns The relay data if found, undefined otherwise
   */
  async getRelayByFingerprint(fingerprint: string): Promise<TorRelay | undefined> {
    const details = await this.search(fingerprint);
    return details.relays.find(relay => relay.fingerprint === fingerprint);
  }

  /**
   * Fetches relays by nickname
   * @param nickname - The relay nickname to search for
   * @returns Array of matching relays
   */
  async getRelaysByNickname(nickname: string): Promise<TorRelay[]> {
    const details = await this.search(nickname);
    return details.relays.filter(relay => 
      relay.nickname.toLowerCase().includes(nickname.toLowerCase())
    );
  }

  /**
   * Fetches relays by OR address (IP:port)
   * @param orAddress - The OR address to search for
   * @returns Array of relays with matching OR address
   */
  async getRelaysByORAddress(orAddress: string): Promise<TorRelay[]> {
    const details = await this.search(orAddress);
    return details.relays.filter(relay => 
      relay.or_addresses.some(address => address.includes(orAddress))
    );
  }

  /**
   * Fetches relays by exit address (IP)
   * @param exitAddress - The exit address to search for
   * @returns Array of relays with matching exit address
   */
  async getRelaysByExitAddress(exitAddress: string): Promise<TorRelay[]> {
    const details = await this.search(exitAddress);
    return details.relays.filter(relay => 
      relay.exit_addresses?.some(address => address.includes(exitAddress))
    );
  }

  /**
   * Fetches relays by host name (verified or unverified)
   * @param hostname - The hostname to search for
   * @returns Array of relays with matching hostname
   */
  async getRelaysByHostname(hostname: string): Promise<TorRelay[]> {
    const details = await this.search();
    const normalizedHostname = hostname.toLowerCase();
    
    return details.relays.filter(relay => {
      // Check unverified host names
      if (relay.unverified_host_names?.some(name => 
        name.toLowerCase().includes(normalizedHostname)
      )) {
        return true;
      }
      
      // Check verified host names if they exist in the API response
      if (relay.verified_host_names?.some(name => 
        name.toLowerCase().includes(normalizedHostname)
      )) {
        return true;
      }
      
      return false;
    });
  }

  /**
   * Fetches relays by unverified host name
   * @param hostname - The unverified hostname to search for
   * @returns Array of relays with matching unverified hostname
   */
  async getRelaysByUnverifiedHostname(hostname: string): Promise<TorRelay[]> {
    const details = await this.search();
    const normalizedHostname = hostname.toLowerCase();
    
    return details.relays.filter(relay => 
      relay.unverified_host_names?.some(name => 
        name.toLowerCase().includes(normalizedHostname)
      )
    );
  }

  /**
   * Fetches relays by verified host name
   * @param hostname - The verified hostname to search for
   * @returns Array of relays with matching verified hostname
   */
  async getRelaysByVerifiedHostname(hostname: string): Promise<TorRelay[]> {
    const details = await this.search();
    const normalizedHostname = hostname.toLowerCase();
    
    return details.relays.filter(relay => 
      relay.verified_host_names?.some(name => 
        name.toLowerCase().includes(normalizedHostname)
      )
    );
  }

  /**
   * Fetches relays by country code
   * @param countryCode - The two-letter country code
   * @returns Array of relays in the specified country
   */
  async getRelaysByCountry(countryCode: string): Promise<TorRelay[]> {
    const details = await this.search(countryCode);
    const normalizedCountryCode = countryCode.toLowerCase();
    return details.relays.filter(relay => relay.country === normalizedCountryCode);
  }

  /**
   * Fetches relays by autonomous system (AS) number
   * @param asNumber - The AS number with or without the "AS" prefix
   * @returns Array of relays with the specified AS number
   */
  async getRelaysByAS(asNumber: string): Promise<TorRelay[]> {
    // Format the AS number with the "AS" prefix if it doesn't have it
    const formattedAS = asNumber.startsWith('AS') ? asNumber : `AS${asNumber}`;
    const details = await this.search(formattedAS);
    return details.relays.filter(relay => relay.as === formattedAS);
  }

  /**
   * Fetches relays by autonomous system (AS) name
   * @param asName - The AS name to search for
   * @returns Array of relays with AS names containing the search term
   */
  async getRelaysByASName(asName: string): Promise<TorRelay[]> {
    const details = await this.search();
    const normalizedAsName = asName.toLowerCase();
    return details.relays.filter(relay => 
      relay.as_name?.toLowerCase().includes(normalizedAsName)
    );
  }

  /**
   * Fetches relays that have specific flags
   * @param flags - Array of flags to filter by
   * @returns Array of relays with all the specified flags
   */
  async getRelaysByFlags(flags: string[]): Promise<TorRelay[]> {
    // First get all relays since we need to filter on the client side
    const details = await this.search();
    const normalizedFlags = flags.map(flag => flag.toUpperCase());
    
    return details.relays.filter(relay => 
      normalizedFlags.every(flag => relay.flags.includes(flag))
    );
  }

  /**
   * Fetches relays by platform (e.g., "Tor 0.4.8.16 on Linux")
   * @param platform - The platform string to search for
   * @returns Array of relays with matching platform
   */
  async getRelaysByPlatform(platform: string): Promise<TorRelay[]> {
    const details = await this.search();
    const normalizedPlatform = platform.toLowerCase();
    
    return details.relays.filter(relay => 
      relay.platform?.toLowerCase().includes(normalizedPlatform)
    );
  }

  /**
   * Fetches relays by Tor version
   * @param version - The Tor version to search for
   * @returns Array of relays with the specified Tor version
   */
  async getRelaysByVersion(version: string): Promise<TorRelay[]> {
    const details = await this.search();
    
    return details.relays.filter(relay => 
      relay.version === version
    );
  }

  /**
   * Fetches relays by version status (e.g., "recommended")
   * @param status - The version status to filter by
   * @returns Array of relays with the specified version status
   */
  async getRelaysByVersionStatus(status: string): Promise<TorRelay[]> {
    const details = await this.search();
    const normalizedStatus = status.toLowerCase();
    
    return details.relays.filter(relay => 
      relay.version_status?.toLowerCase() === normalizedStatus
    );
  }

  /**
   * Fetches relays by minimum bandwidth rate
   * @param minBandwidth - The minimum bandwidth rate in bytes per second
   * @returns Array of relays with at least the specified bandwidth rate
   */
  async getRelaysByMinBandwidth(minBandwidth: number): Promise<TorRelay[]> {
    const details = await this.search();
    
    return details.relays.filter(relay => 
      (relay.bandwidth_rate || 0) >= minBandwidth
    );
  }

  /**
   * Fetches relays by contact information
   * @param contactInfo - The contact information to search for
   * @returns Array of relays with matching contact information
   */
  async getRelaysByContact(contactInfo: string): Promise<TorRelay[]> {
    const details = await this.search();
    const normalizedContactInfo = contactInfo.toLowerCase();
    
    return details.relays.filter(relay => 
      relay.contact?.toLowerCase().includes(normalizedContactInfo)
    );
  }

  /**
   * Fetches all bridges
   * @returns Array of all bridges
   */
  async getAllBridges(): Promise<TorBridge[]> {
    const details = await this.search();
    return details.bridges;
  }

  /**
   * Gets a bridge by its fingerprint
   * @param fingerprint - The bridge's fingerprint
   * @returns The bridge data if found, undefined otherwise
   */
  async getBridgeByFingerprint(fingerprint: string): Promise<TorBridge | undefined> {
    const details = await this.search(fingerprint);
    return details.bridges.find(bridge => bridge.fingerprint === fingerprint);
  }

  /**
   * Fetches bridges by specific transport type
   * @param transport - The transport type to filter by (e.g., "obfs4")
   * @returns Array of bridges supporting the specified transport
   */
  async getBridgesByTransport(transport: string): Promise<TorBridge[]> {
    const details = await this.search();
    
    return details.bridges.filter(bridge => 
      bridge.transports?.includes(transport)
    );
  }

  /**
   * Fetches relays that allow a specific port
   * @param port - The port number to check
   * @returns Array of relays that allow the specified port
   */
  async getRelaysByPort(port: number): Promise<TorRelay[]> {
    const details = await this.search();
    
    return details.relays.filter(relay => {
      if (!relay.exit_policy_summary?.accept) {
        return false;
      }
      
      const portStr = port.toString();
      
      // Check if the port is explicitly accepted
      return relay.exit_policy_summary.accept.some(range => {
        // Handle single port
        if (range === portStr) {
          return true;
        }
        
        // Handle port range (e.g. "80-90")
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(Number);
          return port >= start && port <= end;
        }
        
        return false;
      });
    });
  }

  /**
   * Fetches the top relays by consensus weight
   * @param limit - The maximum number of relays to return
   * @returns Array of relays sorted by consensus weight (descending)
   */
  async getTopRelaysByWeight(limit: number = 10): Promise<TorRelay[]> {
    const details = await this.search();
    
    return details.relays
      .sort((a, b) => (b.consensus_weight || 0) - (a.consensus_weight || 0))
      .slice(0, limit);
  }

  /**
   * Fetches relays running for at least the specified duration
   * @param minDays - The minimum number of days the relay has been running
   * @returns Array of relays running for at least the specified duration
   */
  async getRelaysByMinRunTime(minDays: number): Promise<TorRelay[]> {
    const details = await this.search();
    const now = new Date();
    const minDate = new Date(now.getTime() - minDays * 24 * 60 * 60 * 1000);
    
    return details.relays.filter(relay => {
      const firstSeen = new Date(relay.first_seen);
      return firstSeen <= minDate;
    });
  }
} 