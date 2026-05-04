import { EditorSection, Field, Input, Textarea, ImageField, Divider } from './shared'

interface PageHeroContent {
  eyebrow?: string
  title?: string
  subtitle?: string
  image?: string
}

interface Props {
  value: PageHeroContent
  onChange: (v: PageHeroContent) => void
  showImage?: boolean
}

export function PageHeroEditor({ value, onChange, showImage = true }: Props) {
  function set<K extends keyof PageHeroContent>(key: K, val: PageHeroContent[K]) {
    onChange({ ...value, [key]: val })
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Text">
        <Field label="Eyebrow / Label">
          <Input value={value.eyebrow ?? ''} onChange={(e) => set('eyebrow', e.target.value)} placeholder="For Riders" />
        </Field>
        <Field label="Headline">
          <Input value={value.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="Your ride, on demand." />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => set('subtitle', e.target.value)} rows={3} placeholder="Short description..." />
        </Field>
      </EditorSection>

      {showImage && (
        <>
          <Divider />
          <EditorSection title="Image">
            <ImageField label="Hero Image" value={value.image ?? ''} onChange={(v) => set('image', v)} />
          </EditorSection>
        </>
      )}
    </div>
  )
}
