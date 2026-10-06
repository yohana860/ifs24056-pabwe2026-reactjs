import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getUsersApi } from '../api/usersApi'
import {
  setError,
  setLoading,
  setUsers,
} from '../states/usersSlice'

const UsersPage = () => {
  const dispatch = useDispatch()

  const { users, isLoading, error } = useSelector(
    (state) => state.users,
  )

  useEffect(() => {
    const loadUsers = async () => {
      dispatch(setLoading(true))
      dispatch(setError(null))

      try {
        const response = await getUsersApi()

        const userData =
          response?.data?.users ||
          response?.data ||
          response?.users ||
          []

        dispatch(setUsers(Array.isArray(userData) ? userData : []))
      } catch (err) {
        dispatch(setError(err.message))
      } finally {
        dispatch(setLoading(false))
      }
    }

    loadUsers()
  }, [dispatch])

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <p className="text-lg font-bold text-slate-900">
            Lost & Found
          </p>
          <p className="text-sm text-slate-600">
            Daftar Pengguna
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-semibold text-blue-600">
              Users
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Daftar Pengguna
            </h1>
          </div>

          {isLoading && (
            <p className="text-slate-600">
              Memuat data pengguna...
            </p>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              Gagal mengambil data pengguna: {error}
            </div>
          )}

          {!isLoading && !error && users.length === 0 && (
            <p className="text-slate-600">
              Belum ada data pengguna.
            </p>
          )}

          {!isLoading && !error && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                      #
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                      Nama
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                      Email
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id ?? index}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-900">
                        {user.name ?? '-'}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {user.email ?? '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default UsersPage