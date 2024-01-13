import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RequestPage from './components/Workspace/Request/RequestPanel';
import './utils/axiosInterceptor';
import { ReactFlowProvider } from 'reactflow';
import LoginPage from './components/Workspace/Login/LoginPage';
import OfflineErrorBoundary from './utils/OfflineErrorBoundary';
import ReportsPage from './components/Workspace/Reports/ReportsPage';
import AuthProvider from './context/AuthProvider';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

/**
 * lazy loads for delivery optimization
 */
const FlowPage = React.lazy(
  () => import('./components/Workspace/Flows/FlowPage')
);
const SavedFlowsPage = React.lazy(
  () => import('./components/Workspace/SavedFlows/SavedFlowsPage')
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'collections',
        element: <RequestPage />,
      },
      {
        path: 'flows',
        element: (
          <ReactFlowProvider>
            <FlowPage />
          </ReactFlowProvider>
        ),
      },
      {
        path: 'saved-flows',
        element: <SavedFlowsPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
]);

root.render(
  <StrictMode>
    <OfflineErrorBoundary>
      <AuthProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <RouterProvider router={router} />
          </PersistGate>
        </Provider>
      </AuthProvider>
    </OfflineErrorBoundary>
  </StrictMode>
);
