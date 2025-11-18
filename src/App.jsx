import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import UploadForm from './components/UploadForm'

function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  const onAuthed = (t, u) => {
    setToken(t)
    setUser(u)
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
  }

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t) setToken(t)
    if (u) setUser(JSON.parse(u))
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-8 max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Flames" className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-semibold text-white">Dialect Converter</h1>
              <p className="text-blue-200/80 text-sm">Turn Indian English speech into British or American English</p>
            </div>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-blue-100 text-sm">{user?.email}</span>
              <button onClick={logout} className="px-3 py-1 rounded bg-slate-800 text-blue-100 border border-white/10">Logout</button>
            </div>
          ) : null}
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {!token ? (
            <Auth onAuthed={onAuthed} />
          ) : (
            <UploadForm token={token} />
          )}

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-2">How it works</h3>
            <ol className="list-decimal list-inside text-blue-100 text-sm space-y-2">
              <li>Upload an audio or video file (up to 1GB).</li>
              <li>Choose British or American accent output.</li>
              <li>We transcribe, contextually convert phrases/spellings, and regenerate audio.</li>
              <li>Download the converted audio and copy the transcript.</li>
            </ol>
            <p className="text-blue-300/70 text-xs mt-3">For best results, keep background noise low. Add a project ID to enforce consistent glossary mappings across files.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
