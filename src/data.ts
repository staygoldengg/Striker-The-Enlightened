import type { GlossaryEntry, Macro, MoveGroup, OcrRegion, ScoutState, WeaponTemplate } from './types'

export const LEGENDS = [
  'Any Legend', 'Ada', 'Arcadia', 'Artemis', 'Asuri', 'Azoth',
  'Barraza', 'Bodvar', 'Brynn', 'Caspian', 'Cassidy', 'Cross',
  'Diana', 'Ember', 'Fait', 'Gnash', 'Hattori', 'Isaiah',
  'Jaeyun', 'Jhala', 'Jiro', 'Katarina', 'Kaya', 'Koji',
  'Kor', 'Lin Fei', 'Lucien', 'Magyar', 'Mako', 'Mirage',
  'Mordex', 'Nix', 'Onyx', 'Orion', 'Petra', 'Queen Nai',
  'Ragnir', 'Rayman', 'Reno', 'Scarlet', 'Sentinel', 'Sidra',
  'Sir Roland', 'TarTar', 'Teros', 'Thatch', 'Thor', 'Ulgrim',
  'Val', 'Vector', 'Volkov', 'Wu Shang', 'Xull', 'Yumiko', 'Zariel',
]

export const WEAPONS = [
  'Any Weapon', 'Gauntlets', 'Katars', 'Bow', 'Scythe',
  'Blasters', 'Orb', 'Axe', 'Sword', 'Spear',
  'Hammer', 'Lance', 'Cannon', 'Greatsword', 'Boots',
]

