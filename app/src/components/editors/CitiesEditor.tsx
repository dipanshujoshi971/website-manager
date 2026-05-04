import { Plus, Trash2 } from 'lucide-react'
import { EditorSection, Field, Input, Textarea, ImageField, Divider } from './shared'

interface CitiesContent {
  title?: string
  subtitle?: string
  backgroundImage?: string
  list?: string[]
}

interface Props {
  value: CitiesContent
  onChange: (v: CitiesContent) => void
}

export function CitiesEditor({ value, onChange }: Props) {
  const list = value.list ?? []

  function updateCity(i: number, val: string) {
    onChange({ ...value, list: list.map((c, idx) => idx === i ? val : c) })
  }
  function removeCity(i: number) {
    onChange({ ...value, list: list.filter((_, idx) => idx !== i) })
  }
  function addCity() {
    onChange({ ...value, list: [...list, ''] })
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section Header">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Now in 50+ cities" />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} rows={2} placeholder="Growing every month..." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Background Image">
        <ImageField label="Background" value={value.backgroundImage ?? ''} onChange={(v) => onChange({ ...value, backgroundImage: v })} />
      </EditorSection>

      <Divider />

      <EditorSection title="City List">
        <div className="space-y-2">
          {list.map((city, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={city} onChange={(e) => updateCity(i, e.target.value)} placeholder="City name" className="flex-1" />
              <button type="button" onClick={() => removeCity(i)} className="text-red-400 hover:text-red-600 shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCity}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600"
          >
            <Plus className="h-4 w-4" /> Add City
          </button>
        </div>
      </EditorSection>
    </div>
  )
}
