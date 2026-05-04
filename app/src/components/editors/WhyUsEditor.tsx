import { EditorSection, Field, Input, Textarea, CardListEditor, Divider, type CardItem } from './shared'

interface WhyUsContent {
  title?: string
  subtitle?: string
  features?: CardItem[]
}

interface Props {
  value: WhyUsContent
  onChange: (v: WhyUsContent) => void
}

export function WhyUsEditor({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <EditorSection title="Section Header">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Why Choose Us" />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} rows={2} placeholder="A smarter way to move through your city." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Features">
        <CardListEditor
          value={value.features ?? []}
          onChange={(features) => onChange({ ...value, features })}
        />
      </EditorSection>
    </div>
  )
}