export const WEAPON_TEMPLATES: Record<string, WeaponTemplate[]> = {
  Gauntlets: [
    { name: 'DLight → Dair → Rec', notation: 'DLight > Dair > Rec', steps: 'Press S+N\nWait 60ms\nPress Space+S+N\nWait 80ms\nPress M' },
    { name: 'DLight → Nair → Rec', notation: 'DLight > Nair > Rec (0–110%)', steps: 'Press S+N\nWait 60ms\nPress Space+N\nWait 80ms\nPress M' },
    { name: 'DLight → Sair → GC SLight → Rec', notation: 'DLight > Sair > GC SLight > Rec (110%+)', steps: 'Press S+N\nWait 60ms\nPress Space+D+N\nWait 80ms\nPress D+N\nWait 50ms\nPress M' },
  ],
  Katars: [
    { name: 'Dair → DLight → Rec', notation: 'Dair > DLight > Rec', steps: 'Press Space+S+N\nWait 80ms\nPress S+N\nWait 60ms\nPress M' },
    { name: 'SLight → DLight → Dair', notation: 'SLight > DLight > Dair', steps: 'Press D+N\nWait 60ms\nPress S+N\nWait 60ms\nPress Space+S+N' },
    { name: 'DLight → Dair → DLight → Rec → Rec', notation: 'DLight > Dair > DLight > Rec > Rec', steps: 'Press S+N\nWait 60ms\nPress Space+S+N\nWait 80ms\nPress S+N\nWait 60ms\nPress M\nWait 60ms\nPress M' },
    { name: 'Nair → DLight → Nair (loop)', notation: 'Nair > DLight > Nair (low risk loop)', steps: 'Press Space+N\nWait 80ms\nPress S+N\nWait 60ms\nPress Space+N' },
    { name: 'SLight → Dair → NLight → Rec', notation: 'SLight > Dair > NLight > Rec', steps: 'Press D+N\nWait 60ms\nPress Space+S+N\nWait 80ms\nPress N\nWait 60ms\nPress M' },
  ],
  Bow: [
    { name: 'DLight → Sair', notation: 'DLight > Sair', steps: 'Press S+N\nWait 70ms\nPress Space+D+N' },
    { name: 'SLight → DLight → DAir', notation: 'SLight > DLight > DAir', steps: 'Press D+N\nWait 60ms\nPress S+N\nWait 60ms\nPress Space+S+N' },
    { name: 'DLight → NLight → Rec', notation: 'DLight > NLight > Rec/Nair', steps: 'Press S+N\nWait 70ms\nPress N\nWait 70ms\nPress M' },
  ],
  Scythe: [
    { name: 'NLight → Nair → Dair → GP', notation: 'NLight > Nair > Dair > GP', steps: 'Press N\nWait 60ms\nPress Space+N\nWait 80ms\nPress Space+S+N\nWait 80ms\nPress S+N' },
    { name: 'Sair → Dair → Rec', notation: 'Sair > Dair > Rec', steps: 'Press Space+D+N\nWait 80ms\nPress Space+S+N\nWait 80ms\nPress M' },
    { name: 'SLight → Nair → Dair → GP', notation: 'SLight > Nair > Dair > GP', steps: 'Press D+N\nWait 60ms\nPress Space+N\nWait 80ms\nPress Space+S+N\nWait 80ms\nPress S+N' },
    { name: 'DLight → Nair → GP (B-Dair)', notation: 'DLight > Nair > GP (offstage B-Dair)', steps: 'Press S+N\nWait 60ms\nPress Space+N\nWait 80ms\nPress S+N' },
    { name: 'A-SLight → SLight → Nair', notation: 'A-SLight > SLight > Nair (grounded)', steps: 'Press D\nWait 10ms\nPress N\nWait 60ms\nPress D+N\nWait 60ms\nPress Space+N' },
  ],
  Blasters: [
    { name: 'DJFF Sair → NLight', notation: 'DJFF Sair > NLight', steps: 'Press Space\nWait 30ms\nPress Space\nWait 30ms\nPress S\nWait 30ms\nPress D+N\nWait 80ms\nPress N' },
    { name: 'NLight → X-Pivot Nair', notation: 'NLight > X-Pivot Nair', steps: 'Press N\nWait 60ms\nPress A\nWait 20ms\nPress Space+N' },
    { name: 'Sair → GC DLight', notation: 'Sair > GC DLight (gravity cancel)', steps: 'Press Space+D+N\nWait 60ms\nPress Space\nWait 20ms\nPress S+N' },
    { name: 'Dair → Sair → CD DLight', notation: 'Dair > Sair > CD DLight', steps: 'Press Space+S+N\nWait 80ms\nPress Space+D+N\nWait 70ms\nPress S+N' },
    { name: 'Dash Jump Sair → Nair', notation: 'Dash Jump SLight > Nair', steps: 'Press D\nWait 20ms\nPress Space\nWait 30ms\nPress D+N\nWait 70ms\nPress Space+N' },
  ],
  Orb: [
    { name: 'SLight → Sair', notation: 'SLight > Sair', steps: 'Press D+N\nWait 60ms\nPress Space+D+N' },
    { name: 'Dair → SLight → DLight → Nair → Rec', notation: 'Dair > SLight > DLight > Nair > Rec', steps: 'Press Space+S+N\nWait 80ms\nPress D+N\nWait 60ms\nPress S+N\nWait 60ms\nPress Space+N\nWait 80ms\nPress M' },
    { name: 'SLight → NLight', notation: 'SLight > NLight (low %)', steps: 'Press D+N\nWait 60ms\nPress N' },
  ],
  Axe: [
    { name: 'SLight → Nair → Dair', notation: 'SLight > Nair > Dair', steps: 'Press D+N\nWait 70ms\nPress Space+N\nWait 80ms\nPress Space+S+N' },
    { name: 'SLight → Nair → Rec', notation: 'SLight > Nair > Rec', steps: 'Press D+N\nWait 70ms\nPress Space+N\nWait 80ms\nPress M' },
    { name: 'Dair Spike', notation: 'Offstage Dair Spike', steps: 'Press Space\nWait 50ms\nPress Space+S+N' },
  ],
  Sword: [
    { name: 'Dair → GP', notation: 'Dair > GP (edge kill)', steps: 'Press Space+S+N\nWait 80ms\nPress S+N' },
    { name: 'NLight → Nair', notation: 'NLight > Nair', steps: 'Press N\nWait 60ms\nPress Space+N' },
    { name: 'DLight → Nair', notation: 'DLight > Nair', steps: 'Press S+N\nWait 60ms\nPress Space+N' },
  ],
  Spear: [
    { name: 'SLight Chain', notation: 'SLight > SLight > DLight > DLight > Nair > Sair', steps: 'Press D+N\nWait 60ms\nPress D+N\nWait 60ms\nPress S+N\nWait 60ms\nPress S+N\nWait 60ms\nPress Space+N\nWait 80ms\nPress Space+D+N' },
    { name: 'NLight Poke', notation: 'NLight (low startup poke)', steps: 'Press N\nWait 60ms\nPress N' },
  ],
  Hammer: [
    { name: 'DLight → Nair', notation: 'DLight > Nair', steps: 'Press S+N\nWait 70ms\nPress Space+N' },
    { name: 'SLight → Nair → GP', notation: 'SLight > Nair > GP', steps: 'Press D+N\nWait 70ms\nPress Space+N\nWait 80ms\nPress S+N' },
    { name: 'Rec Gimp', notation: 'Offstage Rec gimp', steps: 'Press Space\nWait 50ms\nPress M' },
  ],
  Lance: [
    { name: 'SLight → Dair', notation: 'SLight > Dair', steps: 'Press D+N\nWait 70ms\nPress Space+S+N' },
    { name: 'DJFF Sair → NLight', notation: 'DJFF Sair > NLight', steps: 'Press Space\nWait 30ms\nPress Space\nWait 30ms\nPress S\nWait 30ms\nPress D+N\nWait 80ms\nPress N' },
  ],
  Cannon: [
    { name: 'GP → Dair', notation: 'GP > Dair', steps: 'Press S+N\nWait 80ms\nPress Space+S+N' },
    { name: 'Rec Recovery', notation: 'Rec (safe return)', steps: 'Press Space\nWait 40ms\nPress M' },
    { name: 'SLight → Nair → GP', notation: 'SLight > Nair > GP', steps: 'Press D+N\nWait 70ms\nPress Space+N\nWait 80ms\nPress S+N' },
  ],
  Greatsword: [
    { name: 'NLight → Nair', notation: 'NLight > Nair', steps: 'Press N\nWait 70ms\nPress Space+N' },
    { name: 'DLight → GP', notation: 'DLight > GP (slow but powerful)', steps: 'Press S+N\nWait 80ms\nPress S+N' },
    { name: 'SLight → Nair → Rec', notation: 'SLight > Nair > Rec', steps: 'Press D+N\nWait 80ms\nPress Space+N\nWait 90ms\nPress M' },
  ],
  Boots: [
    { name: 'SLight → Nair → Sair', notation: 'SLight > Nair > Sair', steps: 'Press D+N\nWait 60ms\nPress Space+N\nWait 70ms\nPress Space+D+N' },
    { name: 'DLight → Nair → Rec', notation: 'DLight > Nair > Rec', steps: 'Press S+N\nWait 60ms\nPress Space+N\nWait 80ms\nPress M' },
    { name: 'Sair → DLight → Nair', notation: 'Sair > DLight > Nair', steps: 'Press Space+D+N\nWait 70ms\nPress S+N\nWait 60ms\nPress Space+N' },
  ],
}

