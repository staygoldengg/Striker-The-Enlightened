import type { Dispatch, SetStateAction } from 'react'
import { LEGENDS, WEAPONS, WEAPON_TEMPLATES } from '../data'
import type { Macro, WeaponTemplate } from '../types'

type MacroEditorProps = {
  selected: Macro | null
  isEditing: boolean
  form: Omit<Macro, 'id' | 'running'>
  setForm: Dispatch<SetStateAction<Omit<Macro, 'id' | 'running'>>> 
  saveMacro: () => void
  deleteMacro: (id: number) => void
  runMacro: (macro: Macro) => Promise<void>
  setIsEditing: (enabled: boolean) => void
  cancelEdit: () => void
  newMacro: () => void
  loadTemplate: (template: WeaponTemplate) => void
  askAI: () => Promise<void>
  aiResult: string
  aiLoading: boolean
  log: string[]
}

export default function MacroEditor({
  selected,
  isEditing,
  form,
  setForm,
  saveMacro,
  deleteMacro,
  runMacro,
  setIsEditing,
  cancelEdit,
  newMacro,
  loadTemplate,
  askAI,
  aiResult,
  aiLoading,
  log,
}: MacroEditorProps) {
  return (
    <>
      {(selected || isEditing) ? (
        <div className="editor">
          <div className="editor-header">
            <h2>{isEditing ? (selected ? 'Edit Combo' : 'New Combo') : selected?.name}</h2>
            <div className="editor-actions">
              {!isEditing && selected && (
                <>
                  <button type="button" className="btn btn-run" disabled={selected.running} onClick={() => void runMacro(selected)}>
                    {selected.running ? '⏳ Running...' : '▶ Run'}
                  </button>
                  <button type="button" className="btn btn-edit" onClick={() => setIsEditing(true)}>
                    ✏️ Edit
                  </button>
                  <button type="button" className="btn btn-delete" onClick={() => deleteMacro(selected.id)}>
                    🗑 Delete
                  </button>
                </>
              )}
              {isEditing && (
                <>
                  <button type="button" className="btn btn-save" onClick={saveMacro}>
                    💾 Save
                  </button>
                  <button type="button" className="btn btn-cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="form">
              <label>Combo Name
                <input
                  value={form.name}
                  onChange={e => setForm(current => ({ ...current, name: e.target.value }))}
                  placeholder="e.g. Scythe Edge Carry"
                />
              </label>
              <div className="form-row">
                <label>Legend
                  <select
                    value={form.legend}
                    onChange={e => setForm(current => ({ ...current, legend: e.target.value }))}
                    className="legend-select"
                  >
                    {LEGENDS.map(legend => <option key={legend} value={legend}>{legend}</option>)}
                  </select>
                </label>
                <label>Weapon
                  <select
                    value={form.weapon}
                    onChange={e => setForm(current => ({ ...current, weapon: e.target.value }))}
                    className="legend-select"
                  >
                    {WEAPONS.map(weapon => <option key={weapon} value={weapon}>{weapon}</option>)}
                  </select>
                </label>
              </div>

              {form.weapon !== 'Any Weapon' && WEAPON_TEMPLATES[form.weapon] && (
                <div className="template-section">
                  <span className="template-label">Quick Templates — {form.weapon}</span>
                  <div className="template-list">
                    {WEAPON_TEMPLATES[form.weapon].map(template => (
                      <button
                        key={template.name}
                        type="button"
                        className="template-btn"
                        title={template.notation}
                        onClick={() => loadTemplate(template)}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label>Steps (one per line)
                <textarea
                  rows={8}
                  value={form.steps}
                  onChange={e => setForm(current => ({ ...current, steps: e.target.value }))}
                  placeholder={"Press N\nWait 50ms\nPress Space\nWait 80ms\nPress N"}
                />
              </label>
              <label>AI Prompt (optional)
                <div className="ai-row">
                  <input
                    value={form.aiPrompt}
                    onChange={e => setForm(current => ({ ...current, aiPrompt: e.target.value }))}
                    placeholder="e.g. Katarina sword down-light into nair chase combo..."
                  />
                  <button type="button" className="btn btn-ai" onClick={askAI} disabled={aiLoading || !form.aiPrompt.trim()}>
                    {aiLoading ? '...' : '🤖 Generate'}
                  </button>
                </div>
                {aiResult && <div className="ai-result">{aiResult}</div>}
              </label>
            </div>
          ) : (
            <div className="macro-detail">
              <div className="detail-badges">
                <span className="legend-badge">{selected?.legend || '—'}</span>
                {selected?.weapon && selected.weapon !== 'Any Weapon' && <span className="weapon-badge">{selected.weapon}</span>}
              </div>
              {selected?.weapon && selected.weapon !== 'Any Weapon' && WEAPON_TEMPLATES[selected.weapon] && (
                <div className="detail-notation">
                  <span className="template-label">Notation Reference</span>
                  <div className="template-list">
                    {WEAPON_TEMPLATES[selected.weapon].map(template => (
                      <span key={template.name} className="notation-chip" title={template.steps}>
                        {template.notation}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="detail-row"><span className="detail-label">Steps</span></div>
              <pre className="steps-preview">{selected?.steps}</pre>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">⚔️</div>
          <h2>Select a combo or create a new one</h2>
          <p>Use the sidebar to select a combo, or click <strong>+ New Combo</strong> to get started.</p>
          <div className="keybind-ref">
            <div className="keybind-title">Default Keybinds</div>
            <div className="keybind-grid">
              <span className="key">N</span><span>Light Attack</span>
              <span className="key">M</span><span>Heavy Attack</span>
              <span className="key">Space</span><span>Jump</span>
              <span className="key">S+N</span><span>Ground Pound</span>
              <span className="key">S+M</span><span>Ground Slam</span>
              <span className="key">WASD</span><span>Movement</span>
            </div>
          </div>
          <button type="button" className="btn btn-new-lg" onClick={newMacro}>
            + New Combo
          </button>
        </div>
      )}

      <div className="log-panel">
        <div className="log-header">📋 Run Log</div>
        <div className="log-body">
          {log.length === 0 ? (
            <span className="log-empty">No activity yet.</span>
          ) : (
            log.map((entry, index) => (
              <div key={index} className="log-line">{entry}</div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
