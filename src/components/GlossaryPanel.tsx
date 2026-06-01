import { useMemo } from 'react'
import { GLOSSARY } from '../data'

type GlossaryPanelProps = {
  glossaryFilter: string
  setGlossaryFilter: (value: string) => void
}

export default function GlossaryPanel({ glossaryFilter, setGlossaryFilter }: GlossaryPanelProps) {
  const filteredGlossary = useMemo(
    () => GLOSSARY.filter(entry =>
      !glossaryFilter ||
      entry.term.toLowerCase().includes(glossaryFilter.toLowerCase()) ||
      entry.def.toLowerCase().includes(glossaryFilter.toLowerCase())
    ),
    [glossaryFilter],
  )

  return (
    <div className="glossary-panel">
      <div className="glossary-header">
        <h2>📖 Move Glossary</h2>
        <p>Brawlhalla notation and strategic concepts from the COSMIC M.E.T.A guide.</p>
        <input
          className="glossary-search"
          placeholder="🔍 Search terms…"
          value={glossaryFilter}
          onChange={e => setGlossaryFilter(e.target.value)}
        />
      </div>

      <div className="glossary-grid">
        {filteredGlossary.map(item => (
          <div key={item.term} className="glossary-card">
            <span className="glossary-term">{item.term}</span>
            <span className="glossary-def">{item.def}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
