import React from 'react';

interface OverlayProps {
  loading?: boolean;
  loadingComponent?: React.ComponentType;
}

export function Overlay({ loading, loadingComponent: LoadingComp }: OverlayProps) {
  if (loading) {
    return (
      <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/70">
        {LoadingComp ? (
          <LoadingComp />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-grid-accent" />
            <span className="text-sm text-grid-text-secondary">Loading...</span>
          </div>
        )}
      </div>
    );
  }

  return null;
}
