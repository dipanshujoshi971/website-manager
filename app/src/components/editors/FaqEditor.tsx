import { Plus, Trash2 } from 'lucide-react'
import { EditorSection, Field, Input, Textarea } from './shared'

interface FaqItem { question: string; answer: string }

interface Props {
  value: FaqItem[]
  onChange: (v: FaqItem[]) => void
  sectionTitle?: string
}

export function FaqEditor({ value, onChange, sectionTitle = 'FAQs' }: Props) {
  function update(i: number, field: keyof FaqItem, val: string) {
    onChange(value.map((item, idx) => idx === i ? { ...item, [field]: val } : item))
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i))
  }
  function add() {
    onChange([...value, { question: '', answer: '' }])
  }

  return (
    <div className="space-y-6">
      <EditorSection title={sectionTitle}>
        <div className="space-y-3">
          {value.map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">FAQ {i + 1}</span>
                <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Field label="Question">
                <Input value={item.question} onChange={(e) => update(i, 'question', e.target.value)} placeholder="How do I cancel a ride?" />
              </Field>
              <Field label="Answer">
                <Textarea value={item.answer} onChange={(e) => update(i, 'answer', e.target.value)} rows={3} placeholder="Open the app, tap your active trip..." />
              </Field>
            </div>
          ))}
          <button type="button" onClick={add} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
            <Plus className="h-4 w-4" /> Add FAQ
          </button>
        </div>
      </EditorSection>
    </div>
  )
}
