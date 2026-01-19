import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { xtreamApi, type XtreamCredentials, type XtreamAuthResponse, type XtreamLiveStream, type XtreamVodStream, type XtreamSeries, type XtreamCategory } from '../services/xtreamApi';

interface XtreamContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  userInfo: XtreamAuthResponse | null;
  playlistName: string;
  connect: (credentials: XtreamCredentials, name?: string) => Promise<boolean>;
  disconnect: () => void;
  // Live TV
  liveCategories: XtreamCategory[];
  liveStreams: XtreamLiveStream[];
  loadLiveData: () => Promise<void>;
  loadLiveByCategory: (categoryId: string) => Promise<XtreamLiveStream[]>;
  // VOD
  vodCategories: XtreamCategory[];
  vodStreams: XtreamVodStream[];
  loadVodData: () => Promise<void>;
  loadVodByCategory: (categoryId: string) => Promise<XtreamVodStream[]>;
  // Series
  seriesCategories: XtreamCategory[];
  seriesList: XtreamSeries[];
  loadSeriesData: () => Promise<void>;
  loadSeriesByCategory: (categoryId: string) => Promise<XtreamSeries[]>;
  // Stream URLs
  getLiveUrl: (streamId: number) => string;
  getVodUrl: (streamId: number, extension: string) => string;
  getSeriesUrl: (episodeId: string, extension: string) => string;
  // Search - fetches ALL content from API
  searchAll: (query: string) => Promise<SearchResults>;
}

interface SearchResults {
  channels: XtreamLiveStream[];
  movies: XtreamVodStream[];
  series: XtreamSeries[];
}

const XtreamContext = createContext<XtreamContextType | null>(null);

