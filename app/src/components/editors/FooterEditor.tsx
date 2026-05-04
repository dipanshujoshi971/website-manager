import { Plus, Trash2 } from 'lucide-react'
import { EditorSection, Field, Input, Textarea, Divider } from './shared'

interface FooterLink { to: string; label: string }
interface FooterColumn { title: string; links: FooterLink[] }
interface SocialLink { platform: string; url: string }
interface FooterContent {
  description?: string
  copyright?: string
  socials?: SocialLink[]
  columns?: FooterColumn[]
}

interface Props {
  value: FooterContent
  onChange: (v: FooterContent) => void
}

export function FooterEditor({ value, onChange }: Props) {
  const socials = value.socials ?? []
  const columns = value.columns ?? []

  function updateSocial(i: number, field: keyof SocialLink, val: string) {
    onChange({ ...value, socials: socials.map((s, idx) => idx === i ? { ...s, [field]: val } : s) })
  }
  function addSocial() { onChange({ ...value, socials: [...socials, { platform: '', url: '' }] }) }
  function removeSocial(i: number) { onChange({ ...value, socials: socials.filter((_, idx) => idx !== i) }) }

  function updateColumn(i: number, field: keyof FooterColumn, val: any) {
    onChange({ ...value, columns: columns.map((c, idx) => idx === i ? { ...c, [field]: val } : c) })
  }
  function addColumn() { onChange({ ...value, columns: [...columns, { title: '', links: [] }] }) }
  function removeColumn(i: number) { onChange({ ...value, columns: columns.filter((_, idx) => idx !== i) }) }

  function updateColumnLink(colIdx: number, linkIdx: number, field: keyof FooterLink, val: string) {
    const col = columns[colIdx]
    const links = col.links.map((l, idx) => idx === linkIdx ? { ...l, [field]: val } : l)
    updateColumn(colIdx, 'links', links)
  }
  function addColumnLink(colIdx: number) {
    const col = columns[colIdx]
    updateColumn(colIdx, 'links', [...col.links, { to: '/', label: '' }])
  }
  function removeColumnLink(colIdx: number, linkIdx: number) {
    const col = columns[colIdx]
    updateColumn(colIdx, 'links', col.links.filter((_, idx) => idx !== linkIdx))
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Footer Info">
        <Field label="Description">
          <Textarea value={value.description ?? ''} onChange={(e) => onChange({ ...value, description: e.target.value })} rows={2} placeholder="Your tagline or short description" />
        </Field>
        <Field label="Copyright Text">
          <Input value={value.copyright ?? ''} onChange={(e) => onChange({ ...value, copyright: e.target.value })} placeholder="© 2025 GoNex. All rights reserved." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Social Links">
        <div className="space-y-3">
          {socials.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={s.platform} onChange={(e) => updateSocial(i, 'platform', e.target.value)} placeholder="Twitter" className="w-28" />
              <Input value={s.url} onChange={(e) => updateSocial(i, 'url', e.target.value)} placeholder="https://twitter.com/..." className="flex-1" />
              <button type="button" onClick={() => removeSocial(i)} className="text-red-400 hover:text-red-600 shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addSocial} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-2.5 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
            <Plus className="h-4 w-4" /> Add Social
          </button>
        </div>
      </EditorSection>

      <Divider />

      <EditorSection title="Link Columns">
        <div className="space-y-4">
          {columns.map((col, ci) => (
            <div key={ci} className="rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Field label="Column Title">
                  <Input value={col.title} onChange={(e) => updateColumn(ci, 'title', e.target.value)} placeholder="Company" />
                </Field>
                <button type="button" onClick={() => removeColumn(ci)} className="ml-3 mt-5 text-red-400 hover:text-red-600 shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {col.links.map((link, li) => (
                  <div key={li} className="flex items-center gap-2">
                    <Input value={link.label} onChange={(e) => updateColumnLink(ci, li, 'label', e.target.value)} placeholder="About" className="flex-1" />
                    <Input value={link.to} onChange={(e) => updateColumnLink(ci, li, 'to', e.target.value)} placeholder="/about" className="flex-1" />
                    <button type="button" onClick={() => removeColumnLink(ci, li)} className="text-red-400 hover:text-red-600 shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addColumnLink(ci)} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline">
                  <Plus className="h-3 w-3" /> Add link
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addColumn} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-2.5 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
            <Plus className="h-4 w-4" /> Add Column
          </button>
        </div>
      </EditorSection>
    </div>
  )
}
