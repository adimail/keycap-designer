import { create } from 'zustand'
import { startTransition } from 'react'
import type {
  Project,
  KeyData,
  Layer,
  ProjectImage,
  GlobalSettings,
} from '@/types'
import { getLayoutKeys } from '@/lib/layouts'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { DEFAULT_COLORS, UNDO_REDO } from '@/lib/constants'
import { DEFAULT_KEY_STYLE } from '@/lib/layouts'
import { useUIStore } from './useUIStore'
import {
  saveProject,
  saveGlobalImage,
  getAllGlobalImages,
  deleteGlobalImage,
} from '@/lib/db'

interface ProjectState {
  activeProject: Project | null
  past: Project[]
  future: Project[]
  hasUnsavedChanges: boolean
  selectedKeyIds: string[]
  studioActiveKeyId: string | null
  isProcessing: boolean
  globalImages: ProjectImage[]

  setIsProcessing: (val: boolean) => void
  setActiveProject: (project: Project) => void
  setSelectedKeys: (ids: string[] | ((prev: string[]) => string[])) => void
  setStudioActiveKeyId: (id: string | null) => void

  updateSelectedKeys: (updates: Partial<KeyData>) => void
  updateKeyLabelStyle: (updates: Partial<KeyData['labelStyle']>) => void
  updateGlobalSettings: (updates: Partial<GlobalSettings>) => void
  changeLayout: (layout: string) => void
  addImage: (image: ProjectImage) => Promise<void>
  deleteImage: (id: string) => Promise<void>
  loadGlobalImages: () => Promise<void>
  addLayerToSelection: (layer: Omit<Layer, 'id'>) => void
  updateLayer: (layerId: string, updates: Partial<Layer>) => void
  deleteLayer: (layerId: string) => void
  reorderLayers: (oldIndex: number, newIndex: number) => void
  resetSelectedKeys: () => void
  updateProjectName: (name: string) => void
  addCustomKey: (key: KeyData) => void
  removeKey: (keyId: string) => void
  transformEnterCluster: (style: 'ansi' | 'iso' | 'bae') => void
  toggleSteppedCaps: (stepped: boolean) => void
  undo: () => void
  redo: () => void
  setHasUnsavedChanges: (val: boolean) => void
  saveCurrentProject: () => Promise<void>
  placeStamp: (
    hoveredKeyId: string,
    localPos: [number, number, number],
    localNormal?: [number, number, number],
  ) => void
}

const mutateProject = (
  state: ProjectState,
  newProject: Project,
): Partial<ProjectState> => ({
  past: [...state.past, state.activeProject!].slice(-UNDO_REDO.MAX_HISTORY),
  future: [],
  hasUnsavedChanges: true,
  activeProject: newProject,
})

