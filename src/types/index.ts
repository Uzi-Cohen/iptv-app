export interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  streamUrl: string;
  currentProgram?: string;
  number: number;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  year: number;
  rating: number;
  duration: string;
  genre: string[];
  description: string;
  streamUrl: string;
}

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  seasonNumber: number;
  duration: string;
  thumbnail: string;
  description: string;
  streamUrl: string;
}

export interface Series {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  year: number;
  rating: number;
  seasons: number;
  genre: string[];
  description: string;
  episodes: Episode[];
}

export interface Category {
  id: string;
  name: string;
  items: (Movie | Series)[];
}
