import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import { useProjectStore } from '@/store/useProjectStore'

export function KeyboardBase() {
  const { activeProject } = useProjectStore()

  const caseStyle = activeProject?.globalSettings.caseStyle || 'none'
  const caseMaterial = activeProject?.globalSettings.caseMaterial || 'aluminum'
  const caseColor = activeProject?.globalSettings.caseColor || '#173a40'
  const keys = activeProject?.keys || []

  const { width, depth, centerX, centerZ } = useMemo(() => {
    if (caseStyle === 'none' || keys.length === 0) {
      return { width: 0, depth: 0, centerX: 0, centerZ: 0 }
    }

    const visibleKeys = keys.filter((k) => k.visible)
    if (visibleKeys.length === 0) {
      return { width: 0, depth: 0, centerX: 0, centerZ: 0 }
    }

    let minX = Infinity,
      maxX = -Infinity,
      minZ = Infinity,
      maxZ = -Infinity

    visibleKeys.forEach((k) => {
      minX = Math.min(minX, k.col)
      maxX = Math.max(maxX, k.col + k.widthUnits)
      minZ = Math.min(minZ, k.row)
      maxZ = Math.max(maxZ, k.row + (k.heightUnits || 1))
    })

    const w = maxX - minX
    const d = maxZ - minZ

    return {
      width: w,
      depth: d,
      centerX: minX + w / 2,
      centerZ: minZ + d / 2,
    }
  }, [keys, caseStyle])

  const materialProps = useMemo(() => {
    if (caseStyle === 'none') return {}

    switch (caseMaterial) {
      case 'aluminum':
        return {
          color: caseColor,
          metalness: 0.8,
          roughness: 0.25,
          clearcoat: 0.1,
        }
      case 'brass':
        return {
          color: '#e6c27a',
          metalness: 0.9,
          roughness: 0.2,
          clearcoat: 0.3,
        }
      case 'frosted-poly':
        return {
          color: caseColor,
          metalness: 0.1,
          roughness: 0.4,
          transmission: 0.9,
          transparent: true,
          opacity: 1,
          ior: 1.5,
          thickness: 0.5,
        }
      case 'walnut':
        return {
          color: '#4a3018',
          metalness: 0,
          roughness: 0.85,
        }
      default:
        return { color: caseColor, metalness: 0.5, roughness: 0.5 }
    }
  }, [caseMaterial, caseColor, caseStyle])

  if (caseStyle === 'none' || width === 0) {
    return null
  }

  const padding = 0.4
  const baseWidth = width + padding * 2
  const baseDepth = depth + padding * 2
  const plateThickness = 0.4
  const plateY = -0.2
  const bezelHeight = 1.0
  const bezelY = 0.1

  const matKey = `${caseMaterial}-${caseColor}`

  return (
    <group position={[centerX, 0, centerZ]}>
      <RoundedBox
        args={[baseWidth, plateThickness, baseDepth]}
        position={[0, plateY, 0]}
        radius={0.05}
        smoothness={4}
      >
        <meshPhysicalMaterial key={matKey} {...materialProps} />
      </RoundedBox>

      {caseStyle === 'high-profile' && (
        <>
          <RoundedBox
            args={[baseWidth, bezelHeight, padding]}
            position={[0, bezelY, -baseDepth / 2 + padding / 2]}
            radius={0.05}
            smoothness={4}
          >
            <meshPhysicalMaterial key={`bp1-${matKey}`} {...materialProps} />
          </RoundedBox>
          <RoundedBox
            args={[baseWidth, bezelHeight, padding]}
            position={[0, bezelY, baseDepth / 2 - padding / 2]}
            radius={0.05}
            smoothness={4}
          >
            <meshPhysicalMaterial key={`bp2-${matKey}`} {...materialProps} />
          </RoundedBox>
          <RoundedBox
            args={[padding, bezelHeight, depth]}
            position={[-baseWidth / 2 + padding / 2, bezelY, 0]}
            radius={0.05}
            smoothness={4}
          >
            <meshPhysicalMaterial key={`bp3-${matKey}`} {...materialProps} />
          </RoundedBox>
          <RoundedBox
            args={[padding, bezelHeight, depth]}
            position={[baseWidth / 2 - padding / 2, bezelY, 0]}
            radius={0.05}
            smoothness={4}
          >
            <meshPhysicalMaterial key={`bp4-${matKey}`} {...materialProps} />
          </RoundedBox>
        </>
      )}
    </group>
  )
}
