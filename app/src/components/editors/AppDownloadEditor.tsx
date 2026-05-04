import { EditorSection, Field, Input, Textarea, ImageField, Divider } from './shared'

interface AppDownloadContent {
  title?: string
  subtitle?: string
  image?: string
}

interface Props {
  value: AppDownloadContent
  onChange: (v: AppDownloadContent) => void
}

export function AppDownloadEditor({ value, onChange }: Props) {
  function set<K extends keyof AppDownloadContent>(key: K, val: AppDownloadContent[K]) {
    onChange({ ...value, [key]: val })
  }

  return (
    <div className="space-y-6">
      <EditorSection title="App Download Section">
        <Field label="Title">
          <Input value={value.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="Download the App" />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => set('subtitle', e.target.value)} rows={2} placeholder="Available on iOS and Android" />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Image">
        <ImageField label="Phone Mockup Image" value={value.image ?? ''} onChange={(v) => set('image', v)} />
      </EditorSection>
    </div>
  )
}
