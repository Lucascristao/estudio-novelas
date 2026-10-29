import React from 'react';
import { Flow } from 'flow-sdk';
import App from './App.jsx';

// A versão do SDK hospedeiro deve confirmar ZIP antes de ativar essa capacidade.
export default function SanjaFlowApp() {
  return <App sdk={Flow} runtime="flow" canDownloadZip={false} />;
}
