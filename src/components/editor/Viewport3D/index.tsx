import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import { Lighting } from './Lighting'
import { KeyboardModel } from './KeyboardModel'
import { FaceEditOverlay } from './FaceEditOverlay'
import { CameraController } from './CameraController'
import { Toolbar } from './Toolbar'
import { StampHUD } from './StampHUD'
import { Suspense, useRef, useEffect } from 'react'

interface Viewport3DProps {
  isStudioMode?: boolean
}

export function Viewport3D({ isStudioMode }: Viewport3DProps = {}) {
  const { setSelectedKeys, undo, redo, activeProject, deleteLayer } =
    useProjectStore()
  const {
    setCameraCommand,
    editingLayerId,
    stampMode,
    setStampMode,
    setEditingLayerId,
    setStampHoverInfo,
  } = useUIStore()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (stampMode) {
      document.body.style.cursor = 'crosshair'
    } else {
      document.body.style.cursor = 'auto'
    }
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [stampMode])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      }

      if ((e.metaKey || e.ctrlKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault()
        if (activeProject)
          setSelectedKeys(
            activeProject.keys.filter((k) => k.visible).map((k) => k.id),
          )
      }

      if (e.key === 'Escape') {
        if (stampMode) {
          setStampMode(false)
          setStampHoverInfo(null)
          setEditingLayerId(null)
        } else {
          setSelectedKeys([])
          setEditingLayerId(null)
        }
      }

      if (e.key === 'f' || e.key === 'F') {
        setCameraCommand('center')
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (editingLayerId) deleteLayer(editingLayerId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    undo,
    redo,
    activeProject,
    setSelectedKeys,
    setCameraCommand,
    editingLayerId,
    deleteLayer,
    stampMode,
    setStampMode,
    setEditingLayerId,
    setStampHoverInfo,
  ])

  return (
    <div className="flex-1 w-full h-full relative bg-[#0f1114]">
      {!isStudioMode && <StampHUD />}
      <Canvas
        onPointerMissed={() => {
          if (stampMode) {
            setStampMode(false)
            setStampHoverInfo(null)
            setEditingLayerId(null)
          } else if (!isStudioMode) {
            setSelectedKeys([])
            setEditingLayerId(null)
          }
        }}
        shadows="basic"
        camera={{ position: [0, 10, 15], fov: 40 }}
        style={{ height: '100%', width: '100%' }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <CameraController
          controlsRef={controlsRef}
          isStudioMode={isStudioMode}
        />
        <Lighting />
        <Suspense fallback={null}>
          <KeyboardModel />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          keyEvents={false}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
      {!isStudioMode && <Toolbar />}
      {!isStudioMode && <FaceEditOverlay />}
    </div>
  )
}
