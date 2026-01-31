import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('main.jsx loaded');
console.log('Root element:', document.getElementById('root'));

const rootElement = document.getElementById('root');

if (!rootElement) {
    console.error('Root element not found!');
    document.body.innerHTML = '<h1 style="color: red;">Error: Root element not found!</h1>';
} else {
    console.log('Rendering app...');
    createRoot(rootElement).render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
    console.log('App rendered');
}
