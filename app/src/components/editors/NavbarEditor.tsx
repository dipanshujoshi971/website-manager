import { Plus, Trash2 } from 'lucide-react'
import { EditorSection, Field, Input, Toggle, Divider, ButtonEditor } from './shared'

interface NavLink { to: string; label: string; show?: boolean }
interface NavbarContent {
  links?: NavLink[]
  ctaButton?: { show: boolean; text: string; link: string }
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

  return (
    <div className="space-y-6">
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
