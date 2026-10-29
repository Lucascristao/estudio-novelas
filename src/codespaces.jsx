import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CodespacesSDK } from './codespaces-sdk.js';

const root = document.getElementById('root');
if (!root) throw new Error('O elemento de montagem do estúdio não foi encontrado.');
createRoot(root).render(<App sdk={CodespacesSDK} runtime="codespaces" canDownloadZip />);
