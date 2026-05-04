import { Plus, Trash2 } from 'lucide-react'
import { EditorSection, Field, Input, Textarea, Divider } from './shared'

interface TimelineItem { year: string; title: string; description: string }
interface TimelineContent {
  title?: string
  items?: TimelineItem[]
}

interface Props {
  value: TimelineContent
  onChange: (v: TimelineContent) => void
}

export function AboutTimelineEditor({ value, onChange }: Props) {
  const items = value.items ?? []

  function update(i: number, field: keyof TimelineItem, val: string) {
    onChange({ ...value, items: items.map((item, idx) => idx === i ? { ...item, [field]: val } : item) })
  }
  function remove(i: number) {
    onChange({ ...value, items: items.filter((_, idx) => idx !== i) })
  }
  function add() {
    onChange({ ...value, items: [...items, { year: '', title: '', description: '' }] })
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section Header">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="How GoNex started" />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Timeline Events">
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Event {i + 1}</span>
                <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <Field label="Year">
                  <Input value={item.year} onChange={(e) => update(i, 'year', e.target.value)} placeholder="2024" />
                </Field>
                <Field label="Title">
                  <Input value={item.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="First city" />
                </Field>
              </div>
              <Field label="Description">
                <Textarea value={item.description} onChange={(e) => update(i, 'description', e.target.value)} rows={2} placeholder="GoNex launches in our home city..." />
              </Field>
            </div>
          ))}
          <button type="button" onClick={add} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
            <Plus className="h-4 w-4" /> Add Event
          </button>
        </div>
      </EditorSection>
    </div>
  )
}
