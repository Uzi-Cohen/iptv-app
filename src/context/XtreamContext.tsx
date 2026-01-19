import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { xtreamApi, type XtreamCredentials, type XtreamAuthResponse, type XtreamLiveStream, type XtreamVodStream, type XtreamSeries, type XtreamCategory } from '../services/xtreamApi';

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
  // VOD
  vodCategories: XtreamCategory[];
  vodStreams: XtreamVodStream[];
  loadVodData: () => Promise<void>;
  // Series
  seriesCategories: XtreamCategory[];
  seriesList: XtreamSeries[];
  loadSeriesData: () => Promise<void>;
  // Stream URLs
  getLiveUrl: (streamId: number) => string;
  getVodUrl: (streamId: number, extension: string) => string;
  getSeriesUrl: (episodeId: string, extension: string) => string;
}

const XtreamContext = createContext<XtreamContextType | null>(null);

export function XtreamProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<XtreamAuthResponse | null>(null);

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
      const [categories, streams] = await Promise.all([
        xtreamApi.getLiveCategories(),
        xtreamApi.getLiveStreams()
      ]);
      setLiveCategories(categories || []);
      setLiveStreams(streams || []);
    } catch (err) {
      console.error('Failed to load live data:', err);
    }
  }, [isConnected]);

  const loadVodData = useCallback(async () => {
    if (!isConnected) return;
    try {
      const [categories, streams] = await Promise.all([
        xtreamApi.getVodCategories(),
        xtreamApi.getVodStreams()
      ]);
      setVodCategories(categories || []);
      setVodStreams(streams || []);
    } catch (err) {
      console.error('Failed to load VOD data:', err);
    }
  }, [isConnected]);

  const loadSeriesData = useCallback(async () => {
    if (!isConnected) return;
    try {
      const [categories, series] = await Promise.all([
        xtreamApi.getSeriesCategories(),
        xtreamApi.getSeries()
      ]);
      setSeriesCategories(categories || []);
      setSeriesList(series || []);
    } catch (err) {
      console.error('Failed to load series data:', err);
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
        vodCategories,
        vodStreams,
        loadVodData,
        seriesCategories,
        seriesList,
        loadSeriesData,
        getLiveUrl,
        getVodUrl,
        getSeriesUrl,
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
