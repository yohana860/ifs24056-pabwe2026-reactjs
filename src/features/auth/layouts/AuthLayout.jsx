import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-6 text-center">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              PABWE 2026
            </span>

            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              Lost & Found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Aplikasi pelaporan barang hilang dan ditemukan.
            </p>
          </div>

          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default AuthLayout