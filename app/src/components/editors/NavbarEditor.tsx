import { Plus, Trash2 } from 'lucide-react'
import { EditorSection, Field, Input, Toggle, Divider, ButtonEditor } from './shared'

interface NavLink { to: string; label: string; show?: boolean }
interface NavbarContent {
  links?: NavLink[]
  ctaButton?: { show: boolean; text: string; link: string }
  brandDisplay?: 'both' | 'logo' | 'name'
}

interface Props {
  value: NavbarContent
  onChange: (v: NavbarContent) => void
}

export function NavbarEditor({ value, onChange }: Props) {
  const links = value.links ?? []

  function updateLink(i: number, field: keyof NavLink, val: string | boolean) {
    const next = links.map((l, idx) => idx === i ? { ...l, [field]: val } : l)
    onChange({ ...value, links: next })
  }
  function addLink() {
    onChange({ ...value, links: [...links, { to: '/', label: '', show: true }] })
  }
  function removeLink(i: number) {
    onChange({ ...value, links: links.filter((_, idx) => idx !== i) })
  }

  const brandDisplay = value.brandDisplay ?? 'both'
  const brandOptions: { value: 'both' | 'logo' | 'name'; label: string; hint: string }[] = [
    { value: 'both', label: 'Logo + Name', hint: 'Show the icon and the brand name side by side' },
    { value: 'logo', label: 'Logo only', hint: 'Show only the icon' },
    { value: 'name', label: 'Name only', hint: 'Show only the brand name as text' },
  ]

  return (
    <div className="space-y-6">
      <EditorSection title="Brand Display">
        <div className="grid grid-cols-3 gap-2">
          {brandOptions.map((opt) => {
            const active = brandDisplay === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...value, brandDisplay: opt.value })}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  active
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`text-sm font-medium ${active ? 'text-indigo-700' : 'text-gray-900'}`}>{opt.label}</div>
                <div className="mt-1 text-xs text-gray-500">{opt.hint}</div>
              </button>
            )
          })}
        </div>
      </EditorSection>

      <Divider />

      <EditorSection title="Navigation Links">
        <div className="space-y-3">
          {links.map((link, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Toggle
                  label="Show in nav"
                  checked={link.show ?? true}
                  onChange={(v) => updateLink(i, 'show', v)}
                />
                <button type="button" onClick={() => removeLink(i)} className="ml-3 text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Label">
                  <Input value={link.label} onChange={(e) => updateLink(i, 'label', e.target.value)} placeholder="Ride" />
                </Field>
                <Field label="Path">
                  <Input value={link.to} onChange={(e) => updateLink(i, 'to', e.target.value)} placeholder="/ride" />
                </Field>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addLink}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600"
          >
            <Plus className="h-4 w-4" /> Add Link
          </button>
        </div>
      </EditorSection>

      <Divider />

      <EditorSection title="CTA Button">
        <ButtonEditor
          label="CTA Button"
          value={value.ctaButton ?? { show: true, text: 'Get the App', link: '#download' }}
          onChange={(v) => onChange({ ...value, ctaButton: v })}
        />
      </EditorSection>
    </div>
  )
}
