import { Navigate, Outlet } from 'react-router-dom'

import { getAccessToken } from '../../../helpers/apiHelper'

const ProtectedRoute = () => {
  const token = getAccessToken()

  if (!token) {
    return (
      <Navigate
        to="/auth/login"
        replace
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute