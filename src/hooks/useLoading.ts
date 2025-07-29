import { useState, useEffect } from 'react';

interface UseLoadingOptions {
  minDuration?: number;
  initialLoading?: boolean;
}

export const useLoading = (options: UseLoadingOptions = {}) => {
  const { minDuration = 800, initialLoading = true } = options;
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [progress, setProgress] = useState(0);

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const stopLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  };

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let minDurationTimeout: NodeJS.Timeout;

    if (isLoading) {
      // Simulate progress
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 150);

      // Ensure minimum loading duration
      if (minDuration > 0) {
        minDurationTimeout = setTimeout(() => {
          setProgress(100);
          setTimeout(() => {
            setIsLoading(false);
            setProgress(0);
          }, 200);
        }, minDuration);
      }
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (minDurationTimeout) clearTimeout(minDurationTimeout);
    };
  }, [isLoading, minDuration]);

  return {
    isLoading,
    progress,
    startLoading,
    stopLoading,
  };
};

export default useLoading;
