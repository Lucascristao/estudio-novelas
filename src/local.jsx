import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Sem SDK: a prévia permite importar, editar e exportar; nunca gera mídia.
const root = document.getElementById('root');
if (!root) throw new Error('O elemento de montagem do estúdio não foi encontrado.');
createRoot(root).render(<App runtime="local" canDownloadZip />);
