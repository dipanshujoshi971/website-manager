import { Plus, Trash2 } from 'lucide-react'
import { EditorSection, Field, Input, Textarea, ImageField, Divider } from './shared'

interface TrustContent {
  title?: string
  subtitle?: string
  badges?: string[]
  image?: string
}

interface Props {
  value: TrustContent
  onChange: (v: TrustContent) => void
}

export function SafetyTrustEditor({ value, onChange }: Props) {
  const badges = value.badges ?? []

  function updateBadge(i: number, val: string) {
    onChange({ ...value, badges: badges.map((b, idx) => idx === i ? val : b) })
  }
  function removeBadge(i: number) {
    onChange({ ...value, badges: badges.filter((_, idx) => idx !== i) })
  }
  function addBadge() {
    onChange({ ...value, badges: [...badges, ''] })
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section Header">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Trusted, verified, accountable" />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} rows={3} placeholder="Every driver completes background checks..." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Trust Badges">
        <div className="space-y-2">
          {badges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={badge} onChange={(e) => updateBadge(i, e.target.value)} placeholder="Background-checked" className="flex-1" />
              <button type="button" onClick={() => removeBadge(i)} className="text-red-400 hover:text-red-600 shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addBadge} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
            <Plus className="h-4 w-4" /> Add Badge
          </button>
        </div>
      </EditorSection>

      <Divider />

      <EditorSection title="Image">
        <ImageField label="Trust Image" value={value.image ?? ''} onChange={(v) => onChange({ ...value, image: v })} />
      </EditorSection>
    </div>
  )
}
