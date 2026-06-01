import type { Dispatch, SetStateAction } from 'react'
import type { OcrRegion } from '../types'

type SettingsPanelProps = {
  aiKey: string
  setAiKey: Dispatch<SetStateAction<string>>
  bhApiKey: string
  setBhApiKey: Dispatch<SetStateAction<string>>
  twitchClientId: string
  setTwitchClientId: Dispatch<SetStateAction<string>>
  twitchClientSecret: string
  setTwitchClientSecret: Dispatch<SetStateAction<string>>
  ocrRegion: OcrRegion
  setOcrRegion: Dispatch<SetStateAction<OcrRegion>>
  settingsSaved: boolean
  saveAndPushSettings: () => Promise<void>
}

export default function SettingsPanel({
  aiKey,
  setAiKey,
  bhApiKey,
  setBhApiKey,
  twitchClientId,
  setTwitchClientId,
  twitchClientSecret,
  setTwitchClientSecret,
  ocrRegion,
  setOcrRegion,
  settingsSaved,
  saveAndPushSettings,
}: SettingsPanelProps) {
  return (
    <div className="settings-panel">
      <h2>⚙️ Settings</h2>

      <div className="settings-section">
        <div className="settings-section-title">🤖 AI Combo Generator</div>
        <label>OpenAI API Key
          <input
            type="password"
            value={aiKey}
            onChange={e => setAiKey(e.target.value)}
            placeholder="sk-..."
          />
        </label>
        <p className="settings-note">Used only for AI combo generation. Stored locally — never persisted to server.</p>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">📊 Brawlhalla Rankings API</div>
        <p className="settings-note" style={{ marginBottom: 10 }}>
          Get a free key at <span className="settings-link">dev.brawlhalla.com</span>. Used to pull live weapon trends from ranked data.
        </p>
        <label>BH API Key
          <input
            type="password"
            value={bhApiKey}
            onChange={e => setBhApiKey(e.target.value)}
            placeholder="e.g. abc123..."
          />
        </label>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">🎮 Twitch Helix API</div>
        <p className="settings-note" style={{ marginBottom: 10 }}>
          Register an app at <span className="settings-link">dev.twitch.tv</span>. Used to detect live tournament viewership and adjust accuracy multipliers.
        </p>
        <label>Twitch Client ID
          <input
            value={twitchClientId}
            onChange={e => setTwitchClientId(e.target.value)}
            placeholder="e.g. abc123xyz..."
          />
        </label>
        <label>Twitch Client Secret
          <input
            type="password"
            value={twitchClientSecret}
            onChange={e => setTwitchClientSecret(e.target.value)}
            placeholder="e.g. secret..."
          />
        </label>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">🔍 Twitch Extension OCR Region</div>
        <p className="settings-note" style={{ marginBottom: 10 }}>
          Screen region (pixels) where the Twitch extension overlay is rendered on your monitor.
        </p>
        <div className="settings-grid-4">
          <label>Top<input type="number" value={ocrRegion.top} onChange={e => setOcrRegion(current => ({ ...current, top: +e.target.value }))} className="bp-input" /></label>
          <label>Left<input type="number" value={ocrRegion.left} onChange={e => setOcrRegion(current => ({ ...current, left: +e.target.value }))} className="bp-input" /></label>
          <label>Width<input type="number" value={ocrRegion.width} onChange={e => setOcrRegion(current => ({ ...current, width: +e.target.value }))} className="bp-input" /></label>
          <label>Height<input type="number" value={ocrRegion.height} onChange={e => setOcrRegion(current => ({ ...current, height: +e.target.value }))} className="bp-input" /></label>
        </div>
      </div>

      <div className="settings-save-row">
        <button type="button" className="btn btn-save" onClick={saveAndPushSettings}>
          💾 Save & Push to Server
        </button>
        {settingsSaved && <span className="settings-saved-badge">✓ Saved</span>}
      </div>
      <p className="settings-note">
        API keys are stored in localStorage and never transmitted outside your machine except to the configured API endpoints.
      </p>
    </div>
  )
}
