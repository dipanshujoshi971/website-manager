import { Plus, Trash2 } from 'lucide-react'
import { EditorSection, Field, Input, Textarea, Divider } from './shared'

interface CategoryItem { name: string; description: string; price: string }
interface CategoriesContent {
  title?: string
  subtitle?: string
  items?: CategoryItem[]
}

interface Props {
  value: CategoriesContent
  onChange: (v: CategoriesContent) => void
}

export function RideCategoriesEditor({ value, onChange }: Props) {
  const items = value.items ?? []

  function update(i: number, field: keyof CategoryItem, val: string) {
    onChange({ ...value, items: items.map((item, idx) => idx === i ? { ...item, [field]: val } : item) })
  }
  function remove(i: number) {
    onChange({ ...value, items: items.filter((_, idx) => idx !== i) })
  }
  function add() {
    onChange({ ...value, items: [...items, { name: '', description: '', price: '' }] })
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section Header">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Choose your ride" />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} rows={2} placeholder="A class for every trip." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Ride Categories">
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category {i + 1}</span>
                <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name">
                  <Input value={item.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="GoNex Go" />
                </Field>
                <Field label="Starting Price">
                  <Input value={item.price} onChange={(e) => update(i, 'price', e.target.value)} placeholder="from $4" />
                </Field>
              </div>
              <Field label="Description">
                <Textarea value={item.description} onChange={(e) => update(i, 'description', e.target.value)} rows={2} placeholder="Affordable everyday rides..." />
              </Field>
            </div>
          ))}
          <button
            type="button"
            onClick={add}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600"
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>
      </EditorSection>
    </div>
  )
}