export function XtreamProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<XtreamAuthResponse | null>(null);
  const [playlistName, setPlaylistName] = useState('');

  // Data states
  const [liveCategories, setLiveCategories] = useState<XtreamCategory[]>([]);
  const [liveStreams, setLiveStreams] = useState<XtreamLiveStream[]>([]);
  const [vodCategories, setVodCategories] = useState<XtreamCategory[]>([]);
  const [vodStreams, setVodStreams] = useState<XtreamVodStream[]>([]);
  const [seriesCategories, setSeriesCategories] = useState<XtreamCategory[]>([]);
  const [seriesList, setSeriesList] = useState<XtreamSeries[]>([]);

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (xtreamApi.isConnected()) {
        try {
          const auth = await xtreamApi.authenticate();
          setUserInfo(auth);
          setIsConnected(true);
          const savedName = localStorage.getItem('xtream_playlist_name');
          if (savedName) setPlaylistName(savedName);
        } catch {
          xtreamApi.clearCredentials();
          setIsConnected(false);
        }
      }
      setIsLoading(false);
    };
    checkConnection();
  }, []);

  const connect = useCallback(async (credentials: XtreamCredentials, name?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = await xtreamApi.testConnection(credentials);
      xtreamApi.setCredentials(credentials);
      setUserInfo(auth);
      setIsConnected(true);
      if (name) {
        setPlaylistName(name);
        localStorage.setItem('xtream_playlist_name', name);
      }
      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsLoading(false);
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    xtreamApi.clearCredentials();
    setIsConnected(false);
    setUserInfo(null);
    setPlaylistName('');
    localStorage.removeItem('xtream_playlist_name');
    setLiveCategories([]);
    setLiveStreams([]);
    setVodCategories([]);
    setVodStreams([]);
    setSeriesCategories([]);
    setSeriesList([]);
  }, []);

  const loadLiveData = useCallback(async () => {
    if (!isConnected) return;
    try {
      const categories = await xtreamApi.getLiveCategories();
      setLiveCategories(categories || []);

      // Load streams for the first category (not ALL)
      if (categories && categories.length > 0) {
        const streams = await xtreamApi.getLiveStreams(categories[0].category_id);
        setLiveStreams(streams || []);
      }
    } catch (err) {
      console.error('Failed to load live data:', err);
    }
  }, [isConnected]);

  const loadLiveByCategory = useCallback(async (categoryId: string): Promise<XtreamLiveStream[]> => {
    if (!isConnected) return [];
    try {
      const streams = await xtreamApi.getLiveStreams(categoryId === 'all' ? undefined : categoryId);
      setLiveStreams(streams || []);
      return streams || [];
    } catch (err) {
      console.error('Failed to load live streams:', err);
      return [];
    }
  }, [isConnected]);

  const loadVodData = useCallback(async () => {
    if (!isConnected) return;
    try {
      const categories = await xtreamApi.getVodCategories();
      setVodCategories(categories || []);

      // Load streams for the first category (not ALL)
      if (categories && categories.length > 0) {
        const streams = await xtreamApi.getVodStreams(categories[0].category_id);
        setVodStreams(streams || []);
      }
    } catch (err) {
      console.error('Failed to load VOD data:', err);
    }
  }, [isConnected]);

  const loadVodByCategory = useCallback(async (categoryId: string): Promise<XtreamVodStream[]> => {
    if (!isConnected) return [];
    try {
      const streams = await xtreamApi.getVodStreams(categoryId === 'all' ? undefined : categoryId);
      setVodStreams(streams || []);
      return streams || [];
    } catch (err) {
      console.error('Failed to load VOD streams:', err);
      return [];
    }
  }, [isConnected]);

  const loadSeriesData = useCallback(async () => {
    if (!isConnected) return;
    try {
      const categories = await xtreamApi.getSeriesCategories();
      setSeriesCategories(categories || []);

      // Load series for the first category (not ALL)
      if (categories && categories.length > 0) {
        const series = await xtreamApi.getSeries(categories[0].category_id);
        setSeriesList(series || []);
      }
    } catch (err) {
      console.error('Failed to load series data:', err);
    }
  }, [isConnected]);

  const loadSeriesByCategory = useCallback(async (categoryId: string): Promise<XtreamSeries[]> => {
    if (!isConnected) return [];
    try {
      const series = await xtreamApi.getSeries(categoryId === 'all' ? undefined : categoryId);
      setSeriesList(series || []);
      return series || [];
    } catch (err) {
      console.error('Failed to load series:', err);
      return [];
    }
  }, [isConnected]);

  const getLiveUrl = useCallback((streamId: number) => {
    return xtreamApi.getLiveStreamUrl(streamId);
  }, []);

  const getVodUrl = useCallback((streamId: number, extension: string) => {
    return xtreamApi.getVodStreamUrl(streamId, extension);
  }, []);

  const getSeriesUrl = useCallback((episodeId: string, extension: string) => {
    return xtreamApi.getSeriesStreamUrl(episodeId, extension);
  }, []);

  // Search ALL content from API
  const searchAll = useCallback(async (query: string): Promise<SearchResults> => {
    const q = query.toLowerCase().trim();
    if (!q || q.length < 2) return { channels: [], movies: [], series: [] };
    if (!isConnected) return { channels: [], movies: [], series: [] };

    try {
      // Fetch ALL data (no category filter) for comprehensive search
      const [allLive, allVod, allSeries] = await Promise.all([
        xtreamApi.getLiveStreams(),
        xtreamApi.getVodStreams(),
        xtreamApi.getSeries(),
      ]);

      return {
        channels: (allLive || []).filter(s => s.name.toLowerCase().includes(q)).slice(0, 100),
        movies: (allVod || []).filter(m => m.name.toLowerCase().includes(q)).slice(0, 100),
        series: (allSeries || []).filter(s => s.name.toLowerCase().includes(q)).slice(0, 100),
      };
    } catch (err) {
      console.error('Search failed:', err);
      return { channels: [], movies: [], series: [] };
    }
  }, [isConnected]);

  return (
    <XtreamContext.Provider
      value={{
        isConnected,
        isLoading,
        error,
        userInfo,
        playlistName,
        connect,
        disconnect,
        liveCategories,
        liveStreams,
        loadLiveData,
        loadLiveByCategory,
        vodCategories,
        vodStreams,
        loadVodData,
        loadVodByCategory,
        seriesCategories,
        seriesList,
        loadSeriesData,
        loadSeriesByCategory,
        getLiveUrl,
        getVodUrl,
        getSeriesUrl,
        searchAll,
      }}
    >
      {children}
    </XtreamContext.Provider>
  );
}

export function useXtream() {
  const context = useContext(XtreamContext);
  if (!context) {
    throw new Error('useXtream must be used within a XtreamProvider');
  }
  return context;
}
