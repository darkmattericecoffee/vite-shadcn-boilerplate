// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';
import { Layout } from './components/Layout';
import {
  HomePage,
  ProjectsPage,
  ProjectDetailPage,
  StudentsPage,
  AssignmentsPage,
  AssignmentDetailPage,
  LearningPathsPage,
  LearningPathDetailPage // Import the new component
} from './pages';
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
        path: 'assignments/:id', // Add the new route
        element: <AssignmentDetailPage />,
      },
      {
        path: 'learning-paths',
        element: <LearningPathsPage />,
      },
      {
        path: 'learning-paths/:id', // Add the new route
        element: <LearningPathDetailPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);