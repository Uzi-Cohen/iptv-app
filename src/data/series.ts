import type { Series } from '../types';

export const series: Series[] = [
  {
    id: 's1',
    title: 'Breaking Bad',
    poster: 'https://placehold.co/300x450/1a1a2e/ffffff?text=Breaking+Bad',
    backdrop: 'https://placehold.co/1280x720/1a1a2e/ffffff?text=Breaking+Bad',
    year: 2008,
    rating: 9.5,
    seasons: 5,
    genre: ['Crime', 'Drama', 'Thriller'],
    description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    episodes: [
      { id: 'e1', title: 'Pilot', episodeNumber: 1, seasonNumber: 1, duration: '58m', thumbnail: 'https://placehold.co/320x180/1a1a2e/ffffff?text=S1E1', description: 'Walter White, a struggling high school chemistry teacher, is diagnosed with advanced lung cancer.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
      { id: 'e2', title: 'Cat\'s in the Bag...', episodeNumber: 2, seasonNumber: 1, duration: '48m', thumbnail: 'https://placehold.co/320x180/1a1a2e/ffffff?text=S1E2', description: 'Walt and Jesse attempt to dispose of the evidence of their first cook.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
      { id: 'e3', title: '...And the Bag\'s in the River', episodeNumber: 3, seasonNumber: 1, duration: '48m', thumbnail: 'https://placehold.co/320x180/1a1a2e/ffffff?text=S1E3', description: 'Walter must make a decision about one of their captives.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 's2',
    title: 'Game of Thrones',
    poster: 'https://placehold.co/300x450/16213e/ffffff?text=Game+of+Thrones',
    backdrop: 'https://placehold.co/1280x720/16213e/ffffff?text=Game+of+Thrones',
    year: 2011,
    rating: 9.2,
    seasons: 8,
    genre: ['Action', 'Adventure', 'Drama'],
    description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    episodes: [
      { id: 'e4', title: 'Winter Is Coming', episodeNumber: 1, seasonNumber: 1, duration: '62m', thumbnail: 'https://placehold.co/320x180/16213e/ffffff?text=S1E1', description: 'Eddard Stark is torn between his family and an old friend when asked to serve at the side of King Robert Baratheon.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
      { id: 'e5', title: 'The Kingsroad', episodeNumber: 2, seasonNumber: 1, duration: '56m', thumbnail: 'https://placehold.co/320x180/16213e/ffffff?text=S1E2', description: 'While Bran recovers from his fall, Ned takes only his daughters to King\'s Landing.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 's3',
    title: 'Stranger Things',
    poster: 'https://placehold.co/300x450/0f3460/ffffff?text=Stranger+Things',
    backdrop: 'https://placehold.co/1280x720/0f3460/ffffff?text=Stranger+Things',
    year: 2016,
    rating: 8.7,
    seasons: 4,
    genre: ['Drama', 'Fantasy', 'Horror'],
    description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
    episodes: [
      { id: 'e6', title: 'The Vanishing of Will Byers', episodeNumber: 1, seasonNumber: 1, duration: '49m', thumbnail: 'https://placehold.co/320x180/0f3460/ffffff?text=S1E1', description: 'On his way home from a friend\'s house, young Will sees something terrifying.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
      { id: 'e7', title: 'The Weirdo on Maple Street', episodeNumber: 2, seasonNumber: 1, duration: '55m', thumbnail: 'https://placehold.co/320x180/0f3460/ffffff?text=S1E2', description: 'Lucas, Mike and Dustin try to talk to the girl they found in the woods.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 's4',
    title: 'The Witcher',
    poster: 'https://placehold.co/300x450/533483/ffffff?text=The+Witcher',
    backdrop: 'https://placehold.co/1280x720/533483/ffffff?text=The+Witcher',
    year: 2019,
    rating: 8.2,
    seasons: 3,
    genre: ['Action', 'Adventure', 'Drama'],
    description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
    episodes: [
      { id: 'e8', title: 'The End\'s Beginning', episodeNumber: 1, seasonNumber: 1, duration: '61m', thumbnail: 'https://placehold.co/320x180/533483/ffffff?text=S1E1', description: 'Geralt of Rivia is introduced as a monster hunter.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 's5',
    title: 'The Mandalorian',
    poster: 'https://placehold.co/300x450/e94560/ffffff?text=Mandalorian',
    backdrop: 'https://placehold.co/1280x720/e94560/ffffff?text=Mandalorian',
    year: 2019,
    rating: 8.7,
    seasons: 3,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
    episodes: [
      { id: 'e9', title: 'Chapter 1: The Mandalorian', episodeNumber: 1, seasonNumber: 1, duration: '39m', thumbnail: 'https://placehold.co/320x180/e94560/ffffff?text=S1E1', description: 'A Mandalorian bounty hunter tracks a target for a well-paying client.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 's6',
    title: 'The Office',
    poster: 'https://placehold.co/300x450/7952b3/ffffff?text=The+Office',
    backdrop: 'https://placehold.co/1280x720/7952b3/ffffff?text=The+Office',
    year: 2005,
    rating: 9.0,
    seasons: 9,
    genre: ['Comedy'],
    description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
    episodes: [
      { id: 'e10', title: 'Pilot', episodeNumber: 1, seasonNumber: 1, duration: '23m', thumbnail: 'https://placehold.co/320x180/7952b3/ffffff?text=S1E1', description: 'A documentary crew arrives at the Scranton branch of Dunder Mifflin.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 's7',
    title: 'Friends',
    poster: 'https://placehold.co/300x450/ff6b6b/ffffff?text=Friends',
    backdrop: 'https://placehold.co/1280x720/ff6b6b/ffffff?text=Friends',
    year: 1994,
    rating: 8.9,
    seasons: 10,
    genre: ['Comedy', 'Romance'],
    description: 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.',
    episodes: [
      { id: 'e11', title: 'The One Where Monica Gets a Roommate', episodeNumber: 1, seasonNumber: 1, duration: '22m', thumbnail: 'https://placehold.co/320x180/ff6b6b/ffffff?text=S1E1', description: 'Monica\'s old friend from high school appears unexpectedly at the coffee house.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 's8',
    title: 'Dark',
    poster: 'https://placehold.co/300x450/4ecdc4/ffffff?text=Dark',
    backdrop: 'https://placehold.co/1280x720/4ecdc4/ffffff?text=Dark',
    year: 2017,
    rating: 8.7,
    seasons: 3,
    genre: ['Crime', 'Drama', 'Mystery'],
    description: 'A family saga with a supernatural twist, set in a German town, where the disappearance of two young children exposes the relationships among four families.',
    episodes: [
      { id: 'e12', title: 'Secrets', episodeNumber: 1, seasonNumber: 1, duration: '51m', thumbnail: 'https://placehold.co/320x180/4ecdc4/ffffff?text=S1E1', description: 'In 2019, a young boy\'s disappearance stokes fear in the residents of Winden.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 's9',
    title: 'The Crown',
    poster: 'https://placehold.co/300x450/ff9f43/ffffff?text=The+Crown',
    backdrop: 'https://placehold.co/1280x720/ff9f43/ffffff?text=The+Crown',
    year: 2016,
    rating: 8.6,
    seasons: 6,
    genre: ['Biography', 'Drama', 'History'],
    description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the twentieth century.',
    episodes: [
      { id: 'e13', title: 'Wolferton Splash', episodeNumber: 1, seasonNumber: 1, duration: '57m', thumbnail: 'https://placehold.co/320x180/ff9f43/ffffff?text=S1E1', description: 'Princess Elizabeth marries Philip Mountbatten.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 's10',
    title: 'Peaky Blinders',
    poster: 'https://placehold.co/300x450/feca57/000000?text=Peaky+Blinders',
    backdrop: 'https://placehold.co/1280x720/feca57/000000?text=Peaky+Blinders',
    year: 2013,
    rating: 8.8,
    seasons: 6,
    genre: ['Crime', 'Drama'],
    description: 'A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps.',
    episodes: [
      { id: 'e14', title: 'Episode 1', episodeNumber: 1, seasonNumber: 1, duration: '57m', thumbnail: 'https://placehold.co/320x180/feca57/000000?text=S1E1', description: 'Thomas Shelby plans to fix a horse race.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 's11',
    title: 'Money Heist',
    poster: 'https://placehold.co/300x450/c0392b/ffffff?text=Money+Heist',
    backdrop: 'https://placehold.co/1280x720/c0392b/ffffff?text=Money+Heist',
    year: 2017,
    rating: 8.2,
    seasons: 5,
    genre: ['Action', 'Crime', 'Mystery'],
    description: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.',
    episodes: [
      { id: 'e15', title: 'Episode 1', episodeNumber: 1, seasonNumber: 1, duration: '48m', thumbnail: 'https://placehold.co/320x180/c0392b/ffffff?text=S1E1', description: 'Eight thieves take hostages in the Royal Mint of Spain.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 's12',
    title: 'Narcos',
    poster: 'https://placehold.co/300x450/d63031/ffffff?text=Narcos',
    backdrop: 'https://placehold.co/1280x720/d63031/ffffff?text=Narcos',
    year: 2015,
    rating: 8.8,
    seasons: 3,
    genre: ['Biography', 'Crime', 'Drama'],
    description: 'A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar, as well as the many other drug kingpins who plagued the country.',
    episodes: [
      { id: 'e16', title: 'Descenso', episodeNumber: 1, seasonNumber: 1, duration: '57m', thumbnail: 'https://placehold.co/320x180/d63031/ffffff?text=S1E1', description: 'Cocaine becomes a popular drug in the United States, and Colombia becomes the world\'s leading supplier.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  }
];

export const seriesCategories = [
  { id: 'popular', name: 'Popular on IPTV', items: series.slice(0, 6) },
  { id: 'drama', name: 'Drama Series', items: series.filter(s => s.genre.includes('Drama')) },
  { id: 'action', name: 'Action & Adventure', items: series.filter(s => s.genre.includes('Action') || s.genre.includes('Adventure')) },
  { id: 'comedy', name: 'Comedy', items: series.filter(s => s.genre.includes('Comedy')) },
  { id: 'crime', name: 'Crime', items: series.filter(s => s.genre.includes('Crime')) },
  { id: 'toprated', name: 'Top Rated', items: [...series].sort((a, b) => b.rating - a.rating).slice(0, 8) }
];
