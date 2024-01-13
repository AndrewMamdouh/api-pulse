import { useEffect, useState, ReactNode } from 'react';

type OfflineErrorBoundaryProps = {
  children: ReactNode;
};

/**
 *  OfflineErrorBoundary Component
 */
const OfflineErrorBoundary = ({ children }: OfflineErrorBoundaryProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  /**
   *  Change To Online State
   */
  const onlineHandler = () => setIsOnline(true);
  /**
   *  Change To Offline State
   */
  const offlineHandler = () => setIsOnline(false);

  useEffect(() => {
    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);

    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }, []);

  return isOnline ? (
    <>{children}</>
  ) : (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 className="font-bold text-3xl">Oops!</h1>
      <p className="text-xl font-medium">Slow or no internet connection.</p>
      <p className="text-xl font-medium">
        Please check your internet and try again.
      </p>
      <button
        className="mt-3 px-6 py-2 rounded-md font-semibold text-white bg-blue-500 hover:bg-orange-600"
        onClick={() => window.location.reload()}
      >
        Reload Page
      </button>
    </div>
  );
};

export default OfflineErrorBoundary;
