// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';
import { Layout } from './components/Layout';
import { TimelineLayout } from './components/TimelineLayout';
import {
  HomePage,
  ProjectsPage,
  ProjectDetailPage,
  StudentsPage,
  AssignmentsPage,
  AssignmentDetailPage,
  LearningPathsPage,
  LearningPathDetailPage
} from './pages';
import { TimelinePage } from './pages/TimelinePage';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'projects/:id',
        element: <ProjectDetailPage />,
      },
      {
        path: 'students',
        element: <StudentsPage />,
      },
      {
        path: 'assignments',
        element: <AssignmentsPage />,
      },
      {
        path: 'assignments/:id',
        element: <AssignmentDetailPage />,
      },
      {
        path: 'learning-paths',
        element: <LearningPathsPage />,
      },
      {
        path: 'learning-paths/:id',
        element: <LearningPathDetailPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: '/timeline',
    element: <TimelineLayout />,
    children: [
      {
        index: true,
        element: <TimelinePage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);