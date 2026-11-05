import { useState, useCallback } from 'react';

export interface ModelViewerState {
  autoRotate: boolean;
  wireframe: boolean;
  isFullscreen: boolean;
  zoom: number;
}

export function useModelViewer() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleAutoRotate = useCallback(() => {
    setAutoRotate((prev) => !prev);
  }, []);

  const toggleWireframe = useCallback(() => {
    setWireframe((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback((containerElement?: HTMLElement | null) => {
    if (!document.fullscreenElement) {
      if (containerElement && containerElement.requestFullscreen) {
        containerElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  }, []);

  return {
    autoRotate,
    wireframe,
    isFullscreen,
    toggleAutoRotate,
    toggleWireframe,
    toggleFullscreen
  };
}
