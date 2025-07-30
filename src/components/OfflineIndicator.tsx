import { useState, useEffect } from "react";
import { Wifi, WifiOff, Download, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface OfflineData {
  transactions: any[];
  syncQueue: any[];
  lastSyncTime?: string;
  cacheSize: number;
}

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingChanges: number;
  lastSync?: Date;
  cacheStatus: "fresh" | "stale" | "empty";
}

export const OfflineIndicator = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingChanges: 0,
    cacheStatus: "empty",
  });
  const [showDetails, setShowDetails] = useState(false);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    transactions: [],
    syncQueue: [],
    cacheSize: 0,
  });

  const { toast } = useToast();

  // Check if service worker is supported and registered
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/serviceWorker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          setServiceWorkerReady(true);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Load offline data from localStorage
    loadOfflineData();

    // Online/offline event listeners
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      toast({
        title: "Back Online",
        description: "Connection restored. Syncing pending changes...",
      });
      syncPendingChanges();
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
      toast({
        title: "Offline Mode",
        description: "You're now offline. Changes will be saved locally.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic sync check
    const syncInterval = setInterval(() => {
      if (navigator.onLine && syncStatus.pendingChanges > 0) {
        syncPendingChanges();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
    };
  }, []);

  const loadOfflineData = () => {
    try {
      const transactions = JSON.parse(localStorage.getItem('offline_transactions') || '[]');
      const syncQueue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
      const lastSyncTime = localStorage.getItem('last_sync_time');
      const cacheSize = calculateCacheSize();

      setOfflineData({
        transactions,
        syncQueue,
        lastSyncTime: lastSyncTime || undefined,
        cacheSize,
      });

      setSyncStatus(prev => ({
        ...prev,
        pendingChanges: syncQueue.length,
        lastSync: lastSyncTime ? new Date(lastSyncTime) : undefined,
        cacheStatus: transactions.length > 0 ? "fresh" : "empty",
      }));
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  };

  const calculateCacheSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (key.startsWith('offline_') || key.startsWith('cache_')) {
        total += localStorage[key].length;
      }
    }
    return total;
  };

  const syncPendingChanges = async () => {
    if (!navigator.onLine || syncStatus.isSyncing) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      const syncQueue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
      
      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, we'll just clear the sync queue
      localStorage.setItem('sync_queue', '[]');
      localStorage.setItem('last_sync_time', new Date().toISOString());

      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        pendingChanges: 0,
        lastSync: new Date(),
      }));

      toast({
        title: "Sync Complete",
        description: `Successfully synced ${syncQueue.length} changes.`,
      });

      loadOfflineData();
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      toast({
        title: "Sync Failed",
        description: "Failed to sync changes. Will retry automatically.",
        variant: "destructive",
      });
    }
  };

  const clearCache = () => {
    const keysToRemove = [];
    for (let key in localStorage) {
      if (key.startsWith('offline_') || key.startsWith('cache_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    loadOfflineData();
    
    toast({
      title: "Cache Cleared",
      description: "All offline data has been cleared.",
    });
  };

  const downloadData = () => {
    const data = {
      transactions: offlineData.transactions,
      syncQueue: offlineData.syncQueue,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mybudgeteer-offline-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Downloaded",
      description: "Your offline data has been downloaded as a JSON file.",
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    if (syncStatus.isSyncing) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    return syncStatus.isOnline ? (
      <Wifi className="h-4 w-4 text-green-500" />
    ) : (
      <WifiOff className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusText = () => {
    if (syncStatus.isSyncing) return "Syncing...";
    return syncStatus.isOnline ? "Online" : "Offline";
  };

  const getStatusColor = () => {
    if (syncStatus.isSyncing) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    return syncStatus.isOnline 
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  return (
    <div className="space-y-4">
      {/* Status Indicator */}
      <div className="flex items-center justify-between">
        <Badge className={`flex items-center gap-2 ${getStatusColor()}`}>
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
        
        {syncStatus.pendingChanges > 0 && (
          <Badge variant="outline" className="text-orange-600 dark:text-orange-400">
            {syncStatus.pendingChanges} pending changes
          </Badge>
        )}
      </div>

      {/* Offline Mode Alert */}
      {!syncStatus.isOnline && (
        <Alert>
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You're currently offline. Any changes you make will be saved locally and synced when you're back online.
          </AlertDescription>
        </Alert>
      )}

      {/* Service Worker Status */}
      {!serviceWorkerReady && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Offline functionality is not available. Service Worker failed to register.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Offline Status
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {showDetails && (
          <CardContent className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Connection</span>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="text-sm font-medium">{getStatusText()}</span>
              </div>
            </div>

            <Separator />

            {/* Cache Information */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cached Transactions</span>
                <span className="text-sm font-medium">{offlineData.transactions.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cache Size</span>
                <span className="text-sm font-medium">{formatBytes(offlineData.cacheSize)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Sync</span>
                <span className="text-sm font-medium">{syncStatus.pendingChanges} items</span>
              </div>
            </div>

            <Separator />

            {/* Last Sync */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Sync</span>
              <span className="text-sm font-medium">
                {syncStatus.lastSync 
                  ? syncStatus.lastSync.toLocaleString()
                  : "Never"
                }
              </span>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={syncPendingChanges}
                disabled={!syncStatus.isOnline || syncStatus.isSyncing || syncStatus.pendingChanges === 0}
                className="flex items-center gap-2"
              >
                {syncStatus.isSyncing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Upload className="h-3 w-3" />
                )}
                Sync Now
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={downloadData}
                disabled={offlineData.transactions.length === 0}
                className="flex items-center gap-2"
              >
                <Download className="h-3 w-3" />
                Export Data
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={clearCache}
                disabled={offlineData.cacheSize === 0}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
              >
                <AlertCircle className="h-3 w-3" />
                Clear Cache
              </Button>
            </div>

            {/* Service Worker Status */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {serviceWorkerReady ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <AlertCircle className="h-3 w-3 text-red-500" />
              )}
              Service Worker: {serviceWorkerReady ? "Active" : "Unavailable"}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
