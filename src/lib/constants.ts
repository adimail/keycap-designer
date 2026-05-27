/**
 * Global constants for keycap-designer
 * Centralized configuration values extracted from components and stores
 */

// ============================================================================
// KEYCAP PROFILES
// ============================================================================

export const KEYCAP_PROFILES = {
  SA: 'SA',
  DSA: 'DSA',
  OEM: 'OEM',
  CHERRY: 'Cherry',
  KAT: 'KAT',
  TOPRE: 'Topre',
  SCULPTED: 'Sculpted',
  FLAT: 'Flat',
} as const

// ============================================================================
// KEYCAP FINISHES
// ============================================================================

export const KEYCAP_FINISHES = {
  ABS_SMOOTH: 'ABS Smooth',
  ABS_TEXTURED: 'ABS Textured',
  PBT_SMOOTH: 'PBT Smooth',
  PBT_TEXTURED: 'PBT Textured',
  DYESUBBED: 'Dyesubbed',
} as const

// ============================================================================
// KEYBOARD LAYOUTS
// ============================================================================

export const KEYBOARD_LAYOUTS = {
  LAYOUT_60: '60%',
  LAYOUT_65: '65%',
  LAYOUT_75: '75%',
  LAYOUT_TKL_80: 'TKL 80%',
  LAYOUT_96: '96%',
  LAYOUT_100: '100%',
} as const

export const LAYOUT_LABELS = [
  { label: '60%', value: '60%' },
  { label: '65%', value: '65%' },
  { label: '75%', value: '75%' },
  { label: 'TKL 80%', value: '80%' },
  { label: '96%', value: '96%' },
  { label: '100%', value: '100%' },
] as const

// ============================================================================
// COLORS & STYLING
// ============================================================================

export const DEFAULT_COLORS = {
  KEY_DEFAULT: '#2a3a3e',
  LABEL_DEFAULT: '#ffffff',
  LABEL_BG_DEFAULT: 'transparent',
} as const

export const EDITOR_FONTS = [
  'Inter',
  'Roboto',
  'Ubuntu',
  'Courier New',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
] as const

export const DEFAULT_FONT_SIZE = 8
export const DEFAULT_LABEL_POSITION = 'center' as const

// ============================================================================
// LABEL POSITIONS
// ============================================================================

export const LABEL_POSITIONS = [
  'center',
  'top-left',
  'top-center',
  'top-right',
  'middle-left',
  'middle-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const

// ============================================================================
// BLEND MODES
// ============================================================================

export const BLEND_MODES = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
] as const

// ============================================================================
// CAMERA MODES
// ============================================================================

export const CAMERA_MODES = {
  '3D': '3d',
  FACE_EDIT: 'face-edit',
} as const

// ============================================================================
// LIGHTING MODES
// ============================================================================

export const LIGHTING_MODES = {
  STUDIO: 'studio',
  DAYLIGHT: 'daylight',
} as const

// ============================================================================
// CAMERA COMMANDS
// ============================================================================

export const CAMERA_COMMANDS = {
  CENTER: 'center',
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out',
  SCREENSHOT: 'screenshot',
} as const

// ============================================================================
// STAMP MODES
// ============================================================================

export const STAMP_SCOPES = {
  ALL: 'all',
  SELECTED: 'selected',
} as const

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

export const NAV_KEYS = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
} as const

// ============================================================================
// KEY GROUPS (COMMON KEYBOARD SECTIONS)
// ============================================================================

export const KEY_GROUPS = {
  FUNCTION_ROW: 'Function Row (F1-F12)',
  NUMBERS: 'Numbers (1-0)',
  TOP_ALPHA: 'Top Alphabetic (QWERTY)',
  HOME_ALPHA: 'Home Alphabetic (ASDF)',
  BOT_ALPHA: 'Bottom Alphabetic (ZXCV)',
  MODIFIERS: 'Modifiers (Ctrl, Alt, Cmd)',
  SPACES: 'Spacebar & Large Keys',
  ARROWS: 'Arrow Keys',
  NAV_CLUSTER: 'Navigation (Home, End, Page Up/Down)',
  NUMPAD: 'Numpad (if applicable)',
  PUNCTUATION: 'Punctuation & Symbols',
  FUNCTION: 'Special Functions',
} as const

