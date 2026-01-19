import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { xtreamApi, type XtreamCredentials, type XtreamAuthResponse, type XtreamLiveStream, type XtreamVodStream, type XtreamSeries, type XtreamCategory } from '../services/xtreamApi';

// Limits to prevent crashing
const MAX_ITEMS_PER_CATEGORY = 50;
const MAX_CATEGORIES_DISPLAY = 15;

interface XtreamContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  userInfo: XtreamAuthResponse | null;
  connect: (credentials: XtreamCredentials) => Promise<boolean>;
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
  // Search
  searchContent: (query: string) => SearchResults;
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

  // Data states - store full data but limit what we display
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
        } catch {
          xtreamApi.clearCredentials();
          setIsConnected(false);
        }
      }
      setIsLoading(false);
    };
    checkConnection();
  }, []);

  const connect = useCallback(async (credentials: XtreamCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = await xtreamApi.testConnection(credentials);
      xtreamApi.setCredentials(credentials);
      setUserInfo(auth);
      setIsConnected(true);
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
      setLiveCategories((categories || []).slice(0, MAX_CATEGORIES_DISPLAY));

      // Only load streams for the first category initially
      if (categories && categories.length > 0) {
        const streams = await xtreamApi.getLiveStreams(categories[0].category_id);
        setLiveStreams((streams || []).slice(0, MAX_ITEMS_PER_CATEGORY));
      }
    } catch (err) {
      console.error('Failed to load live data:', err);
    }
  }, [isConnected]);

  const loadLiveByCategory = useCallback(async (categoryId: string): Promise<XtreamLiveStream[]> => {
    if (!isConnected) return [];
    try {
      const streams = await xtreamApi.getLiveStreams(categoryId === 'all' ? undefined : categoryId);
      const limited = (streams || []).slice(0, MAX_ITEMS_PER_CATEGORY * 2);
      setLiveStreams(limited);
      return limited;
    } catch (err) {
      console.error('Failed to load live streams:', err);
      return [];
    }
  }, [isConnected]);

  const loadVodData = useCallback(async () => {
    if (!isConnected) return;
    try {
      const categories = await xtreamApi.getVodCategories();
      setVodCategories((categories || []).slice(0, MAX_CATEGORIES_DISPLAY));

      // Only load streams for the first few categories
      if (categories && categories.length > 0) {
        const streams = await xtreamApi.getVodStreams(categories[0].category_id);
        setVodStreams((streams || []).slice(0, MAX_ITEMS_PER_CATEGORY));
      }
    } catch (err) {
      console.error('Failed to load VOD data:', err);
    }
  }, [isConnected]);

  const loadVodByCategory = useCallback(async (categoryId: string): Promise<XtreamVodStream[]> => {
    if (!isConnected) return [];
    try {
      const streams = await xtreamApi.getVodStreams(categoryId === 'all' ? undefined : categoryId);
      const limited = (streams || []).slice(0, MAX_ITEMS_PER_CATEGORY * 2);
      setVodStreams(limited);
      return limited;
    } catch (err) {
      console.error('Failed to load VOD streams:', err);
      return [];
    }
  }, [isConnected]);

  const loadSeriesData = useCallback(async () => {
    if (!isConnected) return;
    try {
      const categories = await xtreamApi.getSeriesCategories();
      setSeriesCategories((categories || []).slice(0, MAX_CATEGORIES_DISPLAY));

      // Only load series for the first category
      if (categories && categories.length > 0) {
        const series = await xtreamApi.getSeries(categories[0].category_id);
        setSeriesList((series || []).slice(0, MAX_ITEMS_PER_CATEGORY));
      }
    } catch (err) {
      console.error('Failed to load series data:', err);
    }
  }, [isConnected]);

  const loadSeriesByCategory = useCallback(async (categoryId: string): Promise<XtreamSeries[]> => {
    if (!isConnected) return [];
    try {
      const series = await xtreamApi.getSeries(categoryId === 'all' ? undefined : categoryId);
      const limited = (series || []).slice(0, MAX_ITEMS_PER_CATEGORY * 2);
      setSeriesList(limited);
      return limited;
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

  const searchContent = useCallback((query: string): SearchResults => {
    const q = query.toLowerCase().trim();
    if (!q) return { channels: [], movies: [], series: [] };

    return {
      channels: liveStreams.filter(s => s.name.toLowerCase().includes(q)).slice(0, 20),
      movies: vodStreams.filter(m => m.name.toLowerCase().includes(q)).slice(0, 20),
      series: seriesList.filter(s => s.name.toLowerCase().includes(q)).slice(0, 20),
    };
  }, [liveStreams, vodStreams, seriesList]);

  return (
    <XtreamContext.Provider
      value={{
        isConnected,
        isLoading,
        error,
        userInfo,
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
        searchContent,
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
