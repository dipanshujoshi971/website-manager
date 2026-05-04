// Generic editor for sections with: title, optional subtitle, and CardItem[].
// Used for: drive.benefits, about.values, safety.riderFeatures, safety.driverFeatures, safety.pillars
import { EditorSection, Field, Input, Textarea, CardListEditor, Divider, type CardItem } from './shared'

interface CardSectionContent {
  title?: string
  subtitle?: string
  items?: CardItem[]
}

interface Props {
  value: CardSectionContent
  onChange: (v: CardSectionContent) => void
  showSubtitle?: boolean
  sectionLabel?: string
}

export function CardSectionEditor({ value, onChange, showSubtitle = false, sectionLabel = 'Items' }: Props) {
  return (
    <div className="space-y-6">
      <EditorSection title="Section Header">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Title" />
        </Field>
        {showSubtitle && (
          <Field label="Subtitle">
            <Textarea value={value.subtitle ?? ''} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} rows={2} placeholder="Subtitle..." />
          </Field>
        )}
      </EditorSection>

      <Divider />

      <EditorSection title={sectionLabel}>
        <CardListEditor
          value={value.items ?? []}
          onChange={(items) => onChange({ ...value, items })}
        />
      </EditorSection>
    </div>
  )
}
