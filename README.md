# TorLens
![npm](https://img.shields.io/npm/v/torlens)
![License](https://img.shields.io/badge/license-MIT-blue)

<div align="center">
  <h3>🔍 Powerful Tor Network Intelligence</h3>
</div>

TorLens is a comprehensive library for querying, analyzing, and monitoring Tor network nodes.TorLens provides developers with fine-grained access to detailed information about Tor relays and bridges.

## ✨ Features

- **Complete Data Access**: Query all available information about Tor relays and bridges
- **Targeted Searches**: Find nodes by fingerprint, country, hostname, flags, and more
- **Performance Analysis**: Analyze bandwidth, weight, and performance metrics
- **Advanced Filtering**: Filter by multiple criteria simultaneously
- **Exit Policy Analysis**: Check port permissions and exit policies
- **Type-Safe**: Full TypeScript support with comprehensive type definitions

## 🧅 Peel the Net

For a live, visual exploration of the Tor network, visit our companion web platform:

#### [🌐 Website](https://peelthenet.pratikpatil.me)

Peel the Net is a real-time web platform that visualizes and documents every active Tor node with detailed public metadata. From entry guards to exit relays, Peel the Net helps you peel back the layers of the Tor network and explore its architecture in depth.

Features:
- Live visualization of Tor nodes worldwide
- Detailed node information (fingerprints, IP addresses, flags, etc.)
- Updated every 30 minutes
- Downloadable datasets in JSON and CSV formats

**Repository**: [GitHub - 0xPratikPatil/peel-the-net](https://github.com/0xPratikPatil/peel-the-net)
**Dataset**: [Tor Node Dataset](https://github.com/0xPratikPatil/peel-the-net/tree/main/dataset)

## Installation

```bash
npm install torlens
```

## Usage

```typescript
import { TorLens } from 'torlens';

// Create a new TorLens instance
const torLens = new TorLens();

// Basic search
async function searchNodes() {
  const results = await torLens.search('exit');
  console.log(`Found ${results.relays.length} relays`);
}

// Get a specific relay by fingerprint
async function getRelay() {
  const relay = await torLens.getRelayByFingerprint('000F3EB75342BE371F1D8D3FAE90890AEB5664EE');
  console.log(relay?.nickname);
}

// Get relays by country
async function getRelaysByCountry() {
  const relays = await torLens.getRelaysByCountry('us');
  console.log(`Found ${relays.length} relays in the US`);
}

// Get relays with specific flags
async function getGuardRelays() {
  const relays = await torLens.getRelaysByFlags(['Guard', 'Fast']);
  console.log(`Found ${relays.length} relays with Guard and Fast flags`);
}

// Find relays that allow specific ports
async function findRelaysWithPort() {
  const relays = await torLens.getRelaysByPort(80);
  console.log(`Found ${relays.length} relays that allow port 80`);
}

// Find relays by AS number
async function findRelaysByAS() {
  const relays = await torLens.getRelaysByAS('399820');
  console.log(`Found ${relays.length} relays with AS number 399820`);
}

// Find top relays by consensus weight
async function findTopRelays() {
  const relays = await torLens.getTopRelaysByWeight(5);
  console.log('Top 5 relays by consensus weight:');
  relays.forEach(relay => {
    console.log(`${relay.nickname}: ${relay.consensus_weight}`);
  });
}

// Find relays by OR address
async function findRelaysByORAddress() {
  const relays = await torLens.getRelaysByORAddress('204.137.14.106');
  console.log(`Found ${relays.length} relays with the specified OR address`);
}

// Find relays by exit address
async function findRelaysByExitAddress() {
  const relays = await torLens.getRelaysByExitAddress('204.137.14.106');
  console.log(`Found ${relays.length} relays with the specified exit address`);
}

// Find relays by hostname
async function findRelaysByHostname() {
  const relays = await torLens.getRelaysByHostname('atomicnetworks.co');
  console.log(`Found ${relays.length} relays with the specified hostname`);
}

// Advanced search with multiple parameters
async function advancedSearch() {
  const results = await torLens.advancedSearch({
    running: 'true',
    country: 'us',
    flag: 'Guard'
  });
  console.log(`Found ${results.relays.length} relays`);
}
```

## 📚 API Reference

#### Methods

##### Basic Methods
- `search(searchTerm?: string): Promise<TorDetails>` - Search for Tor nodes
- `advancedSearch(params: Record<string, string>): Promise<TorDetails>` - Advanced search with multiple parameters

##### Relay Methods
- `getRelayByFingerprint(fingerprint: string): Promise<TorRelay | undefined>` - Get relay by fingerprint
- `getRelaysByNickname(nickname: string): Promise<TorRelay[]>` - Get relays by nickname
- `getRelaysByORAddress(orAddress: string): Promise<TorRelay[]>` - Get relays by OR address
- `getRelaysByExitAddress(exitAddress: string): Promise<TorRelay[]>` - Get relays by exit address
- `getRelaysByHostname(hostname: string): Promise<TorRelay[]>` - Get relays by hostname (verified or unverified)
- `getRelaysByVerifiedHostname(hostname: string): Promise<TorRelay[]>` - Get relays by verified hostname
- `getRelaysByUnverifiedHostname(hostname: string): Promise<TorRelay[]>` - Get relays by unverified hostname
- `getRelaysByCountry(countryCode: string): Promise<TorRelay[]>` - Get relays by country code
- `getRelaysByAS(asNumber: string): Promise<TorRelay[]>` - Get relays by AS number
- `getRelaysByASName(asName: string): Promise<TorRelay[]>` - Get relays by AS name
- `getRelaysByPlatform(platform: string): Promise<TorRelay[]>` - Get relays by platform
- `getRelaysByVersion(version: string): Promise<TorRelay[]>` - Get relays by Tor version
- `getRelaysByVersionStatus(status: string): Promise<TorRelay[]>` - Get relays by version status
- `getRelaysByMinBandwidth(minBandwidth: number): Promise<TorRelay[]>` - Get relays by minimum bandwidth
- `getRelaysByContact(contactInfo: string): Promise<TorRelay[]>` - Get relays by contact information
- `getRelaysByPort(port: number): Promise<TorRelay[]>` - Get relays that allow a specific port
- `getTopRelaysByWeight(limit?: number): Promise<TorRelay[]>` - Get top relays by consensus weight
- `getRelaysByMinRunTime(minDays: number): Promise<TorRelay[]>` - Get relays running for at least the specified duration
- `getRelaysByFlags(flags: string[]): Promise<TorRelay[]>` - Get relays with specific flags

##### Bridge Methods
- `getAllBridges(): Promise<TorBridge[]>` - Get all bridges
- `getBridgeByFingerprint(fingerprint: string): Promise<TorBridge | undefined>` - Get bridge by fingerprint
- `getBridgesByTransport(transport: string): Promise<TorBridge[]>` - Get bridges by transport type

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🔗 Links

- [Documentation](https://torlens.pratikpatil.me)
- [GitHub Repository](https://github.com/0xpratikpatil/torlens)
- [NPM Package](https://www.npmjs.com/package/torlens)
- [Peel the Net](https://peelthenet.pratikpatil.me) - Visual Tor network explorer