import type { Prediction, HabitEntry, PatternEntry } from './ai/FightingAI'

export type AppTab =
  | 'macros'
  | 'ai'
  | 'glossary'
  | 'scout'
  | 'settings'
  | 'simulation'
  | 'fight'
  | 'capture'
  | 'strategy'
  | 'intel'

export type Macro = {
  id: number
  name: string
  legend: string
  weapon: string
  steps: string
  aiPrompt: string
  running: boolean
}

export type WeaponTemplate = {
  name: string
  notation: string
  steps: string
}

export type GlossaryEntry = {
  term: string
  def: string
}

export type MoveGroup = {
  label: string
  color: string
  moves: readonly string[]
}

export type OcrRegion = {
  top: number
  left: number
  width: number
  height: number
}

export type ScoutState = {
  history: string[]
  predictions: Prediction[]
  habits: HabitEntry[]
  patterns: PatternEntry[]
  total: number
}

export type { Prediction, HabitEntry, PatternEntry } from './ai/FightingAI'
