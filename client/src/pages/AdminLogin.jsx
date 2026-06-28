import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const authenticated = await login(username.trim(), password)
    if (authenticated) {
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid admin username or password.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-16">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-300/40">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-500">Admin Access</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Suggula's Kitchen Login</h1>
            <p className="mt-2 text-slate-500">Sign in with the admin credentials to manage the website.</p>
          </div>

          {error && <div className="mb-6 rounded-3xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Username</span>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                autoComplete="username"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                autoComplete="current-password"
                required
              />
            </label>

            <button type="submit" className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default AdminLogin
