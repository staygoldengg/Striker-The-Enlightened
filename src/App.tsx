import { useState, useRef, useCallback } from 'react'
import './App.css'
import { FightingAI } from './ai/FightingAI'
import type { Prediction, HabitEntry, PatternEntry } from './ai/FightingAI'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { LogicalSize } from '@tauri-apps/api/dpi'
import { invoke } from '@tauri-apps/api/core'
import SimulationTab from './SimulationTab'
import FightTab from './FightTab'
import CaptureTab from './CaptureTab'
import StrategyTab from './StrategyTab'
import IntelTab from './IntelTab'
import Sidebar from './components/Sidebar'
import MacroEditor from './components/MacroEditor'
import GlossaryPanel from './components/GlossaryPanel'
import SettingsPanel from './components/SettingsPanel'
import type { AppTab, Macro, OcrRegion, WeaponTemplate } from './types'
import { LEGACY_API_BASE } from './config'
import { DEFAULT_MACROS, defaultMacro, DEFAULT_OCR_REGION, defaultScoutState, MOVE_GROUPS } from './data'

type MacroForm = Omit<Macro, 'id' | 'running'>

type ScoutState = {
  history: string[]
  predictions: Prediction[]
  habits: HabitEntry[]
  patterns: PatternEntry[]
  total: number
}

