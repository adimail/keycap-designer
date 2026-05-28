import { useProjectStore } from '@/store/useProjectStore'
import { Viewport3D } from '../editor/Viewport3D'

export function StudioLeftPanel() {
  const { activeProject, setSelectedKeys } = useProjectStore()

  if (!activeProject) return null

  return (
    <div className="w-1/2 border-r border-[var(--line)] overflow-hidden bg-[var(--surface)]">
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedKeys([])
          }
        }}
        className="w-full h-full"
      >
        <Viewport3D isStudioMode={true} />
      </div>
    </div>
  )
}
