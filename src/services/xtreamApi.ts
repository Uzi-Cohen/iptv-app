export interface XtreamCredentials {
  server: string;
  username: string;
  password: string;
}

export interface XtreamUserInfo {
  username: string;
  password: string;
  status: string;
  exp_date: string;
  is_trial: string;
  active_cons: string;
  created_at: string;
  max_connections: string;
}

export interface XtreamServerInfo {
  url: string;
  port: string;
  https_port: string;
  server_protocol: string;
  timezone: string;
}

export interface XtreamAuthResponse {
  user_info: XtreamUserInfo;
  server_info: XtreamServerInfo;
}

export interface XtreamCategory {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface XtreamLiveStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string;
  added: string;
  category_id: string;
  custom_sid: string;
  tv_archive: number;
  direct_source: string;
  tv_archive_duration: number;
}

export interface XtreamVodStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  rating: string;
  rating_5based: number;
  added: string;
  category_id: string;
  container_extension: string;
  custom_sid: string;
  direct_source: string;
}

export interface XtreamSeries {
  num: number;
  name: string;
  series_id: number;
  cover: string;
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  last_modified: string;
  rating: string;
  rating_5based: number;
  backdrop_path: string[];
  youtube_trailer: string;
  episode_run_time: string;
  category_id: string;
}

export interface XtreamEpisode {
  id: string;
  episode_num: number;
  title: string;
  container_extension: string;
  info: {
    movie_image?: string;
    plot?: string;
    duration_secs?: number;
    duration?: string;
    rating?: number;
  };
  custom_sid: string;
  added: string;
  season: number;
  direct_source: string;
}

export interface XtreamSeriesInfo {
  seasons: { [key: string]: { id: number; name: string; cover?: string; season_number: number }[] };
  info: {
    name: string;
    cover: string;
    plot: string;
    cast: string;
    director: string;
    genre: string;
    releaseDate: string;
    rating: string;
    backdrop_path: string[];
    youtube_trailer: string;
  };
  episodes: { [season: string]: XtreamEpisode[] };
}

class XtreamApiService {
  private credentials: XtreamCredentials | null = null;
  private baseUrl: string = '';

  constructor() {
    this.loadCredentials();
  }

  private loadCredentials() {
    const stored = localStorage.getItem('xtream_credentials');
    if (stored) {
      try {
        this.credentials = JSON.parse(stored);
        if (this.credentials) {
          this.baseUrl = this.normalizeServerUrl(this.credentials.server);
        }
      } catch {
        this.credentials = null;
      }
    }
  }

  private normalizeServerUrl(server: string): string {
    let url = server.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    return url;
  }

  setCredentials(credentials: XtreamCredentials) {
    this.credentials = credentials;
    this.baseUrl = this.normalizeServerUrl(credentials.server);
    localStorage.setItem('xtream_credentials', JSON.stringify(credentials));
  }

  getCredentials(): XtreamCredentials | null {
    return this.credentials;
  }

  clearCredentials() {
    this.credentials = null;
    this.baseUrl = '';
    localStorage.removeItem('xtream_credentials');
  }

  isConnected(): boolean {
    return this.credentials !== null;
  }

  private getApiUrl(action?: string): string {
    if (!this.credentials) throw new Error('Not connected');

    let url = `${this.baseUrl}/player_api.php?username=${encodeURIComponent(this.credentials.username)}&password=${encodeURIComponent(this.credentials.password)}`;
    if (action) {
      url += `&action=${action}`;
    }
    return url;
  }

  async authenticate(): Promise<XtreamAuthResponse> {
    const response = await fetch(this.getApiUrl());
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    const data = await response.json();
    if (data.user_info?.auth === 0) {
      throw new Error('Invalid credentials');
    }
    return data;
  }

  async testConnection(credentials: XtreamCredentials): Promise<XtreamAuthResponse> {
    const tempBaseUrl = this.normalizeServerUrl(credentials.server);
    const url = `${tempBaseUrl}/player_api.php?username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Connection failed');
    }
    const data = await response.json();
    if (data.user_info?.auth === 0) {
      throw new Error('Invalid credentials');
    }
    return data;
  }

  // Live TV
  async getLiveCategories(): Promise<XtreamCategory[]> {
    const response = await fetch(this.getApiUrl('get_live_categories'));
    if (!response.ok) throw new Error('Failed to fetch live categories');
    return response.json();
  }

  async getLiveStreams(categoryId?: string): Promise<XtreamLiveStream[]> {
    let url = this.getApiUrl('get_live_streams');
    if (categoryId) {
      url += `&category_id=${categoryId}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch live streams');
    return response.json();
  }

  getLiveStreamUrl(streamId: number, extension: string = 'm3u8'): string {
    if (!this.credentials) throw new Error('Not connected');
    return `${this.baseUrl}/live/${encodeURIComponent(this.credentials.username)}/${encodeURIComponent(this.credentials.password)}/${streamId}.${extension}`;
  }

  // VOD (Movies)
  async getVodCategories(): Promise<XtreamCategory[]> {
    const response = await fetch(this.getApiUrl('get_vod_categories'));
    if (!response.ok) throw new Error('Failed to fetch VOD categories');
    return response.json();
  }

  async getVodStreams(categoryId?: string): Promise<XtreamVodStream[]> {
    let url = this.getApiUrl('get_vod_streams');
    if (categoryId) {
      url += `&category_id=${categoryId}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch VOD streams');
    return response.json();
  }

  getVodStreamUrl(streamId: number, extension: string): string {
    if (!this.credentials) throw new Error('Not connected');
    return `${this.baseUrl}/movie/${encodeURIComponent(this.credentials.username)}/${encodeURIComponent(this.credentials.password)}/${streamId}.${extension}`;
  }

  // Series
  async getSeriesCategories(): Promise<XtreamCategory[]> {
    const response = await fetch(this.getApiUrl('get_series_categories'));
    if (!response.ok) throw new Error('Failed to fetch series categories');
    return response.json();
  }

  async getSeries(categoryId?: string): Promise<XtreamSeries[]> {
    let url = this.getApiUrl('get_series');
    if (categoryId) {
      url += `&category_id=${categoryId}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch series');
    return response.json();
  }

  async getSeriesInfo(seriesId: number): Promise<XtreamSeriesInfo> {
    const url = this.getApiUrl('get_series_info') + `&series_id=${seriesId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch series info');
    return response.json();
  }

  getSeriesStreamUrl(episodeId: string, extension: string): string {
    if (!this.credentials) throw new Error('Not connected');
    return `${this.baseUrl}/series/${encodeURIComponent(this.credentials.username)}/${encodeURIComponent(this.credentials.password)}/${episodeId}.${extension}`;
  }

  // M3U Playlist URL
  getM3uPlaylistUrl(): string {
    if (!this.credentials) throw new Error('Not connected');
    return `${this.baseUrl}/get.php?username=${encodeURIComponent(this.credentials.username)}&password=${encodeURIComponent(this.credentials.password)}&type=m3u_plus`;
  }
}

export const xtreamApi = new XtreamApiService();
