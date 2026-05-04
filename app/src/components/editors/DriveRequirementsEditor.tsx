import { Plus, Trash2 } from 'lucide-react'
import { EditorSection, Field, Input, Textarea, ImageField, Divider } from './shared'

interface RequirementsContent {
  title?: string
  subtitle?: string
  items?: string[]
  image?: string
}

interface Props {
  value: RequirementsContent
  onChange: (v: RequirementsContent) => void
}

export function DriveRequirementsEditor({ value, onChange }: Props) {
  const items = value.items ?? []

  function update(i: number, val: string) {
    onChange({ ...value, items: items.map((item, idx) => idx === i ? val : item) })
  }
  function remove(i: number) {
    onChange({ ...value, items: items.filter((_, idx) => idx !== i) })
  }
  function add() {
    onChange({ ...value, items: [...items, ''] })
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section Header">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Requirements to drive" />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} rows={2} placeholder="A simple checklist to get you on the road." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Requirements List">
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={item} onChange={(e) => update(i, e.target.value)} placeholder="Valid driver's license..." className="flex-1" />
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={add} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
            <Plus className="h-4 w-4" /> Add Requirement
          </button>
        </div>
      </EditorSection>

      <Divider />

      <EditorSection title="Image">
        <ImageField label="Section Image" value={value.image ?? ''} onChange={(v) => onChange({ ...value, image: v })} />
      </EditorSection>
    </div>
  )
}
