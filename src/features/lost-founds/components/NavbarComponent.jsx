import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { clearUser } from '../../auth/states/authSlice'
import { putAccessToken } from '../../../helpers/apiHelper'

const NavbarComponent = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.auth.user)

  const handleLogout = () => {
    putAccessToken(null)
    dispatch(clearUser())
    navigate('/auth/login', { replace: true })
  }

  return (
    <nav aria-label="Navigasi utama" className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="block">
          <p className="text-lg font-bold text-slate-900">
            Lost & Found
          </p>

          <p className="text-xs text-slate-600">
            PABWE 2026
          </p>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="hidden text-right sm:block"
          >
            <p className="text-sm font-semibold text-slate-900 hover:text-blue-600">
              {user?.name || 'Pengguna'}
            </p>

            <p className="text-xs text-slate-600">
              {user?.email || '-'}
            </p>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavbarComponent