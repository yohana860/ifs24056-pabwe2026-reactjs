import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { loginApi } from '../api/authApi'

import {
  setLoading,
  setUser,
  setError,
} from '../states/authSlice'

import { putAccessToken } from '../../../helpers/apiHelper'

import {
  showErrorDialog,
  showSuccessDialog,
} from '../../../helpers/toolsHelper'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    isLoading,
    error,
  } = useSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const response = await loginApi(
        email,
        password,
      )

      const token =
        response?.data?.token ||
        response?.data?.access_token ||
        response?.token ||
        response?.access_token

      const user =
        response?.data?.user ||
        response?.data?.data?.user ||
        response?.user ||
        null

      if (!token) {
        throw new Error(
          'Access token tidak ditemukan dari response login.',
        )
      }

      putAccessToken(token)

      if (user) {
        dispatch(setUser(user))
      }

      showSuccessDialog(
        'Login Berhasil',
        'Selamat datang kembali.',
        {
          timer: 1200,
          showConfirmButton: false,
        },
      )

      navigate('/', {
        replace: true,
      })
    } catch (err) {
      dispatch(setError(err.message))

      await showErrorDialog(
        'Login Gagal',
        err.message,
      )
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          Lost & Found
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Login
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Masuk ke akun Anda.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="login-email-input"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email
          </label>

          <input
            id="login-email-input"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="nama@email.com"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="login-password-input"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <input
            id="login-password-input"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Masukkan password"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <button
          id="login-submit-button"
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading
            ? 'Memproses...'
            : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Belum punya akun?{' '}
        <Link
          to="/auth/register"
          className="font-semibold text-blue-600 hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  )
}

export default LoginPage