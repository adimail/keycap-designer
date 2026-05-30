import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Grid,
  GizmoHelper,
  GizmoViewport,
} from '@react-three/drei'
import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import { Lighting } from './Lighting'
import { KeyboardModel } from './KeyboardModel'
import { FaceEditOverlay } from './FaceEditOverlay'
import { CameraController } from './CameraController'
import { Toolbar } from './Toolbar'
import { StampHUD } from './StampHUD'
import { Suspense, useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { toast } from 'sonner'
import { useKeyNavigation } from '@/hooks/useKeyNavigation'

interface Viewport3DProps {
  isStudioMode?: boolean
}

function KeyboardSkeleton() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      baseColor: { value: new THREE.Color('#173a40') },
      shimmerColor: { value: new THREE.Color('#4fb8b2') },
    }),
    [],
  )

  useEffect(() => {
    let resolvePromise: () => void
    const renderPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve
    })

    toast.promise(renderPromise, {
      loading: 'Rendering 3D model...',
      success: 'Render complete',
      error: 'Failed to render 3D model',
    })

    return () => {
      resolvePromise()
    }
  }, [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[15, 1, 5]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        vertexShader={`
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vPos;
          uniform float time;
          uniform vec3 baseColor;
          uniform vec3 shimmerColor;
          void main() {
            float sweep = fract(time * 0.6) * 2.0 - 0.5;
            float normX = (vPos.x / 15.0) + 0.5;
            float dist = abs(normX - sweep);
            float intensity = smoothstep(0.3, 0.0, dist);
            vec3 finalColor = mix(baseColor, shimmerColor, intensity * 0.35);
            gl_FragColor = vec4(finalColor, 0.8);
          }
        `}
      />
    </mesh>
  )
}

export function Viewport3D({ isStudioMode }: Viewport3DProps = {}) {
  const {
    setSelectedKeys,
    undo,
    redo,
    activeProject,
    deleteLayer,
    isProcessing,
  } = useProjectStore()
  const {
    setCameraCommand,
    editingLayerId,
    stampMode,
    setStampMode,
    setEditingLayerId,
    setStampHoverInfo,
  } = useUIStore()

  const controlsRef = useRef<any>(null)
  const navigateKey = useKeyNavigation()

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

      // --- Arrow Navigation ---
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (!stampMode && !editingLayerId) navigateKey('left', e.shiftKey)
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (!stampMode && !editingLayerId) navigateKey('right', e.shiftKey)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (!stampMode && !editingLayerId) navigateKey('up', e.shiftKey)
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (!stampMode && !editingLayerId) navigateKey('down', e.shiftKey)
        return
      }
      // ------------------------

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        e.stopPropagation()
        if (e.shiftKey) redo()
        else undo()
      }

      if ((e.metaKey || e.ctrlKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault()
        e.stopPropagation()
        if (activeProject)
          setSelectedKeys(
            activeProject.keys.filter((k) => k.visible).map((k) => k.id),
          )
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
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
        e.preventDefault()
        e.stopPropagation()
        setCameraCommand('center')
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (editingLayerId) {
          e.preventDefault()
          e.stopPropagation()
          deleteLayer(editingLayerId)
        }
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
    navigateKey,
  ])

  return (
    <div className="flex-1 w-full h-full relative bg-[#0f1114]">
      {!isStudioMode && <StampHUD />}
      <div
        className={`absolute inset-0 transition-opacity duration-200 ${isProcessing ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}
      >
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

          {activeProject ? (
            <Suspense fallback={<KeyboardSkeleton />}>
              <Lighting />
              <KeyboardModel />
            </Suspense>
          ) : (
            <KeyboardSkeleton />
          )}

          {!isStudioMode && (
            <Grid
              position={[0, -0.01, 0]}
              infiniteGrid
              fadeDistance={30}
              cellColor="#416166"
              sectionColor="#173a40"
              cellSize={1}
              sectionSize={5}
              cellThickness={0.5}
              sectionThickness={1}
            />
          )}

          <OrbitControls
            ref={controlsRef}
            makeDefault
            keyEvents={false}
            enableRotate={true}
          />

          <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
            <GizmoViewport
              axisColors={['#ff4b4b', '#4bff4b', '#4b4bff']}
              labelColor="white"
            />
          </GizmoHelper>
        </Canvas>
      </div>
      {!isStudioMode && <Toolbar />}
      {!isStudioMode && <FaceEditOverlay />}
    </div>
  )
}
