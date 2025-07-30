import { useEffect, useState } from "react";
import { LoadingScreen } from "./LoadingScreen";

interface PageTransitionProps {
  children: React.ReactNode;
  loading?: boolean;
  loadingMessage?: string;
  minLoadTime?: number; // Minimum loading time in ms
}

export const PageTransition = ({ 
  children, 
  loading = false, 
  loadingMessage,
  minLoadTime = 200 
}: PageTransitionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let loadingTimeout: NodeJS.Timeout;

    if (loading || isLoading) {
      // Simulate progress
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 100);

      // Minimum loading time
      loadingTimeout = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }, minLoadTime);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [loading, isLoading, minLoadTime]);

  if (loading || isLoading) {
    return <LoadingScreen message={loadingMessage} progress={progress} />;
  }

  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
};

export default PageTransition;
