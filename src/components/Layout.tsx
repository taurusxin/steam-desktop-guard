import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <header className="border-b border-slate-700 py-4 px-6">
        <h1 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
          Steam Desktop Guard
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-700 py-3">
        <nav className="flex justify-around">
          <NavLink to="/" active={location.pathname === '/'}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Home</span>
          </NavLink>

          <NavLink to="/settings" active={location.pathname === '/settings'}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Settings</span>
          </NavLink>
        </nav>
      </footer>
    </div>
  )
}

interface NavLinkProps {
  to: string
  active: boolean
  children: React.ReactNode
}

function NavLink({ to, active, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={clsx(
        'flex flex-col items-center text-sm font-medium transition-colors',
        active ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'
      )}
    >
      {children}
    </Link>
  )
}
