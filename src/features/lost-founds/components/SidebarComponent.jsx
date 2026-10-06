import { NavLink } from 'react-router-dom'

const SidebarComponent = () => {
  const menuItems = [
    {
      label: 'Dashboard',
      path: '/',
    },
    {
      label: 'Pengguna',
      path: '/users',
    },
    {
      label: 'Profil Saya',
      path: '/profile',
    },
  ]

  return (
    <aside className="w-full border-b bg-white md:min-h-[calc(100vh-73px)] md:w-60 md:border-b-0 md:border-r">
      <div className="p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
          Menu
        </p>

        <nav aria-label="Menu samping" className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default SidebarComponent