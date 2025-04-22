
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'

// This ensures type references are imported
/// <reference types="react" />
/// <reference types="react-dom" />

createRoot(document.getElementById("root")!).render(<App />);
