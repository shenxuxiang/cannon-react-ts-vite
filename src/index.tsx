import ReactDOM from 'react-dom/client';
import React from 'react';
import App from '@/App';
import './index.less';

async function mockServer(callback: Function) {
  try {
    const resp = await import('./mock/browser');
    const workServer = resp.default;
    (window as any).stopWorkServer = await workServer();
    callback();
  } catch (err) {
    console.log(err);
  }
}

function mountApp() {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

  root.render(<App />);
}

if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK === 'true') {
  mockServer(mountApp);
} else {
  mountApp();
}
