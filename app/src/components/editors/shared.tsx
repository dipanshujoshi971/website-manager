import { Plus, Trash2, Upload, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'

// ── Field wrapper ────────────────────────────────────────────────────────────

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

// ── Inputs ───────────────────────────────────────────────────────────────────

const inputCls = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} resize-none ${props.className ?? ''}`} />
}

export function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || '#6366f1'}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-12 cursor-pointer rounded border border-gray-200 p-0.5"
      />
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#6366f1"
        className="flex-1"
      />
    </div>
  )
}

// ── Toggle (show/hide) ───────────────────────────────────────────────────────

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 cursor-pointer">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${checked ? 'bg-indigo-600' : 'bg-gray-300'}`}
      >
        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </label>
  )
}

// ── Image field (URL + preview) ──────────────────────────────────────────────

export function ImageField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      onChange(url)
    } catch {
      alert('Upload failed — check API and R2 config')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <Field label={label} hint={hint ?? 'Paste a URL or upload from device'}>
      <div className="flex gap-2">
        <Input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://..." className="flex-1" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 shrink-0"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {value && (
        <img src={value} alt="" className="mt-2 h-24 w-full rounded-lg object-cover border border-gray-200" onError={(e) => (e.currentTarget.style.display = 'none')} />
      )}
    </Field>
  )
}

// ── Section container ────────────────────────────────────────────────────────

export function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  )
}

// ── "Show on page" toggle for entire sections ────────────────────────────────
// Drives `<page>.sectionsVisible.<key>` on the draft. /site checks the same key
// to decide whether to render the section.

export function SectionVisibilityToggle({
  visible,
  onToggle,
  label = 'Show this section on the page',
}: {
  visible: boolean
  onToggle: (v: boolean) => void
  label?: string
}) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 px-4 py-3 mb-2">
      <Toggle label={label} checked={visible} onChange={onToggle} />
    </div>
  )
}

export function Divider() {
  return <hr className="border-gray-100" />
}

// ── Button row editor (label + link + show toggle) ───────────────────────────

export function ButtonEditor({
  label,
  value,
  onChange,
}: {
  label: string
  value: { show: boolean; text: string; link: string }
  onChange: (v: { show: boolean; text: string; link: string }) => void
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 space-y-3">
      <Toggle label={`Show "${label}"`} checked={value.show ?? true} onChange={(show) => onChange({ ...value, show })} />
      {(value.show ?? true) && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Label">
            <Input value={value.text || ''} onChange={(e) => onChange({ ...value, text: e.target.value })} placeholder="Button label" />
          </Field>
          <Field label="Link / URL">
            <Input value={value.link || ''} onChange={(e) => onChange({ ...value, link: e.target.value })} placeholder="/page or https://..." />
          </Field>
        </div>
      )}
    </div>
  )
}

// ── Generic list item editor (icon + title + description) ────────────────────

export interface CardItem { icon: string; title: string; description: string }

export function CardListEditor({ value, onChange }: { value: CardItem[]; onChange: (v: CardItem[]) => void }) {
  function update(i: number, field: keyof CardItem, val: string) {
    const next = value.map((item, idx) => idx === i ? { ...item, [field]: val } : item)
    onChange(next)
  }
  function remove(i: number) { onChange(value.filter((_, idx) => idx !== i)) }
  function add() { onChange([...value, { icon: '⭐', title: '', description: '' }]) }

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Item {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-[64px_1fr] gap-3">
            <Field label="Icon">
              <Input value={item.icon} onChange={(e) => update(i, 'icon', e.target.value)} placeholder="🚗" />
            </Field>
            <Field label="Title">
              <Input value={item.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Title" />
            </Field>
          </div>
          <Field label="Description">
            <Textarea value={item.description} onChange={(e) => update(i, 'description', e.target.value)} rows={2} placeholder="Short description" />
          </Field>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600"
      >
        <Plus className="h-4 w-4" /> Add Item
      </button>
    </div>
  )
}

// ── Stat item editor ──────────────────────────────────────────────────────────

export interface StatItem { value: number; suffix: string; prefix?: string; label: string; decimals?: number }

export function StatListEditor({ value, onChange }: { value: StatItem[]; onChange: (v: StatItem[]) => void }) {
  function update(i: number, field: keyof StatItem, val: string | number) {
    onChange(value.map((item, idx) => idx === i ? { ...item, [field]: val } : item))
  }
  function remove(i: number) { onChange(value.filter((_, idx) => idx !== i)) }
  function add() { onChange([...value, { value: 0, suffix: '+', label: '' }]) }

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Stat {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Prefix">
              <Input value={item.prefix ?? ''} onChange={(e) => update(i, 'prefix', e.target.value)} placeholder="$" />
            </Field>
            <Field label="Value">
              <Input type="number" value={item.value} onChange={(e) => update(i, 'value', Number(e.target.value))} />
            </Field>
            <Field label="Suffix">
              <Input value={item.suffix} onChange={(e) => update(i, 'suffix', e.target.value)} placeholder="+" />
            </Field>
          </div>
          <Field label="Label">
            <Input value={item.label} onChange={(e) => update(i, 'label', e.target.value)} placeholder="Cities covered" />
          </Field>
        </div>
      ))}
      <button type="button" onClick={add} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
        <Plus className="h-4 w-4" /> Add Stat
      </button>
    </div>
  )
}