function App() {
  const [macros, setMacros] = useState<Macro[]>(DEFAULT_MACROS)
  const [selected, setSelected] = useState<Macro | null>(null)
  const [form, setForm] = useState<MacroForm>(defaultMacro)
  const [isEditing, setIsEditing] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const [aiKey, setAiKey] = useState(() => localStorage.getItem('bh_openai_key') ?? '')
  const [aiResult, setAiResult] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [tab, setTab] = useState<AppTab>('macros')
  const [glossaryFilter, setGlossaryFilter] = useState('')
  const scoutAI = useRef(new FightingAI())
  const [scout, setScout] = useState<ScoutState>(defaultScoutState)
  const [coachingMode, setCoachingMode] = useState(false)
  const [coachingCompact, setCoachingCompact] = useState(false)

  const [bhApiKey, setBhApiKey] = useState(() => localStorage.getItem('bh_api_key') ?? '')
  const [twitchClientId, setTwitchClientId] = useState(() => localStorage.getItem('twitch_client_id') ?? '')
  const [twitchClientSecret, setTwitchClientSecret] = useState(() => localStorage.getItem('twitch_client_secret') ?? '')
  const [ocrRegion, setOcrRegion] = useState<OcrRegion>(() => {
    try {
      return JSON.parse(localStorage.getItem('ocr_region') ?? '') as OcrRegion
    } catch {
      return DEFAULT_OCR_REGION
    }
  })
  const [settingsSaved, setSettingsSaved] = useState(false)

  async function saveAndPushSettings() {
    localStorage.setItem('bh_openai_key', aiKey)
    localStorage.setItem('bh_api_key', bhApiKey)
    localStorage.setItem('twitch_client_id', twitchClientId)
    localStorage.setItem('twitch_client_secret', twitchClientSecret)
    localStorage.setItem('ocr_region', JSON.stringify(ocrRegion))

    try {
      await fetch(`${LEGACY_API_BASE}/api/meta/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bh_api_key: bhApiKey,
          twitch_client_id: twitchClientId,
          twitch_client_secret: twitchClientSecret,
        }),
      })
      await fetch(`${LEGACY_API_BASE}/api/meta/ocr-region`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ocrRegion),
      })
    } catch {
      // Server may be offline — credentials are saved locally.
    }

    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 2500)
  }

  function selectMacro(macro: Macro) {
    setSelected(macro)
    setForm({
      name: macro.name,
      legend: macro.legend,
      weapon: macro.weapon,
      steps: macro.steps,
      aiPrompt: macro.aiPrompt,
    })
    setIsEditing(false)
  }

  function newMacro() {
    setSelected(null)
    setForm(defaultMacro)
    setIsEditing(true)
  }

  function loadTemplate(template: WeaponTemplate) {
    setForm(current => ({ ...current, name: template.name, steps: template.steps }))
  }

  function cancelEdit() {
    if (selected) {
      setForm({
        name: selected.name,
        legend: selected.legend,
        weapon: selected.weapon,
        steps: selected.steps,
        aiPrompt: selected.aiPrompt,
      })
    } else {
      setForm(defaultMacro)
    }
    setIsEditing(false)
  }

  function recordMove(move: string) {
    scoutAI.current.record(move)
    setScout({
      history: scoutAI.current.getHistory(),
      predictions: scoutAI.current.predict(),
      habits: scoutAI.current.getHabits(),
      patterns: scoutAI.current.getPatterns(),
      total: scoutAI.current.getTotal(),
    })
  }

  function resetScout() {
    scoutAI.current.reset()
    setScout(defaultScoutState)
  }

  const toggleCoachingMode = useCallback(async () => {
    const win = getCurrentWindow()
    if (!coachingMode) {
      await win.setAlwaysOnTop(true)
      await win.setSize(new LogicalSize(520, 160))
      await win.setResizable(false)
      setCoachingCompact(true)
      setCoachingMode(true)
      setTab('scout')
    } else {
      await win.setAlwaysOnTop(false)
      await win.setResizable(true)
      await win.setSize(new LogicalSize(1100, 700))
      setCoachingCompact(false)
      setCoachingMode(false)
    }
  }, [coachingMode])

  function saveMacro() {
    if (!form.name.trim()) {
      return
    }

    if (selected) {
      const updatedMacros = macros.map(item => item.id === selected.id ? { ...item, ...form } : item)
      setMacros(updatedMacros)
      setSelected({ ...selected, ...form })
    } else {
      const nextMacro: Macro = { id: Date.now(), ...form, running: false }
      setMacros(prev => [...prev, nextMacro])
      setSelected(nextMacro)
    }

    setIsEditing(false)
  }

  function deleteMacro(id: number) {
    setMacros(prev => prev.filter(macro => macro.id !== id))
    if (selected?.id === id) {
      setSelected(null)
      setIsEditing(false)
    }
  }

  async function runMacro(macro: Macro) {
    setMacros(prev => prev.map(item => item.id === macro.id ? { ...item, running: true } : item))
    const steps = macro.steps.split('\n').filter(Boolean)
    const ts = new Date().toLocaleTimeString()
    setLog(prev => [`[${ts}] Running "${macro.name}"...`, ...prev])

    try {
      await invoke('execute_macro', { steps })
      setLog(prev => [`[${ts}] "${macro.name}" finished.`, ...prev])
    } catch (error) {
      setLog(prev => [`[${ts}] Error: ${String(error)}`, ...prev])
    }

    setMacros(prev => prev.map(item => item.id === macro.id ? { ...item, running: false } : item))
  }

  async function askAI() {
    if (!form.aiPrompt.trim()) {
      return
    }
    setAiLoading(true)
    setAiResult('')

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${aiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an expert Brawlhalla combo and macro assistant with deep knowledge of the meta.
Move notation: NLight=neutral light, SLight=side light, DLight=down light, Nair=neutral aerial, Sair=side aerial, Dair=down aerial, Rec=recovery attack, GP=ground pound (hold S then N), NSig/SSig/DSig=signatures.
Keys: WASD=movement, N=light attack, M=heavy attack, Space=jump, S+N=ground pound, D+N=side light, S+M=ground slam.
Weapon tier (best to worst optimization): Gauntlets, Katars, Bow, Scythe, Blasters, Orb, Axe, Sword, Spear, Hammer, Lance, Cannon.
Known combos: Gauntlets: DLight>Dair>Rec, DLight>Nair>Rec. Katars: SLight>DLight>Dair, Dair>DLight>Rec. Bow: DLight>Sair, DLight>NLight>Rec. Scythe: aerial chains, NLight>Nair>Dair>GP. Blasters: DJFF Sair>NLight, NLight>Nair. Sword: Dair>GP (edge), NLight>Nair. Spear: SLight>SLight>DLight>DLight>Nair>Sair.
Output a macro as a list of steps (one per line): Press [KEY], Wait [MS]ms, Hold [KEY], Release [KEY]. Be precise with timing (typical step timing 50-120ms).`,
            },
            { role: 'user', content: form.aiPrompt },
          ],
          max_tokens: 300,
        }),
      })

      const data = await response.json()
      const text = data.choices?.[0]?.message?.content ?? 'No response.'
      setAiResult(text)
      setForm(current => ({ ...current, steps: text }))
    } catch {
      setAiResult('Error contacting AI. Check your API key.')
    }

    setAiLoading(false)
  }

  return (
    <div className={`app${coachingMode ? ' coaching-active' : ''}`}>
      {coachingCompact && (
        <div className="coaching-bar">
          <div className="coaching-bar-left">
            <span className="coaching-badge">🧠 LIVE</span>
            {scout.predictions.length > 0 ? (
              <>
                <span className="coaching-label">PREDICT</span>
                <span className="coaching-move">{scout.predictions[0].move}</span>
                <span className="coaching-conf">{scout.predictions[0].confidence}%</span>
                <span className="coaching-sep">│</span>
                <span className="coaching-counter">{scout.predictions[0].counter[0]}</span>
              </>
            ) : (
              <span className="coaching-idle">Recording… {scout.total} moves</span>
            )}
          </div>
          <div className="coaching-bar-right">
            {MOVE_GROUPS.map(group => group.moves.map(move => (
              <button
                key={move}
                type="button"
                className={`coaching-rec-btn scout-btn-${group.color}`}
                onClick={() => recordMove(move)}
              >
                {move}
              </button>
            )))}
            <button type="button" className="coaching-exit" onClick={toggleCoachingMode} title="Exit coaching mode">✕</button>
          </div>
        </div>
      )}

      <Sidebar
        tab={tab}
        setTab={setTab}
        macros={macros}
        selectedId={selected?.id ?? null}
        onMacroSelect={selectMacro}
        onNewMacro={newMacro}
        runMacro={runMacro}
        coachingCompact={coachingCompact}
      />

      <main className={`main${coachingCompact ? ' hidden' : ''}`}>
        {tab === 'macros' && (
          <MacroEditor
            selected={selected}
            isEditing={isEditing}
            form={form}
            setForm={setForm}
            saveMacro={saveMacro}
            deleteMacro={deleteMacro}
            runMacro={runMacro}
            setIsEditing={setIsEditing}
            cancelEdit={cancelEdit}
            newMacro={newMacro}
            loadTemplate={loadTemplate}
            askAI={askAI}
            aiResult={aiResult}
            aiLoading={aiLoading}
            log={log}
          />
        )}

        {tab === 'ai' && (
          <div className="ai-panel">
            <h2>🤖 AI Combo Generator</h2>
            <p>Describe a Brawlhalla combo or technique in plain English, and AI will generate the macro steps for you.</p>
            <textarea
              rows={4}
              className="ai-prompt-box"
              value={form.aiPrompt}
              onChange={e => setForm(current => ({ ...current, aiPrompt: e.target.value }))}
              placeholder="e.g. Katarina sword side-light into jump cancel nair, then recover with dodge"
            />
            <button type="button" className="btn btn-ai-lg" onClick={askAI} disabled={aiLoading || !aiKey}>
              {aiLoading ? 'Generating...' : '🤖 Generate Macro Steps'}
            </button>
            {!aiKey && <p className="ai-warning">⚠️ Add your OpenAI API key in Settings to use AI generation.</p>}
            {aiResult && (
              <div className="ai-result-lg">
                <div className="ai-result-header">Generated Steps:</div>
                <pre>{aiResult}</pre>
                <button type="button" className="btn btn-save" onClick={() => { setTab('macros'); setIsEditing(true) }}>
                  Use These Steps →
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <SettingsPanel
            aiKey={aiKey}
            setAiKey={setAiKey}
            bhApiKey={bhApiKey}
            setBhApiKey={setBhApiKey}
            twitchClientId={twitchClientId}
            setTwitchClientId={setTwitchClientId}
            twitchClientSecret={twitchClientSecret}
            setTwitchClientSecret={setTwitchClientSecret}
            ocrRegion={ocrRegion}
            setOcrRegion={setOcrRegion}
            settingsSaved={settingsSaved}
            saveAndPushSettings={saveAndPushSettings}
          />
        )}

        {tab === 'glossary' && (
          <GlossaryPanel glossaryFilter={glossaryFilter} setGlossaryFilter={setGlossaryFilter} />
        )}

        {tab === 'simulation' && <SimulationTab />}
        {tab === 'fight' && <FightTab />}
        {tab === 'capture' && <CaptureTab />}
        {tab === 'strategy' && <StrategyTab />}
        {tab === 'intel' && <IntelTab />}

        {tab === 'scout' && (
          <div className="scout-panel">
            <div className="scout-header">
              <div>
                <h2>🧠 Scout AI</h2>
                <p>Record your opponent's moves live. The AI learns their patterns and tells you what's coming next.</p>
              </div>
              <div className="scout-header-actions">
                <span className="scout-count">{scout.total} moves recorded</span>
                <button
                  type="button"
                  className={`btn ${coachingMode ? 'btn-coaching-on' : 'btn-coaching-off'}`}
                  onClick={toggleCoachingMode}
                  title="Shrinks to a tiny always-on-top bar so you can see it over your game"
                >
                  {coachingMode ? '🟢 Coaching ON' : '🎯 Coaching Mode'}
                </button>
                <button type="button" className="btn btn-delete" onClick={resetScout}>
                  ⟳ Reset
                </button>
              </div>
            </div>

            <div className="scout-body">
              <div className="scout-left">
                <div className="scout-input-section">
                  <div className="scout-section-title">🎮 Record Opponent Move</div>
                  <p className="scout-hint">Tap a button each time your opponent uses that move. Do it live during the match.</p>
                  {MOVE_GROUPS.map(group => (
                    <div key={group.label} className="scout-move-group">
                      <span className={`scout-group-label scout-group-${group.color}`}>{group.label}</span>
                      <div className="scout-move-btns">
                        {group.moves.map(move => (
                          <button
                            key={move}
                            type="button"
                            className={`scout-move-btn scout-btn-${group.color}`}
                            onClick={() => recordMove(move)}
                          >
                            {move}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {scout.history.length > 0 && (
                  <div className="scout-history">
                    <div className="scout-section-title">📜 Recent Moves (newest first)</div>
                    <div className="scout-history-list">
                      {scout.history.map((move, index) => (
                        <span key={index} className={`scout-history-pill scout-btn-${MOVE_GROUPS.find(group => group.moves.includes(move))?.color ?? 'tech'}`}>
                          {move}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="scout-right">
                <div className="scout-card">
                  <div className="scout-section-title">🎯 Next Move Predictions</div>
                  {scout.total < 5 ? (
                    <p className="scout-empty">Record at least 5 moves to see predictions.</p>
                  ) : scout.predictions.length === 0 ? (
                    <p className="scout-empty">Not enough sequence data yet — keep recording.</p>
                  ) : (
                    scout.predictions.map((prediction, index) => (
                      <div key={prediction.move} className="scout-prediction">
                        <div className="scout-pred-top">
                          <span className={`scout-pred-rank rank-${index}`}>{['1ST', '2ND', '3RD'][index]}</span>
                          <span className="scout-pred-move">{prediction.move}</span>
                          <span className="scout-pred-conf">{prediction.confidence}%</span>
                        </div>
                        <div className="scout-conf-bar">
                          <div className="scout-conf-fill" style={{ width: `${prediction.confidence}%`, opacity: 1 - index * 0.2 }} />
                        </div>
                        <div className="scout-counters">
                          {prediction.counter.map(counter => <span key={counter} className="scout-counter-chip">{counter}</span>)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {scout.habits.length > 0 && (
                  <div className="scout-card">
                    <div className="scout-section-title">📊 Habit Profile</div>
                    {scout.habits.slice(0, 8).map(habit => (
                      <div key={habit.move} className="scout-habit-row">
                        <span className="scout-habit-move">{habit.move}</span>
                        <div className="scout-habit-bar-bg">
                          <div className="scout-habit-bar-fill" style={{ width: `${habit.pct}%` }} />
                        </div>
                        <span className="scout-habit-pct">{habit.pct}%</span>
                        <span className="scout-habit-count">×{habit.count}</span>
                      </div>
                    ))}
                  </div>
                )}

                {scout.patterns.length > 0 && (
                  <div className="scout-card">
                    <div className="scout-section-title">🔗 Detected Patterns</div>
                    <p className="scout-hint">Sequences your opponent repeats — anticipate the second move.</p>
                    {scout.patterns.map(pattern => (
                      <div key={`${pattern.from}-${pattern.to}`} className="scout-pattern-row">
                        <span className="scout-pattern-chain">
                          <span className="scout-pattern-from">{pattern.from}</span>
                          <span className="scout-pattern-arrow">→</span>
                          <span className="scout-pattern-to">{pattern.to}</span>
                        </span>
                        <span className="scout-pattern-meta">{pattern.pct}% of the time · ×{pattern.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
