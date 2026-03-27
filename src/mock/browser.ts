import api from './api';
import { setupWorker } from 'msw/browser';

export default async function workServer() {
  const worker = setupWorker(...api);
  await worker.start({
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
    onUnhandledRequest: 'bypass',
  });

  return worker.stop;
}