export const GLOSSARY: GlossaryEntry[] = [
  { term: 'NLight', def: 'Neutral light attack (jab) — fast, low startup poke' },
  { term: 'SLight', def: 'Side light attack — good string starter' },
  { term: 'DLight', def: 'Down light attack — common combo opener' },
  { term: 'Nair', def: 'Neutral aerial attack' },
  { term: 'Sair', def: 'Side aerial attack — great for edge carries' },
  { term: 'Dair', def: 'Down aerial attack — spike/offstage tool' },
  { term: 'Rec', def: 'Recovery attack — used for combos AND recovering' },
  { term: 'GP', def: 'Ground Pound — hold Down then light (S+N)' },
  { term: 'NSig', def: 'Neutral heavy/signature — high risk, high reward' },
  { term: 'SSig', def: 'Side heavy/signature' },
  { term: 'DSig', def: 'Down heavy/signature' },
  { term: 'DJFF', def: 'Dash Jump Fast Fall — for aerial approach' },
  { term: 'PC', def: 'Platform Cancel — land on platform to cancel aerial' },
  { term: 'WT', def: 'Weapon Throw — throw weapon for pressure/combos' },
  { term: 'Neutral', def: 'Neither player has positional advantage' },
  { term: 'Advantage', def: 'You have more options than your opponent' },
  { term: 'Disadvantage', def: 'Opponent has more options; you need to escape' },
  { term: 'Footsies', def: 'Spacing game — controlling empty space between you and your opponent' },
  { term: 'Hit Confirm', def: 'Safe move that leads to full combo on hit, safe on miss' },
  { term: 'Gimp', def: 'Interrupt or stop an opponent\'s recovery offstage' },
  { term: 'Overtuned', def: 'Weapon with little to no weaknesses' },
  { term: 'Undertuned', def: 'Weapon with little serviceable strengths' },
  { term: 'Hitbox', def: 'The area of effect of an attack' },
  { term: 'Hurtbox', def: 'The area on your character that gets hit' },
  { term: 'Startup Frames', def: 'Frames before a move becomes active (lower = faster)' },
  { term: 'Recovery Frames', def: 'Frames you\'re locked in after an attack' },
  { term: 'Priority', def: 'A move wins because of larger hitbox or fewer startup frames' },
  { term: 'GC', def: 'Gravity Cancel — land on a platform mid-aerial to cancel recovery frames and act sooner' },
  { term: 'CD / cDodge', def: 'Chase Dodge — dodge forward to chase the opponent and extend combos' },
  { term: 'X-Pivot', def: 'Tap opposite direction just before attacking to reverse the move\'s direction without losing momentum' },
  { term: 'Chunking', def: 'Consistently landing safe moves to build up % advantage over time' },
  { term: 'Blindspot', def: 'A position your opponent\'s attacks don\'t reach — exploit it to approach safely' },
  { term: 'Space Management', def: 'Actively controlling the space between you and your opponent to force favorable exchanges' },
  { term: 'Safe (neutral)', def: 'Less likely to land, but also less likely to be punished — prolongs neutral' },
  { term: 'Coverage', def: 'More likely to land a hit, but more likely to be punished if it misses — breaks neutral' },
  { term: 'Engaging', def: 'Pressing forward in neutral to force an interaction with your opponent' },
  { term: 'Disengage', def: 'Retreating from disadvantage or bad position to reset to neutral' },
  { term: 'PICKUP', def: 'Picking up a weapon from the ground' },
]

