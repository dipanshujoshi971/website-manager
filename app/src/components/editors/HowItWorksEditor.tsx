import { EditorSection, Field, Input, Textarea, CardListEditor, Divider, type CardItem } from './shared'

interface HowItWorksContent {
  title?: string
  subtitle?: string
  steps?: CardItem[]
}

interface Props {
  value: HowItWorksContent
  onChange: (v: HowItWorksContent) => void
}

export function HowItWorksEditor({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <EditorSection title="Section Header">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="How It Works" />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} rows={2} placeholder="Three simple steps..." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Steps">
        <CardListEditor
          value={value.steps ?? []}
          onChange={(steps) => onChange({ ...value, steps })}
        />
      </EditorSection>
    </div>
  )
}
