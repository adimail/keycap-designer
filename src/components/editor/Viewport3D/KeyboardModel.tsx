import { useProjectStore } from '@/store/useProjectStore'
import { KeyMesh } from './KeyMesh'
import { KeyboardBase } from './KeyboardBase'
import { Center } from '@react-three/drei'

export function KeyboardModel() {
  const { activeProject } = useProjectStore()
  if (!activeProject) return null

  return (
    <Center position={[0, 0.7, 0]}>
      <group>
        <KeyboardBase />
        {activeProject.keys
          .filter((k) => k.visible)
          .map((key) => (
            <KeyMesh key={key.id} keyData={key} />
          ))}
      </group>
    </Center>
  )
}
