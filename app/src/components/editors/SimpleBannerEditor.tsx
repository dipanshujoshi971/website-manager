// Generic editor for sections with: title, subtitle, and an image.
// Used for: about.cityBanner, safety.emergency, help.support
import { EditorSection, Field, Input, Textarea, ImageField, Divider } from './shared'

interface BannerContent {
  title?: string
  subtitle?: string
  image?: string
}

interface Props {
  value: BannerContent
  onChange: (v: BannerContent) => void
  imageLabel?: string
}

export function SimpleBannerEditor({ value, onChange, imageLabel = 'Image' }: Props) {
  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Title" />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} rows={3} placeholder="Description..." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Image">
        <ImageField label={imageLabel} value={value.image ?? ''} onChange={(v) => onChange({ ...value, image: v })} />
      </EditorSection>
    </div>
  )
}
