import { lazy } from 'react';
import Layout from '@/components/layout';
// import Root from '../components/root';
import { createHashRouter } from 'react-router';

export const router = createHashRouter([
  {
    path: '/home',
    Component: lazy(() => import('../pages/home')),
  },
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: lazy(() => import('@/pages/welcome')) },
      { path: 'users', Component: lazy(() => import('@/pages/users')) },
      { path: 'content', Component: lazy(() => import('@/pages/content')) },
      { path: 'settings', Component: lazy(() => import('@/pages/settings')) },
    ],
  },
]);

export default router;
