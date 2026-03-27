/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  VITE_THEME_COLOR: string;
}

interface Window {
  stopWorkServer?: () => void;
}
