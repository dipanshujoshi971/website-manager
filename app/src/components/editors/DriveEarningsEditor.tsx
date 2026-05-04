import { Plus, Trash2 } from 'lucide-react'
import { EditorSection, Field, Input, Textarea, Divider } from './shared'

interface EarningsTier { hours: string; min: string; max: string }
interface EarningsContent {
  title?: string
  subtitle?: string
  tiers?: EarningsTier[]
}

interface Props {
  value: EarningsContent
  onChange: (v: EarningsContent) => void
}

export function DriveEarningsEditor({ value, onChange }: Props) {
  const tiers = value.tiers ?? []

  function update(i: number, field: keyof EarningsTier, val: string) {
    onChange({ ...value, tiers: tiers.map((t, idx) => idx === i ? { ...t, [field]: val } : t) })
  }
  function remove(i: number) {
    onChange({ ...value, tiers: tiers.filter((_, idx) => idx !== i) })
  }
  function add() {
    onChange({ ...value, tiers: [...tiers, { hours: '', min: '', max: '' }] })
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section Header">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Estimate your earnings" />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} rows={2} placeholder="Based on average active drivers..." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Earning Tiers">
        <div className="space-y-3">
          {tiers.map((tier, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tier {i + 1}</span>
                <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Field label="Hours per week">
                <Input value={tier.hours} onChange={(e) => update(i, 'hours', e.target.value)} placeholder="10 hrs / week" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Min Earnings">
                  <Input value={tier.min} onChange={(e) => update(i, 'min', e.target.value)} placeholder="$180" />
                </Field>
                <Field label="Max Earnings">
                  <Input value={tier.max} onChange={(e) => update(i, 'max', e.target.value)} placeholder="$280" />
                </Field>
              </div>
            </div>
          ))}
          <button type="button" onClick={add} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
            <Plus className="h-4 w-4" /> Add Tier
          </button>
        </div>
      </EditorSection>
    </div>
  )
}
