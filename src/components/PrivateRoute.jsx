import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';

export default function PrivateRoute() {
  const { loggedIn, checkStatus } = useAuthStatus();
  if (checkStatus) {
    return <h3>Loading...</h3>;
    {
      /*  you can add spinner effects here, this makes sure that the page doesn't return anything until check is completed */
    }
  }
  return loggedIn ? <Outlet /> : <Navigate to="/signed-in/" />
}
