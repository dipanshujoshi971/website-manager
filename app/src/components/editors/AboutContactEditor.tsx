import { Plus, Trash2 } from 'lucide-react'
import { EditorSection, Field, Input, Textarea, Divider } from './shared'

interface EmailEntry { label: string; email: string }
interface ContactContent {
  title?: string
  subtitle?: string
  emails?: EmailEntry[]
}

interface Props {
  value: ContactContent
  onChange: (v: ContactContent) => void
}

export function AboutContactEditor({ value, onChange }: Props) {
  const emails = value.emails ?? []

  function update(i: number, field: keyof EmailEntry, val: string) {
    onChange({ ...value, emails: emails.map((e, idx) => idx === i ? { ...e, [field]: val } : e) })
  }
  function remove(i: number) {
    onChange({ ...value, emails: emails.filter((_, idx) => idx !== i) })
  }
  function add() {
    onChange({ ...value, emails: [...emails, { label: '', email: '' }] })
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section Header">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Get in touch" />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} rows={2} placeholder="Questions, feedback, partnership ideas..." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Contact Emails">
        <div className="space-y-3">
          {emails.map((entry, i) => (
            <div key={i} className="flex items-end gap-2">
              <Field label="Label">
                <Input value={entry.label} onChange={(e) => update(i, 'label', e.target.value)} placeholder="General" />
              </Field>
              <Field label="Email Address">
                <Input type="email" value={entry.email} onChange={(e) => update(i, 'email', e.target.value)} placeholder="hello@yourapp.com" />
              </Field>
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 pb-2 shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={add} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
            <Plus className="h-4 w-4" /> Add Email
          </button>
        </div>
      </EditorSection>
    </div>
  )
}
