import React from 'react'
import { auth } from '../firebase/configuration'
import Homepage from './Homepage/Homepage';
import { Navigate } from 'react-router';

function ProtectedRoutes() {
    const user = auth.currentUser;
  return (
    <>
        {user ? <Homepage/> : <Navigate to={'/login'}/>}
    </>
  )
}

export default ProtectedRoutes