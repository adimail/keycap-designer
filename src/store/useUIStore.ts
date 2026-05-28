import { create } from 'zustand'

interface UIState {
  cameraMode: '3d' | 'face-edit'
  lightingMode: 'studio' | 'daylight'
  editingLayerId: string | null
  cameraCommand: 'center' | 'zoom-in' | 'zoom-out' | 'screenshot' | null
  leftPanelOpen: boolean
  rightPanelOpen: boolean
  stampMode: boolean
  stampImageId: string | null
  stampScope: 'all' | 'selected'
  stampSnapToCenter: boolean
  stampHoverInfo: {
    hoveredKeyId: string
    localPos: [number, number, number]
    localNormal?: [number, number, number]
  } | null

  setCameraMode: (mode: '3d' | 'face-edit') => void
  setLightingMode: (mode: 'studio' | 'daylight') => void
  setEditingLayerId: (id: string | null) => void
  setCameraCommand: (cmd: 'center' | 'zoom-in' | 'zoom-out' | 'screenshot' | null) => void
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  setStampMode: (active: boolean, imageId?: string | null, scope?: 'all' | 'selected') => void
  setStampSnapToCenter: (snap: boolean) => void
  setStampHoverInfo: (
    info: {
      hoveredKeyId: string
      localPos: [number, number, number]
      localNormal?: [number, number, number]
    } | null,
  ) => void
}

export const useUIStore = create<UIState>((set) => ({
  cameraMode: '3d',
  lightingMode: 'studio',
  editingLayerId: null,
  cameraCommand: null,
  leftPanelOpen: true,
  rightPanelOpen: true,
  stampMode: false,
  stampImageId: null,
  stampScope: 'all',
  stampSnapToCenter: false,
  stampHoverInfo: null,

  setCameraMode: (mode) => set({ cameraMode: mode }),
  setLightingMode: (mode) => set({ lightingMode: mode }),
  setEditingLayerId: (id) => set({ editingLayerId: id }),
  setCameraCommand: (cmd) => set({ cameraCommand: cmd }),
  toggleLeftPanel: () =>
    set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
  toggleRightPanel: () =>
    set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  setStampMode: (active, imageId = null, scope = 'all') =>
    set({
      stampMode: active,
      stampImageId: imageId,
      stampScope: scope,
      stampHoverInfo: null,
    }),
  setStampSnapToCenter: (snap) => set({ stampSnapToCenter: snap }),
  setStampHoverInfo: (info) => set({ stampHoverInfo: info }),
}))
