import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useProjectStore } from '@/store/useProjectStore'
import { KeyMesh } from '../editor/Viewport3D/KeyMesh'
import { Lighting } from '../editor/Viewport3D/Lighting'
import { Suspense } from 'react'

interface KeyPreview3DProps {
  keyId: string
}

function OrientationCompass() {
  return (
    <group position={[0, 0, 0]}>
      <gridHelper args={[4, 8, '#444444', '#222222']} />
      <Text
        position={[0, 0, -1.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.12}
        color="#888888"
        letterSpacing={0.1}
      >
        TOP
      </Text>
      <Text
        position={[0, 0, 1.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.12}
        color="#888888"
        letterSpacing={0.1}
      >
        BOTTOM
      </Text>
      <Text
        position={[-1.2, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.12}
        color="#888888"
        letterSpacing={0.1}
      >
        LEFT
      </Text>
      <Text
        position={[1.2, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.12}
        color="#888888"
        letterSpacing={0.1}
      >
        RIGHT
      </Text>
    </group>
  )
}

export function KeyPreview3D({ keyId }: KeyPreview3DProps) {
  const { activeProject } = useProjectStore()

  if (!activeProject) return null
  const key = activeProject.keys.find((k) => k.id === keyId)
  if (!key) return null

  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 2.5], fov: 35 }}
      gl={{ antialias: true }}
    >
      <Suspense fallback={null}>
        <Lighting />
        <KeyMesh keyData={key} centerInScene={true} />
        <OrientationCompass />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={1}
        maxDistance={15}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}
