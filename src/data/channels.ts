import type { Channel } from '../types';

export const channels: Channel[] = [
  {
    id: 'ch1',
    name: 'News 24',
    logo: 'https://placehold.co/100x60/1a1a2e/ffffff?text=News24',
    category: 'News',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'Breaking News Live',
    number: 1
  },
  {
    id: 'ch2',
    name: 'Sports HD',
    logo: 'https://placehold.co/100x60/16213e/ffffff?text=SportsHD',
    category: 'Sports',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'Premier League: Live Match',
    number: 2
  },
  {
    id: 'ch3',
    name: 'Movie Central',
    logo: 'https://placehold.co/100x60/0f3460/ffffff?text=MovieC',
    category: 'Movies',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'Action Movie Marathon',
    number: 3
  },
  {
    id: 'ch4',
    name: 'Discovery World',
    logo: 'https://placehold.co/100x60/533483/ffffff?text=Discovery',
    category: 'Documentary',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'Nature: Wild Planet',
    number: 4
  },
  {
    id: 'ch5',
    name: 'Kids Zone',
    logo: 'https://placehold.co/100x60/e94560/ffffff?text=KidsZone',
    category: 'Kids',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'Cartoon Time',
    number: 5
  },
  {
    id: 'ch6',
    name: 'Music TV',
    logo: 'https://placehold.co/100x60/7952b3/ffffff?text=MusicTV',
    category: 'Music',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'Top Hits Countdown',
    number: 6
  },
  {
    id: 'ch7',
    name: 'Comedy Central',
    logo: 'https://placehold.co/100x60/ff6b6b/ffffff?text=Comedy',
    category: 'Entertainment',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'Stand-Up Special',
    number: 7
  },
  {
    id: 'ch8',
    name: 'History Channel',
    logo: 'https://placehold.co/100x60/4ecdc4/ffffff?text=History',
    category: 'Documentary',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'Ancient Civilizations',
    number: 8
  },
  {
    id: 'ch9',
    name: 'Food Network',
    logo: 'https://placehold.co/100x60/ff9f43/ffffff?text=FoodNet',
    category: 'Lifestyle',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'MasterChef Finals',
    number: 9
  },
  {
    id: 'ch10',
    name: 'National Geographic',
    logo: 'https://placehold.co/100x60/feca57/000000?text=NatGeo',
    category: 'Documentary',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'Ocean Explorers',
    number: 10
  },
  {
    id: 'ch11',
    name: 'CNN International',
    logo: 'https://placehold.co/100x60/c0392b/ffffff?text=CNN',
    category: 'News',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'World News Tonight',
    number: 11
  },
  {
    id: 'ch12',
    name: 'ESPN',
    logo: 'https://placehold.co/100x60/d63031/ffffff?text=ESPN',
    category: 'Sports',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'SportsCenter',
    number: 12
  },
  {
    id: 'ch13',
    name: 'HBO',
    logo: 'https://placehold.co/100x60/6c5ce7/ffffff?text=HBO',
    category: 'Movies',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'Premiere Night',
    number: 13
  },
  {
    id: 'ch14',
    name: 'Cartoon Network',
    logo: 'https://placehold.co/100x60/00b894/ffffff?text=CN',
    category: 'Kids',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'Adventure Time',
    number: 14
  },
  {
    id: 'ch15',
    name: 'Travel Channel',
    logo: 'https://placehold.co/100x60/0984e3/ffffff?text=Travel',
    category: 'Lifestyle',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    currentProgram: 'World Wonders',
    number: 15
  }
];

export const channelCategories = [...new Set(channels.map(c => c.category))];
