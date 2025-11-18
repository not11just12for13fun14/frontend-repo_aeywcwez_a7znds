import { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || ''

export default function UploadForm({ token }) {
  const [file, setFile] = useState(null)
  const [accent, setAccent] = useState('british')
  const [projectId, setProjectId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!file) return
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('target_accent', accent)
      if (projectId) form.append('project_id', projectId)

      const res = await fetch(`${apiBase}/jobs/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError('Upload failed: ' + (err?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-blue-100 mb-1">Media file (audio/video, up to 1GB)</label>
          <input type="file" accept="audio/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-blue-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
        </div>
        <div className="flex gap-4 items-center">
          <label className="text-sm text-blue-100">Target accent</label>
          <select value={accent} onChange={(e) => setAccent(e.target.value)} className="bg-slate-800 text-blue-100 rounded-lg px-3 py-2 border border-white/10">
            <option value="british">British</option>
            <option value="american">American</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-100 mb-1">Project ID (optional for glossary consistency)</label>
          <input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="project id" className="w-full bg-slate-800 text-blue-100 rounded-lg px-3 py-2 border border-white/10 placeholder:text-blue-300/50" />
        </div>
        <button disabled={loading || !file} className="disabled:opacity-50 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">{loading ? 'Processing…' : 'Convert'}</button>
      </form>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

      {result && (
        <div className="mt-6 space-y-3">
          <p className="text-blue-100 text-sm">Status: {result.status}</p>
          {result.transcript_text && (
            <div>
              <p className="text-blue-200 text-sm mb-1">Transcript</p>
              <div className="bg-black/30 border border-white/10 rounded p-3 text-blue-100 text-sm whitespace-pre-wrap max-h-48 overflow-auto">{result.transcript_text}</div>
            </div>
          )}
          {result.dialect_normalised_text && (
            <div>
              <p className="text-blue-200 text-sm mb-1">Converted transcript</p>
              <div className="bg-black/30 border border-white/10 rounded p-3 text-blue-100 text-sm whitespace-pre-wrap max-h-48 overflow-auto">{result.dialect_normalised_text}</div>
            </div>
          )}
          {result.tts_audio_url && (
            <div>
              <audio controls src={`${apiBase}${result.tts_audio_url}`} className="w-full" />
              <a href={`${apiBase}${result.tts_audio_url}`} download className="inline-block mt-2 text-blue-300 hover:text-white text-sm underline">Download audio</a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
