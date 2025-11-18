import { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || ''

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${apiBase}/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'signup' ? { email, password, name } : { email, password }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      onAuthed(data.token, data.user)
    } catch (err) {
      setError('Auth failed: ' + (err?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('login')} className={`px-3 py-1 rounded ${mode==='login' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-100 border border-white/10'}`}>Login</button>
        <button onClick={() => setMode('signup')} className={`px-3 py-1 rounded ${mode==='signup' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-100 border border-white/10'}`}>Sign up</button>
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm text-blue-100 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-800 text-blue-100 rounded-lg px-3 py-2 border border-white/10" />
          </div>
        )}
        <div>
          <label className="block text-sm text-blue-100 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800 text-blue-100 rounded-lg px-3 py-2 border border-white/10" />
        </div>
        <div>
          <label className="block text-sm text-blue-100 mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800 text-blue-100 rounded-lg px-3 py-2 border border-white/10" />
        </div>
        <button disabled={loading} className="disabled:opacity-50 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">{loading ? 'Please wait…' : (mode==='login' ? 'Login' : 'Create account')}</button>
      </form>
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </div>
  )
}
