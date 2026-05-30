export interface Layer {
  id: string
  type: 'image' | 'colour'
  imageData: string | null
  opacity: number
  visible: boolean
  position: { x: number; y: number }
  scale: number
  rotation: number
  blendMode: string
  spanMode: 'per-key' | 'group'
  name: string
  position3D?: { x: number; y: number; z: number }
  normal?: [number, number, number]
}

export interface KeyData {
  id: string
  row: number
  col: number
  widthUnits: number
  heightUnits?: number
  visible: boolean
  label: string
  shape?: 'standard' | 'iso-enter' | 'big-ass-enter' | 'stepped-caps'
  labelStyle: {
    fontFamily: string
    fontSize: number
    color: string
    position: string
  }
  colour: string
  profile?: 'SA' | 'OEM' | 'Cherry' | 'DSA' | 'XDA'
  finish?: 'matte' | 'glossy' | 'transparent'
  layers: Layer[]
}

export interface GlobalSettings {
  caseColor: string
  caseMaterial: 'aluminum' | 'frosted-poly' | 'brass' | 'walnut'
  caseStyle?: 'none' | 'flat' | 'high-profile'
  profile: 'SA' | 'OEM' | 'Cherry' | 'DSA' | 'XDA'
  finish: 'matte' | 'glossy' | 'transparent'
}

export interface ProjectImage {
  id: string
  data: string
  name: string
}

export interface StudioState {
  activeKeyId: string | null
}

export interface Project {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  thumbnail: string
  layout: string
  keys: KeyData[]
  globalSettings: GlobalSettings
  images: ProjectImage[]
  studioState?: StudioState
}
