import { useUIStore } from '@/store/useUIStore'
import { Environment } from '@react-three/drei'

export function Lighting() {
  const { lightingMode } = useUIStore()

  return lightingMode === 'studio' ? (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <Environment preset="studio" environmentIntensity={0.6} />
    </>
  ) : (
    <>
      <ambientLight intensity={0.3} color="#fff0dd" />
      <directionalLight
        position={[10, 5, -5]}
        intensity={2.2}
        color="#ffedd6"
        castShadow
      />
      <Environment preset="sunset" environmentIntensity={0.6} />
    </>
  )
}