// ============================================================================
// UI PANEL DEFAULTS
// ============================================================================

export const UI_DEFAULTS = {
  LEFT_PANEL_OPEN: true,
  RIGHT_PANEL_OPEN: true,
  DEFAULT_CAMERA_MODE: '3d' as const,
  DEFAULT_LIGHTING: 'studio' as const,
} as const

// ============================================================================
// UNDO/REDO
// ============================================================================

export const UNDO_REDO = {
  MAX_HISTORY: 50,
} as const

// ============================================================================
// TIMING CONSTANTS
// ============================================================================

export const TIMING = {
  // UI commit wait for profile/layout changes (ms)
  UI_COMMIT_WAIT: 220,
  // Debounce timers
  AUTOSAVE_DEBOUNCE: 500,
  SEARCH_DEBOUNCE: 300,
  // Tooltips
  TOOLTIP_DELAY: 200,
} as const

// ============================================================================
// VALIDATION RANGES
// ============================================================================

export const VALIDATION = {
  // Key label sizing
  MIN_FONT_SIZE: 4,
  MAX_FONT_SIZE: 24,
  // Layer opacity
  MIN_OPACITY: 0,
  MAX_OPACITY: 1,
  // Scale multipliers
  MIN_SCALE: 0.1,
  MAX_SCALE: 5,
  // Rotation (degrees)
  MIN_ROTATION: 0,
  MAX_ROTATION: 360,
  // Project name length
  MIN_PROJECT_NAME: 1,
  MAX_PROJECT_NAME: 100,
} as const

// ============================================================================
// TOAST MESSAGES
// ============================================================================

export const TOAST_MESSAGES = {
  SAVE_SUCCESS: 'Project saved successfully',
  SAVE_ERROR: 'Failed to save project',
  DELETE_SUCCESS: 'Project deleted',
  DELETE_ERROR: 'Failed to delete project',
  PROFILE_APPLYING: (profile: string) => `Applying ${profile} profile...`,
  PROFILE_SUCCESS: (profile: string) => `Project profile set to ${profile}`,
  PROFILE_ERROR: 'Failed to apply profile',
  LAYOUT_SWITCHING: (layout: string) => `Switching to ${layout} layout...`,
  LAYOUT_SUCCESS: (layout: string) => `Switched to ${layout} layout`,
  LAYOUT_ERROR: 'Failed to switch layout',
  LAYOUT_INFO: (count: number) => `Mapped ${count} keys`,
} as const

// ============================================================================
// 3D RENDERING
// ============================================================================

export const RENDERING = {
  // Camera defaults
  CAMERA_FOV: 75,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 1000,
  // Default render size
  DEFAULT_WIDTH: 1280,
  DEFAULT_HEIGHT: 800,
  // Screenshot quality
  SCREENSHOT_SCALE: 2,
} as const

// ============================================================================
// LAYER TYPES
// ============================================================================

export const LAYER_TYPES = {
  IMAGE: 'image',
  SHAPE: 'shape',
  TEXT: 'text',
} as const

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  PROJECTS: 'keycap-designer-projects',
  UI_STATE: 'keycap-designer-ui-state',
  RECENT_PROJECTS: 'keycap-designer-recent',
} as const

// ============================================================================
// QUERY KEYS (for TanStack Query)
// ============================================================================

export const QUERY_KEYS = {
  ALL_PROJECTS: ['projects'],
  PROJECT: (id: string) => ['projects', id],
  PROJECT_DETAIL: (id: string) => ['projects', id, 'detail'],
  PROJECT_IMAGES: (id: string) => ['projects', id, 'images'],
} as const
