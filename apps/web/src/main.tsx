import './style.css';
import router from './router';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';

createRoot(document.querySelector('#app')!).render(<RouterProvider router={router} />);
