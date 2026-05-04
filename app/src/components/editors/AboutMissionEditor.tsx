import { EditorSection, Field, Input, Textarea } from './shared'

interface MissionContent {
  title?: string
  body?: string
}

interface Props {
  value: MissionContent
  onChange: (v: MissionContent) => void
}

export function AboutMissionEditor({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <EditorSection title="Mission Statement">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Our mission" />
        </Field>
        <Field label="Body">
          <Textarea value={value.body ?? ''} onChange={(e) => onChange({ ...value, body: e.target.value })} rows={6} placeholder="We believe great transportation should be available to everyone..." />
        </Field>
      </EditorSection>
    </div>
  )
}
