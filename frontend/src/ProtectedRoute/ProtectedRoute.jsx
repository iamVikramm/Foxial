import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = () => {
  const authToken = Cookies.get('foxialAuthToken');

  return authToken ? <Outlet /> : <Navigate to="/intro" />;
};

export default ProtectedRoute;