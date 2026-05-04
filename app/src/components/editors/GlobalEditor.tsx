import { Plus, Trash2 } from 'lucide-react'
import { EditorSection, Field, Input, Textarea, ColorInput, ImageField, Divider } from './shared'

interface GlobalContent {
  siteName?: string
  tagline?: string
  logo?: string
  favicon?: string
  seo?: { title?: string; description?: string; ogTitle?: string; ogDescription?: string }
  storeLinks?: { appStore?: string; playStore?: string }
  colors?: { primary?: string; primaryGlow?: string }
}

interface Props {
  value: GlobalContent
  onChange: (v: GlobalContent) => void
}

export function GlobalEditor({ value, onChange }: Props) {
  function set<K extends keyof GlobalContent>(key: K, val: GlobalContent[K]) {
    onChange({ ...value, [key]: val })
  }
  function setSeo(key: string, val: string) {
    onChange({ ...value, seo: { ...value.seo, [key]: val } })
  }
  function setStore(key: string, val: string) {
    onChange({ ...value, storeLinks: { ...value.storeLinks, [key]: val } })
  }
  function setColor(key: string, val: string) {
    onChange({ ...value, colors: { ...value.colors, [key]: val } })
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Brand">
        <Field label="Site Name">
          <Input value={value.siteName ?? ''} onChange={(e) => set('siteName', e.target.value)} placeholder="GoNex" />
        </Field>
        <Field label="Tagline">
          <Input value={value.tagline ?? ''} onChange={(e) => set('tagline', e.target.value)} placeholder="Ready to go? Let's GoNex." />
        </Field>
        <ImageField label="Logo URL" value={value.logo ?? ''} onChange={(v) => set('logo', v)} />
        <Field label="Favicon URL">
          <Input value={value.favicon ?? ''} onChange={(e) => set('favicon', e.target.value)} placeholder="https://..." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Colors">
        <Field label="Primary Color">
          <ColorInput value={value.colors?.primary ?? '#6366f1'} onChange={(v) => setColor('primary', v)} />
        </Field>
        <Field label="Primary Glow">
          <ColorInput value={value.colors?.primaryGlow ?? '#818cf8'} onChange={(v) => setColor('primaryGlow', v)} />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="App Store Links">
        <Field label="Apple App Store URL">
          <Input value={value.storeLinks?.appStore ?? ''} onChange={(e) => setStore('appStore', e.target.value)} placeholder="https://apps.apple.com/..." />
        </Field>
        <Field label="Google Play Store URL">
          <Input value={value.storeLinks?.playStore ?? ''} onChange={(e) => setStore('playStore', e.target.value)} placeholder="https://play.google.com/..." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="SEO / Meta">
        <Field label="Page Title">
          <Input value={value.seo?.title ?? ''} onChange={(e) => setSeo('title', e.target.value)} placeholder="GoNex — Ready to go?" />
        </Field>
        <Field label="Meta Description">
          <Textarea value={value.seo?.description ?? ''} onChange={(e) => setSeo('description', e.target.value)} rows={2} placeholder="Short description for search engines" />
        </Field>
        <Field label="OG Title">
          <Input value={value.seo?.ogTitle ?? ''} onChange={(e) => setSeo('ogTitle', e.target.value)} />
        </Field>
        <Field label="OG Description">
          <Textarea value={value.seo?.ogDescription ?? ''} onChange={(e) => setSeo('ogDescription', e.target.value)} rows={2} />
        </Field>
      </EditorSection>
    </div>
  )
}
