import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './auth/auth-context.tsx';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes.tsx';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-color-palette/css';
import './index.css';
import { ToastContainer } from 'react-toastify';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH9ecnRcRmVdVER/WUY='
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    <ToastContainer autoClose={1200} />
  </React.StrictMode>
);