export const useProjectStore = create<ProjectState>((set, get) => ({
  activeProject: null,
  past: [],
  future: [],
  hasUnsavedChanges: false,
  selectedKeyIds: [],
  studioActiveKeyId: null,
  isProcessing: false,
  globalImages: [],

  setIsProcessing: (val) => set({ isProcessing: val }),

  setActiveProject: (project) =>
    set({
      activeProject: project,
      past: [],
      future: [],
      hasUnsavedChanges: false,
      studioActiveKeyId: project.studioState?.activeKeyId || null,
    }),

  setStudioActiveKeyId: (id) => {
    const { activeProject } = get()
    if (!activeProject) return
    set(
      mutateProject(get(), {
        ...activeProject,
        studioState: { activeKeyId: id },
        updatedAt: new Date().toISOString(),
      }),
    )
    set({ studioActiveKeyId: id })
  },

  setSelectedKeys: (ids) =>
    set((state) => ({
      selectedKeyIds:
        typeof ids === 'function' ? ids(state.selectedKeyIds) : ids,
    })),

  updateGlobalSettings: async (updates) => {
    const { activeProject } = get()
    if (!activeProject) return
    const nextProfile = updates.profile
    const profileChanged =
      nextProfile !== undefined &&
      nextProfile !== activeProject.globalSettings.profile

    if (profileChanged) {
      set({ isProcessing: true })
      await new Promise((r) => setTimeout(r, 60))

      toast.promise(
        new Promise<void>((resolve) => {
          startTransition(() => {
            set((state) => ({
              ...mutateProject(state, {
                ...state.activeProject!,
                globalSettings: {
                  ...state.activeProject!.globalSettings,
                  ...updates,
                },
                updatedAt: new Date().toISOString(),
              }),
            }))

            setTimeout(() => {
              set({ isProcessing: false })
              resolve()
            }, 50)
          })
        }),
        {
          loading: `Applying ${nextProfile} profile...`,
          success: `Project profile set to ${nextProfile}`,
          error: 'Failed to apply profile',
        },
      )
      return
    }

    set(
      mutateProject(get(), {
        ...activeProject,
        globalSettings: { ...activeProject.globalSettings, ...updates },
        updatedAt: new Date().toISOString(),
      }),
    )
  },

  changeLayout: async (layout) => {
    const { activeProject } = get()
    if (!activeProject) return

    set({ isProcessing: true })
    await new Promise((r) => setTimeout(r, 60))

    toast.promise(
      new Promise<void>((resolve) => {
        startTransition(() => {
          const keys = getLayoutKeys(layout)
          set((state) => ({
            ...mutateProject(state, {
              ...state.activeProject!,
              layout,
              keys,
              updatedAt: new Date().toISOString(),
            }),
            selectedKeyIds: [],
          }))
          setTimeout(() => {
            set({ isProcessing: false })
            resolve()
          }, 50)
        })
      }),
      {
        loading: `Switching to ${layout} layout...`,
        success: `Switched to ${layout} layout`,
        error: 'Failed to switch layout',
      },
    )
  },

  updateSelectedKeys: async (updates) => {
    const { activeProject, selectedKeyIds } = get()
    if (!activeProject) return
    const profileWasUpdated = Object.prototype.hasOwnProperty.call(
      updates,
      'profile',
    )

    if (profileWasUpdated) {
      set({ isProcessing: true })
      await new Promise((r) => setTimeout(r, 60))
      const profile = updates.profile ?? activeProject.globalSettings.profile

      toast.promise(
        new Promise<void>((resolve) => {
          startTransition(() => {
            set((state) => {
              const keys = state.activeProject!.keys.map((k) =>
                selectedKeyIds.includes(k.id) ? { ...k, ...updates } : k,
              )
              return {
                ...mutateProject(state, {
                  ...state.activeProject!,
                  keys,
                  updatedAt: new Date().toISOString(),
                }),
              }
            })
            setTimeout(() => {
              set({ isProcessing: false })
              resolve()
            }, 50)
          })
        }),
        {
          loading: `Applying ${profile} override...`,
          success: `Profile override set to ${profile}`,
          error: 'Failed to apply profile override',
        },
      )
      return
    }

    const keys = activeProject.keys.map((k) =>
      selectedKeyIds.includes(k.id) ? { ...k, ...updates } : k,
    )
    set(
      mutateProject(get(), {
        ...activeProject,
        keys,
        updatedAt: new Date().toISOString(),
      }),
    )
  },

  updateKeyLabelStyle: (updates) => {
    const { activeProject, selectedKeyIds } = get()
    if (!activeProject) return
    const keys = activeProject.keys.map((k) =>
      selectedKeyIds.includes(k.id)
        ? { ...k, labelStyle: { ...k.labelStyle, ...updates } }
        : k,
    )
    set(
      mutateProject(get(), {
        ...activeProject,
        keys,
        updatedAt: new Date().toISOString(),
      }),
    )
  },

  saveCurrentProject: async () => {
    const { activeProject } = get()
    if (activeProject) {
      await saveProject(activeProject)
      set({ hasUnsavedChanges: false })
    }
  },

  addImage: async (image) => {
    await saveGlobalImage(image)
    set((state) => ({ globalImages: [...state.globalImages, image] }))
  },

  deleteImage: async (id) => {
    await deleteGlobalImage(id)
    set((state) => ({
      globalImages: state.globalImages.filter((i) => i.id !== id),
    }))
    const { activeProject } = get()
    if (activeProject) {
      const keys = activeProject.keys.map((k) => ({
        ...k,
        layers: k.layers.filter((l) => l.imageData !== id),
      }))
      set(
        mutateProject(get(), {
          ...activeProject,
          keys,
          updatedAt: new Date().toISOString(),
        }),
      )
    }
  },

  loadGlobalImages: async () => {
    const images = await getAllGlobalImages()
    set({ globalImages: images })
  },

  addLayerToSelection: (layerData) => {
    const { activeProject, selectedKeyIds } = get()
    if (!activeProject || selectedKeyIds.length === 0) return
    const layerId = uuidv4()
    const keys = activeProject.keys.map((k) => {
      if (!selectedKeyIds.includes(k.id)) return k
      return { ...k, layers: [...k.layers, { ...layerData, id: layerId }] }
    })
    set(
      mutateProject(get(), {
        ...activeProject,
        keys,
        updatedAt: new Date().toISOString(),
      }),
    )
  },

  updateLayer: (layerId, updates) => {
    const { activeProject, selectedKeyIds } = get()
    if (!activeProject) return
    const keys = activeProject.keys.map((k) => {
      if (!k.layers.some((l) => l.id === layerId)) return k
      return {
        ...k,
        layers: k.layers.map((l) =>
          l.id === layerId ? { ...l, ...updates } : l,
        ),
      }
    })
    set(
      mutateProject(get(), {
        ...activeProject,
        keys,
        updatedAt: new Date().toISOString(),
      }),
    )

    toast.success(
      `Added layer to ${selectedKeyIds.length} key${selectedKeyIds.length > 1 ? 's' : ''}`,
    )
  },

  deleteLayer: (layerId) => {
    const { activeProject } = get()
    if (!activeProject) return
    const keys = activeProject.keys.map((k) => {
      if (!k.layers.some((l) => l.id === layerId)) return k
      return { ...k, layers: k.layers.filter((l) => l.id !== layerId) }
    })
    set(
      mutateProject(get(), {
        ...activeProject,
        keys,
        updatedAt: new Date().toISOString(),
      }),
    )

    const affectedCount = keys.filter((k) =>
      activeProject.keys.some(
        (orig) => orig.id === k.id && orig.layers.length > k.layers.length,
      ),
    ).length
    toast.success(
      `Deleted layer from ${affectedCount} key${affectedCount > 1 ? 's' : ''}`,
    )
  },

  reorderLayers: (oldIndex, newIndex) => {
    const { activeProject, selectedKeyIds } = get()
    if (!activeProject || selectedKeyIds.length === 0) return
    const keys = activeProject.keys.map((k) => {
      if (!selectedKeyIds.includes(k.id)) return k
      const newLayers = [...k.layers]
      const [moved] = newLayers.splice(oldIndex, 1)
      newLayers.splice(newIndex, 0, moved)
      return { ...k, layers: newLayers }
    })
    set(
      mutateProject(get(), {
        ...activeProject,
        keys,
        updatedAt: new Date().toISOString(),
      }),
    )
  },

  resetSelectedKeys: () => {
    const { activeProject, selectedKeyIds } = get()
    if (!activeProject) return
    const keys = activeProject.keys.map((k) => {
      if (!selectedKeyIds.includes(k.id)) return k
      return {
        ...k,
        colour: DEFAULT_COLORS.KEY_DEFAULT,
        profile: undefined,
        finish: undefined,
        labelStyle: { ...DEFAULT_KEY_STYLE.labelStyle },
        layers: [],
      }
    })
    set(
      mutateProject(get(), {
        ...activeProject,
        keys,
        updatedAt: new Date().toISOString(),
      }),
    )

    toast.success(
      `Reset ${selectedKeyIds.length} key${selectedKeyIds.length > 1 ? 's' : ''}`,
    )
  },

  updateProjectName: (name) => {
    const { activeProject } = get()
    if (!activeProject) return
    set(
      mutateProject(get(), {
        ...activeProject,
        name,
        updatedAt: new Date().toISOString(),
      }),
    )
  },

  addCustomKey: (key) => {
    const { activeProject } = get()
    if (!activeProject) return
    set(
      mutateProject(get(), {
        ...activeProject,
        keys: [...activeProject.keys, key],
        updatedAt: new Date().toISOString(),
      }),
    )
  },

  removeKey: (keyId) => {
    const { activeProject } = get()
    if (!activeProject) return
    set(
      mutateProject(get(), {
        ...activeProject,
        keys: activeProject.keys.filter((k) => k.id !== keyId),
        updatedAt: new Date().toISOString(),
      }),
    )
  },

  transformEnterCluster: (style) => {
    const { activeProject } = get()
    if (!activeProject) return

    const originalKeys = getLayoutKeys(activeProject.layout)
    const enterOrig = originalKeys.find((ok) => ok.label === 'ENTER')
    const slashOrig = originalKeys.find((ok) => ok.label === '\\')

    if (!enterOrig) return

    const keys = activeProject.keys.map((k) => {
      if (k.id === enterOrig.id) {
        let baseY = enterOrig.row
        if (k.shape === 'iso-enter' || k.shape === 'big-ass-enter') {
          baseY = enterOrig.row + 1
        }
        const rightEdge = enterOrig.col + enterOrig.widthUnits

        if (style === 'ansi') {
          return {
            ...k,
            shape: 'standard' as const,
            row: baseY,
            col: rightEdge - 2.25,
            widthUnits: 2.25,
            heightUnits: 1,
            visible: true,
          }
        }
        if (style === 'iso') {
          return {
            ...k,
            shape: 'iso-enter' as const,
            row: baseY - 1,
            col: rightEdge - 1.5,
            widthUnits: 1.5,
            heightUnits: 2,
            visible: true,
          }
        }
        if (style === 'bae') {
          return {
            ...k,
            shape: 'big-ass-enter' as const,
            row: baseY - 1,
            col: rightEdge - 2.25,
            widthUnits: 2.25,
            heightUnits: 2,
            visible: true,
          }
        }
      }

      if (slashOrig && k.id === slashOrig.id) {
        let baseY = enterOrig.row
        if (
          activeProject.keys.find((key) => key.id === enterOrig.id)?.shape ===
            'iso-enter' ||
          activeProject.keys.find((key) => key.id === enterOrig.id)?.shape ===
            'big-ass-enter'
        ) {
          baseY = enterOrig.row + 1
        }
        const rightEdge = enterOrig.col + enterOrig.widthUnits

        if (style === 'ansi') {
          return {
            ...k,
            row: baseY - 1,
            col: rightEdge - 1.5,
            widthUnits: 1.5,
            heightUnits: 1,
            visible: true,
          }
        }
        if (style === 'iso') {
          return {
            ...k,
            row: baseY,
            col: rightEdge - 2.25,
            widthUnits: 1,
            heightUnits: 1,
            visible: true,
          }
        }
        if (style === 'bae') {
          return { ...k, visible: false }
        }
      }
      return k
    })

    set(
      mutateProject(get(), {
        ...activeProject,
        keys,
        updatedAt: new Date().toISOString(),
      }),
    )
  },

  toggleSteppedCaps: (stepped) => {
    const { activeProject } = get()
    if (!activeProject) return
    const originalKeys = getLayoutKeys(activeProject.layout)
    const keys = activeProject.keys.map((k) => {
      const orig = originalKeys.find((ok) => ok.id === k.id)
      if (orig?.label === 'CAPS' || orig?.label === 'CAPSLOCK') {
        return {
          ...k,
          shape: stepped ? ('stepped-caps' as const) : ('standard' as const),
        }
      }
      return k
    })
    set(
      mutateProject(get(), {
        ...activeProject,
        keys,
        updatedAt: new Date().toISOString(),
      }),
    )
  },

  undo: () => {
    const { past, future, activeProject } = get()
    if (past.length === 0 || !activeProject) return
    const previous = past[past.length - 1]
    const newPast = past.slice(0, past.length - 1)
    set({
      past: newPast,
      future: [activeProject, ...future],
      activeProject: previous,
      hasUnsavedChanges: true,
    })
  },

  redo: () => {
    const { past, future, activeProject } = get()
    if (future.length === 0 || !activeProject) return
    const next = future[0]
    const newFuture = future.slice(1)
    set({
      past: [...past, activeProject],
      future: newFuture,
      activeProject: next,
      hasUnsavedChanges: true,
    })
  },

  setHasUnsavedChanges: (val) => set({ hasUnsavedChanges: val }),

  placeStamp: (hoveredKeyId, localPos, localNormal) => {
    const { activeProject, selectedKeyIds, globalImages } = get()
    const { stampImageId, stampScope, stampSnapToCenter } =
      useUIStore.getState()
    if (!activeProject || !stampImageId) return

    const layerId = uuidv4()
    const imgObj = globalImages.find((i) => i.id === stampImageId)
    const name = imgObj ? imgObj.name : 'Stamp'

    const targetKeys =
      stampScope === 'selected' && selectedKeyIds.length > 0
        ? selectedKeyIds
        : activeProject.keys.filter((k) => k.visible).map((k) => k.id)

    let minX = Infinity,
      maxX = -Infinity,
      minZ = Infinity,
      maxZ = -Infinity
    targetKeys.forEach((id) => {
      const k = activeProject.keys.find((k) => k.id === id)
      if (!k) return
      const left = k.col
      const right = k.col + k.widthUnits
      const top = k.row
      const bottom = k.row + (k.heightUnits || 1)
      if (left < minX) minX = left
      if (right > maxX) maxX = right
      if (top < minZ) minZ = top
      if (bottom > maxZ) maxZ = bottom
    })

    const scopeScale =
      minX !== Infinity ? Math.min(maxX - minX, maxZ - minZ) * 0.9 : 1
    const scopeCenterX = minX + (maxX - minX) / 2
    const scopeCenterZ = minZ + (maxZ - minZ) / 2

    let clickLayoutX = scopeCenterX
    let clickLayoutZ = scopeCenterZ
    let clickLayoutY = 0.5

    if (!stampSnapToCenter) {
      const hKey = activeProject.keys.find((k) => k.id === hoveredKeyId)
      if (hKey) {
        clickLayoutX = hKey.col + hKey.widthUnits / 2 + localPos[0]
        clickLayoutZ = hKey.row + (hKey.heightUnits || 1) / 2 + localPos[2]
        clickLayoutY = localPos[1]
      }
    }

    const keys = activeProject.keys.map((k) => {
      if (!targetKeys.includes(k.id)) return k
      const myX = k.col + k.widthUnits / 2
      const myZ = k.row + (k.heightUnits || 1) / 2

      return {
        ...k,
        layers: [
          ...k.layers,
          {
            id: layerId,
            type: 'image' as const,
            imageData: stampImageId,
            opacity: 1,
            visible: true,
            position: { x: clickLayoutX - myX, y: clickLayoutZ - myZ },
            position3D: {
              x: clickLayoutX - myX,
              y: clickLayoutY,
              z: clickLayoutZ - myZ,
            },
            normal: localNormal,
            scale: scopeScale,
            rotation: 0,
            blendMode: 'normal',
            spanMode: 'group' as const,
            name,
          },
        ],
      }
    })

    set(
      mutateProject(get(), {
        ...activeProject,
        keys,
        updatedAt: new Date().toISOString(),
      }),
    )

    useUIStore.getState().setEditingLayerId(layerId)
    useUIStore.getState().setCameraCommand('focus-key', hoveredKeyId)
  },
}))
