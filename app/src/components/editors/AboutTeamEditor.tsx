import { EditorSection, Field, Input, Textarea, ImageField, Divider } from './shared'

interface TeamContent {
  title?: string
  body?: string
  body2?: string
  image?: string
}

interface Props {
  value: TeamContent
  onChange: (v: TeamContent) => void
}

export function AboutTeamEditor({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <EditorSection title="Team Section">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="A team that rides too" />
        </Field>
        <Field label="Body (first paragraph)">
          <Textarea value={value.body ?? ''} onChange={(e) => onChange({ ...value, body: e.target.value })} rows={4} placeholder="We're product designers, engineers..." />
        </Field>
        <Field label="Body (second paragraph)">
          <Textarea value={value.body2 ?? ''} onChange={(e) => onChange({ ...value, body2: e.target.value })} rows={3} placeholder="Headquartered across three continents..." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Image">
        <ImageField label="Team Image" value={value.image ?? ''} onChange={(v) => onChange({ ...value, image: v })} />
      </EditorSection>
    </div>
  )
}
