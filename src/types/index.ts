/**
 * Types for Tor relay and bridge data from API
 */

export interface TorRelayExitPolicy {
  accept: string[];
}

export interface TorRelay {
  nickname: string;
  fingerprint: string;
  or_addresses: string[];
  exit_addresses?: string[];
  last_seen: string;
  last_changed_address_or_port?: string;
  first_seen: string;
  running: boolean;
  flags: string[];
  country?: string;
  country_name?: string;
  as?: string;
  as_name?: string;
  consensus_weight?: number;
  unverified_host_names?: string[];
  verified_host_names?: string[];
  last_restarted?: string;
  bandwidth_rate?: number;
  bandwidth_burst?: number;
  observed_bandwidth?: number;
  advertised_bandwidth?: number;
  exit_policy?: string[];
  exit_policy_summary?: TorRelayExitPolicy;
  contact?: string;
  platform?: string;
  version?: string;
  version_status?: string;
  effective_family?: string[];
  consensus_weight_fraction?: number;
  guard_probability?: number;
  middle_probability?: number;
  exit_probability?: number;
  recommended_version?: boolean;
  measured?: boolean;
}

export interface TorBridge {
  nickname: string;
  fingerprint: string;
  or_addresses: string[];
  last_seen: string;
  first_seen: string;
  running: boolean;
  flags: string[];
  platform?: string;
  version?: string;
  transports?: string[];
}

export interface TorDetails {
  version: string;
  build_revision: string;
  relays_published: string;
  relays: TorRelay[];
  bridges_published: string;
  bridges: TorBridge[];
}

export interface TorLensOptions {
  baseUrl?: string;
}

export type SearchParam = {
  key: string;
  value: string;
}; 