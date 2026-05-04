import { EditorSection, Field, Input, Textarea, ImageField, Toggle, ButtonEditor, Divider } from './shared'

interface HeroButton { show: boolean; text: string; link: string }
interface HeroContent {
  badge?: string
  title?: string
  titleHighlight?: string
  subtitle?: string
  ctaPrimary?: HeroButton
  ctaSecondary?: HeroButton
  appStoreButton?: { show: boolean }
  playStoreButton?: { show: boolean }
  rating?: string
  ratingText?: string
  backgroundImage?: string
  phoneImage?: string
}

interface Props {
  value: HeroContent
  onChange: (v: HeroContent) => void
}

export function HeroEditor({ value, onChange }: Props) {
  function set<K extends keyof HeroContent>(key: K, val: HeroContent[K]) {
    onChange({ ...value, [key]: val })
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Text">
        <Field label="Badge / Eyebrow">
          <Input value={value.badge ?? ''} onChange={(e) => set('badge', e.target.value)} placeholder="Now available in 20+ cities" />
        </Field>
        <Field label="Headline">
          <Input value={value.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="Your Ride," />
        </Field>
        <Field label="Headline Highlight (colored part)">
          <Input value={value.titleHighlight ?? ''} onChange={(e) => set('titleHighlight', e.target.value)} placeholder="On Demand." />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle ?? ''} onChange={(e) => set('subtitle', e.target.value)} rows={2} placeholder="Safe, affordable rides..." />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Buttons">
        <ButtonEditor
          label="Primary Button"
          value={value.ctaPrimary ?? { show: true, text: 'Get a Ride', link: '/ride' }}
          onChange={(v) => set('ctaPrimary', v)}
        />
        <ButtonEditor
          label="Secondary Button"
          value={value.ctaSecondary ?? { show: true, text: 'Become a Driver', link: '/drive' }}
          onChange={(v) => set('ctaSecondary', v)}
        />
      </EditorSection>

      <Divider />

      <EditorSection title="App Store Badges">
        <Toggle
          label="Show App Store badge"
          checked={value.appStoreButton?.show ?? true}
          onChange={(v) => set('appStoreButton', { show: v })}
        />
        <Toggle
          label="Show Play Store badge"
          checked={value.playStoreButton?.show ?? true}
          onChange={(v) => set('playStoreButton', { show: v })}
        />
      </EditorSection>

      <Divider />

      <EditorSection title="Social Proof">
        <Field label="Rating">
          <Input value={value.rating ?? ''} onChange={(e) => set('rating', e.target.value)} placeholder="4.9★" />
        </Field>
        <Field label="Rating Text">
          <Input value={value.ratingText ?? ''} onChange={(e) => set('ratingText', e.target.value)} placeholder="50K+ reviews" />
        </Field>
      </EditorSection>

      <Divider />

      <EditorSection title="Images">
        <ImageField label="Background Image" value={value.backgroundImage ?? ''} onChange={(v) => set('backgroundImage', v)} />
        <ImageField label="Phone / App Screenshot" value={value.phoneImage ?? ''} onChange={(v) => set('phoneImage', v)} />
      </EditorSection>
    </div>
  )
}
