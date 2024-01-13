import React, { useState, useEffect, ReactNode } from 'react';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}
/**
 * GlobalErrorBoundary Component
 */
const GlobalErrorBoundary: React.FC<GlobalErrorBoundaryProps> = ({
  children,
}) => {
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    // Reset error state when component mounts
    setHasError(false);
  }, []);

  // const componentDidCatch = (error: Error, info: ErrorInfo) => {
  //     console.error('GlobalErrorBoundary caught an error', error, info);
  //     setHasError(true);
  // };

  if (hasError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Oops! Something went wrong.</h1>
        <p>We're sorry for the inconvenience. Please reload and try again.</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  return <>{children}</>;
};

export default GlobalErrorBoundary;