export const MOVE_GROUPS: MoveGroup[] = [
  { label: 'Lights', color: 'light', moves: ['NLight', 'SLight', 'DLight'] },
  { label: 'Aerials', color: 'air', moves: ['Nair', 'Sair', 'Dair'] },
  { label: 'Special', color: 'special', moves: ['Rec', 'GP', 'WT'] },
  { label: 'Sigs', color: 'sig', moves: ['NSig', 'SSig', 'DSig'] },
  { label: 'Tech', color: 'tech', moves: ['DJFF', 'GC', 'CD', 'X-Pivot'] },
]

export const defaultMacro: Omit<Macro, 'id' | 'running'> = {
  name: '',
  legend: 'Any Legend',
  weapon: 'Any Weapon',
  steps: '',
  aiPrompt: '',
}

export const defaultScoutState: ScoutState = { history: [], predictions: [], habits: [], patterns: [], total: 0 }

export const DEFAULT_MACROS: Macro[] = [
  {
    id: 1,
    name: 'Katars — Safe Loop',
    legend: 'Asuri',
    weapon: 'Katars',
    steps: 'Press Space+N\nWait 80ms\nPress S+N\nWait 60ms\nPress Space+N',
    aiPrompt: '',
    running: false,
  },
  {
    id: 2,
    name: 'Gauntlets — DLight Combo',
    legend: 'Any Legend',
    weapon: 'Gauntlets',
    steps: 'Press S+N\nWait 60ms\nPress Space+N\nWait 80ms\nPress M',
    aiPrompt: '',
    running: false,
  },
  {
    id: 3,
    name: 'Sword — Dair Spike',
    legend: 'Bodvar',
    weapon: 'Sword',
    steps: 'Press Space\nWait 50ms\nPress S+N\nWait 80ms\nPress S+N',
    aiPrompt: '',
    running: false,
  },
  {
    id: 4,
    name: 'Scythe — Nair Chase',
    legend: 'Ember',
    weapon: 'Scythe',
    steps: 'Press N\nWait 60ms\nPress Space+N\nWait 80ms\nPress Space+S+N\nWait 80ms\nPress S+N',
    aiPrompt: '',
    running: false,
  },
]

export const DEFAULT_OCR_REGION: OcrRegion = {
  top: 400,
  left: 1500,
  width: 300,
  height: 400,
}
