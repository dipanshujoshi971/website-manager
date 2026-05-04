import { Plus, Trash2 } from 'lucide-react'
import { EditorSection, Field, Input, Textarea, Divider } from './shared'

interface BreakdownItem { label: string; value: string }
interface PricingContent {
  title?: string
  subtitle?: string
  features?: string[]
  estimate?: {
    total?: string
    distance?: string
    breakdown?: BreakdownItem[]
    disclaimer?: string
  }
}

interface Props {
  value: PricingContent
  onChange: (v: PricingContent) => void
}

export function RidePricingEditor({ value, onChange }: Props) {
  const features = value.features ?? []
  const estimate = value.estimate ?? {}
  const breakdown = estimate.breakdown ?? []

  function setEstimate(key: string, val: string) {
    onChange({ ...value, estimate: { ...estimate, [key]: val } })
  }
  function updateFeature(i: number, val: string) {
    onChange({ ...value, features: features.map((f, idx) => idx === i ? val : f) })
  }
  function removeFeature(i: number) {
    onChange({ ...value, features: features.filter((_, idx) => idx !== i) })
  }
  function addFeature() {
    onChange({ ...value, features: [...features, ''] })
  }
  function updateBreakdown(i: number, field: keyof BreakdownItem, val: string) {
    onChange({ ...value, estimate: { ...estimate, breakdown: breakdown.map((b, idx) => idx === i ? { ...b, [field]: val } : b) } })
  }
  function removeBreakdown(i: number) {
    onChange({ ...value, estimate: { ...estimate, breakdown: breakdown.filter((_, idx) => idx !== i) } })
  }
  function addBreakdown() {
    onChange({ ...value, estimate: { ...estimate, breakdown: [...breakdown, { label: '', value: '' }] } })
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section Header">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Know the fare before you ride" />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} rows={2} placeholder="Every trip shows the exact price upfront..." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Feature Bullets">
        <div className="space-y-2">
          {features.map((feat, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={feat} onChange={(e) => updateFeature(i, e.target.value)} placeholder="Upfront pricing on every trip" className="flex-1" />
              <button type="button" onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600 shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addFeature} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
            <Plus className="h-4 w-4" /> Add Feature
          </button>
        </div>
      </EditorSection>

      <Divider />

      <EditorSection title="Sample Estimate Card">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Total">
            <Input value={estimate.total ?? ''} onChange={(e) => setEstimate('total', e.target.value)} placeholder="$12.40" />
          </Field>
          <Field label="Distance / Time">
            <Input value={estimate.distance ?? ''} onChange={(e) => setEstimate('distance', e.target.value)} placeholder="5.2 km • ~14 min" />
          </Field>
        </div>
        <Field label="Disclaimer">
          <Input value={estimate.disclaimer ?? ''} onChange={(e) => setEstimate('disclaimer', e.target.value)} placeholder="Sample estimate. Actual fares vary." />
        </Field>

        <div className="space-y-2 mt-2">
          <p className="text-sm font-medium text-gray-700">Breakdown Rows</p>
          {breakdown.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={row.label} onChange={(e) => updateBreakdown(i, 'label', e.target.value)} placeholder="Base fare" className="flex-1" />
              <Input value={row.value} onChange={(e) => updateBreakdown(i, 'value', e.target.value)} placeholder="$3.00" className="w-24" />
              <button type="button" onClick={() => removeBreakdown(i)} className="text-red-400 hover:text-red-600 shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addBreakdown} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
            <Plus className="h-4 w-4" /> Add Row
          </button>
        </div>
      </EditorSection>
    </div>
  )
}
