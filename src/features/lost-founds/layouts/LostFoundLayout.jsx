import { Outlet } from 'react-router-dom'

import NavbarComponent from '../components/NavbarComponent'
import SidebarComponent from '../components/SidebarComponent'

const LostFoundLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <NavbarComponent />

      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <SidebarComponent />

        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default LostFoundLayout