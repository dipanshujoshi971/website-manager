// Generic editor for sections with: title, subtitle, image, and a list of CardItems.
// Used for: ride.lifestyle, drive.featured
import { EditorSection, Field, Input, Textarea, ImageField, CardListEditor, Divider, type CardItem } from './shared'

interface ImageFeaturesContent {
  title?: string
  subtitle?: string
  image?: string
  features?: CardItem[]
}

interface Props {
  value: ImageFeaturesContent
  onChange: (v: ImageFeaturesContent) => void
  featuresLabel?: string
}

export function ImageFeaturesEditor({ value, onChange, featuresLabel = 'Features' }: Props) {
  return (
    <div className="space-y-6">
      <EditorSection title="Section Header">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Title" />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} rows={3} placeholder="Description..." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Image">
        <ImageField label="Section Image" value={value.image ?? ''} onChange={(v) => onChange({ ...value, image: v })} />
      </EditorSection>

      <Divider />

      <EditorSection title={featuresLabel}>
        <CardListEditor
          value={value.features ?? []}
          onChange={(features) => onChange({ ...value, features })}
        />
      </EditorSection>
    </div>
  )
}
