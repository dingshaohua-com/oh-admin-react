import { lazy } from 'react';
import { createHashRouter } from 'react-router';
import LayoutWrapper from '@/components/LayoutWrapper';

export const router = createHashRouter([
  {
    path: '/home',
    Component: lazy(() => import('../pages/home')),
  },
  {
    path: '/',
    Component: LayoutWrapper,
    children: [
      { index: true, Component: lazy(() => import('@/pages/welcome')) },
      { path: 'users', Component: lazy(() => import('@/pages/users')) },
      { path: 'content', Component: lazy(() => import('@/pages/content')) },
      { path: 'settings', Component: lazy(() => import('@/pages/settings')) },
      { path: 'settings/security', Component: lazy(() => import('@/pages/settings/security')) },
    ],
  },
]);

export default router;
