import type { AppTab, Macro } from '../types'
import BackendBridge from '../BackendBridge'

type SidebarProps = {
  tab: AppTab
  setTab: (tab: AppTab) => void
  macros: Macro[]
  selectedId: number | null
  onMacroSelect: (macro: Macro) => void
  onNewMacro: () => void
  runMacro: (macro: Macro) => Promise<void>
  coachingCompact: boolean
}

export default function Sidebar({
  tab,
  setTab,
  macros,
  selectedId,
  onMacroSelect,
  onNewMacro,
  runMacro,
  coachingCompact,
}: SidebarProps) {
  return (
    <aside className={`sidebar${coachingCompact ? ' hidden' : ''}`}>
      <div className="sidebar-header">
        <span className="logo-icon">⚔</span>
        <span className="logo-text">BH · Macro Suite</span>
      </div>

      <BackendBridge />

      <nav className="sidebar-nav">
        <button type="button" className={tab === 'macros' ? 'nav-btn active' : 'nav-btn'} onClick={() => setTab('macros')}>
          ⚡ Combos
        </button>
        <button type="button" className={tab === 'ai' ? 'nav-btn active' : 'nav-btn'} onClick={() => setTab('ai')}>
          🤖 AI Generate
        </button>
        <button type="button" className={tab === 'glossary' ? 'nav-btn active' : 'nav-btn'} onClick={() => setTab('glossary')}>
          📖 Glossary
        </button>
        <button type="button" className={tab === 'scout' ? 'nav-btn active' : 'nav-btn'} onClick={() => setTab('scout')}>
          🧠 Scout AI
        </button>
        <button type="button" className={tab === 'settings' ? 'nav-btn active' : 'nav-btn'} onClick={() => setTab('settings')}>
          ⚙️ Settings
        </button>
        <button type="button" className={tab === 'simulation' ? 'nav-btn active' : 'nav-btn'} onClick={() => setTab('simulation')}>
          🎮 Simulation
        </button>
        <div className="nav-divider" />
        <button type="button" className={tab === 'fight' ? 'nav-btn active' : 'nav-btn'} onClick={() => setTab('fight')}>
          ⚔️ Fight Engine
        </button>
        <button type="button" className={tab === 'capture' ? 'nav-btn active' : 'nav-btn'} onClick={() => setTab('capture')}>
          📷 Capture
        </button>
        <button type="button" className={tab === 'strategy' ? 'nav-btn active' : 'nav-btn'} onClick={() => setTab('strategy')}>
          🧬 Strategy AI
        </button>
        <button type="button" className={tab === 'intel' ? 'nav-btn active' : 'nav-btn'} onClick={() => setTab('intel')}>
          🧠 Intel Hub
        </button>
      </nav>

      <div className="macro-list">
        {macros.map(m => (
          <div
            key={m.id}
            className={`macro-item${selectedId === m.id ? ' selected' : ''}`}
            onClick={() => onMacroSelect(m)}
          >
            <div className="macro-item-top">
              <span className="macro-name">{m.name}</span>
              <button
                type="button"
                className={`macro-run-btn${m.running ? ' running' : ''}`}
                disabled={m.running}
                title="Run macro"
                onClick={e => {
                  e.stopPropagation()
                  void runMacro(m)
                }}
              >
                {m.running ? '⏳' : '▶'}
              </button>
            </div>
            <div className="macro-meta">
              <span className="macro-game">{m.legend}</span>
              {m.weapon && m.weapon !== 'Any Weapon' && <span className="weapon-tag">{m.weapon}</span>}
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="btn-new" onClick={onNewMacro}>
        + New Combo
      </button>
    </aside>
  )
}
