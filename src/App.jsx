import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import AuthLayout from './features/auth/layouts/AuthLayout'
import ProtectedRoute from './features/auth/layouts/ProtectedRoute'
import LostFoundLayout from './features/lost-founds/layouts/LostFoundLayout'

import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'

import HomePage from './features/lost-founds/pages/HomePage'
import DetailPage from './features/lost-founds/pages/DetailPage'
import UsersPage from './features/users/pages/UsersPage'
import ProfilePage from './features/users/pages/ProfilePage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            AUTH ROUTES
        ========================== */}
        <Route
          path="/auth"
          element={<AuthLayout />}
        >
          <Route
            path="login"
            element={<LoginPage />}
          />

          <Route
            path="register"
            element={<RegisterPage />}
          />
        </Route>

        {/* =========================
            PROTECTED ROUTES
        ========================== */}
        <Route element={<ProtectedRoute />}>
          <Route element={<LostFoundLayout />}>
            <Route
              path="/"
              element={<HomePage />}
            />

            <Route
              path="/lost-founds/:id"
              element={<DetailPage />}
            />

            <Route
              path="/users"
              element={<UsersPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />
          </Route>
        </Route>

        {/* =========================
            FALLBACK
        ========================== */}
        <Route
          path="*"
          element={<Navigate to="/auth/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App