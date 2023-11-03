import ReactDOM from 'react-dom/client';
import React from 'react';
import App from '@/App';
import './index.less';
import '@/mock/mock-home';
import '@/mock/mock';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
