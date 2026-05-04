import { EditorSection, Toggle, StatListEditor, type StatItem } from './shared'

interface StatsContent {
  show?: boolean
  items?: StatItem[]
}

interface Props {
  value: StatsContent
  onChange: (v: StatsContent) => void
}

export function StatsEditor({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <EditorSection title="Stats Section">
        <Toggle
          label="Show Stats Section"
          checked={value.show ?? true}
          onChange={(show) => onChange({ ...value, show })}
        />
      </EditorSection>

      {(value.show ?? true) && (
        <EditorSection title="Stats">
          <StatListEditor
            value={value.items ?? []}
            onChange={(items) => onChange({ ...value, items })}
          />
        </EditorSection>
      )}
    </div>
  )
}
