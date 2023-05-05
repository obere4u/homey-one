import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

export default function PrivateRoute() {
  const { loggedIn, checkStatus } = useAuthStatus();
  if (checkStatus) {
    return <Spinner />;
    {
      /*  you can add spinner effects here, this makes sure that the page doesn't return anything until check is completed */
    }
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in/" />
}
