import { DollarSign } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  progress?: number;
}

export const LoadingScreen = ({ 
  message = "Loading MyBudgeteer...", 
  progress 
}: LoadingScreenProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(120,119,198,0.1),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(120,119,198,0.1),_transparent_50%)]" />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Logo with Pulse Animation */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 scale-110" />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 animate-pulse">
            <img src="/aikon.png" alt="MyBudgeteer Logo" className="h-12 w-12 animate-bounce" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground animate-fade-in">
            MyBudgeteer
          </h1>
          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            {message}
          </p>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="w-64 space-y-2 animate-fade-in animation-delay-400">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-blue-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {Math.round(progress)}%
            </div>
          </div>
        )}

        {/* Spinning Loader (when no progress) */}
        {progress === undefined && (
          <div className="animate-fade-in animation-delay-400">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 text-center animate-fade-in animation-delay-600">
        <p className="text-sm text-muted-foreground">
          Preparing your financial dashboard...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
