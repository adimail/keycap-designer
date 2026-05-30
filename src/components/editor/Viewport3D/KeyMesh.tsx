import { useRef, useState, useEffect, useMemo } from 'react'
import { Text, Decal, useTexture } from '@react-three/drei'
import { mergeBufferGeometries } from 'three-stdlib'
import * as THREE from 'three'
import type { KeyData, Layer } from '@/types'
import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'

const PROFILES: Record<string, any> = {
  Cherry: {
    type: 'cylindrical',
    topScaleX: 0.65,
    topScaleZ: 0.75,
    heights: { R1: 0.5, R2: 0.42, R3: 0.38, R4: 0.42, SPACE: 0.42 },
    tilts: { R1: 8, R2: 4, R3: 0, R4: -6, SPACE: -4 },
    scoopDepth: 0.05,
  },
  OEM: {
    type: 'cylindrical',
    topScaleX: 0.65,
    topScaleZ: 0.75,
    heights: { R1: 0.6, R2: 0.5, R3: 0.45, R4: 0.5, SPACE: 0.5 },
    tilts: { R1: 9, R2: 4, R3: 0, R4: -6, SPACE: -4 },
    scoopDepth: 0.06,
  },
  SA: {
    type: 'spherical',
    topScaleX: 0.6,
    topScaleZ: 0.6,
    heights: { R1: 0.75, R2: 0.65, R3: 0.6, R4: 0.65, SPACE: 0.65 },
    tilts: { R1: 10, R2: 5, R3: 0, R4: -7, SPACE: 0 },
    scoopDepth: 0.1,
  },
  DSA: {
    type: 'spherical',
    topScaleX: 0.65,
    topScaleZ: 0.65,
    heights: { R1: 0.35, R2: 0.35, R3: 0.35, R4: 0.35, SPACE: 0.35 },
    tilts: { R1: 0, R2: 0, R3: 0, R4: 0, SPACE: 0 },
    scoopDepth: 0.05,
  },
  XDA: {
    type: 'spherical',
    topScaleX: 0.8,
    topScaleZ: 0.8,
    heights: { R1: 0.4, R2: 0.4, R3: 0.4, R4: 0.4, SPACE: 0.4 },
    tilts: { R1: 0, R2: 0, R3: 0, R4: 0, SPACE: 0 },
    scoopDepth: 0.03,
  },
}

const geometryCache = new Map<string, THREE.BufferGeometry>()

function getRowStr(keyData: KeyData) {
  if (keyData.label === 'SPACE' || keyData.widthUnits >= 3) return 'SPACE'
  const r = Math.round(keyData.row)
  if (r === 0) return 'R1'
  if (r === 1) return 'R2'
  if (r === 2) return 'R3'
  if (r >= 3) return 'R4'
  return 'R3'
}

function getRotationFromNormal(
  normal: THREE.Vector3,
  layerRotation: number = 0,
) {
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    normal,
  )
  const euler = new THREE.Euler().setFromQuaternion(quaternion)
  euler.z += layerRotation
  return euler
}

function createShape(points: number[][]) {
  const shape = new THREE.Shape()
  shape.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1])
  }
  shape.closePath()
  return shape
}

function LayerDecal({
  layer,
  height,
  tilt,
}: {
  layer: Layer
  height: number
  tilt: number
}) {
  const { activeProject } = useProjectStore()
  const imgObj = activeProject?.images.find((img) => img.id === layer.imageData)
  const defaultTex =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  const texture = useTexture(
    imgObj ? imgObj.data : layer.imageData || defaultTex,
  )

  const normal = layer.normal
    ? new THREE.Vector3(...layer.normal)
    : new THREE.Vector3(0, 1, 0).applyAxisAngle(
        new THREE.Vector3(1, 0, 0),
        -tilt,
      )
  const rotation = getRotationFromNormal(normal, layer.rotation)

  const position: [number, number, number] = layer.position3D
    ? [layer.position3D.x, layer.position3D.y, layer.position3D.z]
    : [
        layer.position.x,
        height + -layer.position.y * Math.tan(tilt) + 0.01,
        layer.position.y,
      ]

  return (
    <Decal
      position={position}
      rotation={rotation}
      scale={[layer.scale, layer.scale, 5]}
    >
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={layer.opacity}
        polygonOffset
        polygonOffsetFactor={-10}
        depthTest={true}
        depthWrite={false}
        {...(texture && { 'map-anisotropy': 16 })}
      />
    </Decal>
  )
}

export function KeyMesh({
  keyData,
  centerInScene = false,
}: {
  keyData: KeyData
  centerInScene?: boolean
}) {
  const ref = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [ghostTex, setGhostTex] = useState<THREE.Texture | null>(null)

  const { selectedKeyIds, setSelectedKeys, activeProject, placeStamp } =
    useProjectStore()
  const {
    stampMode,
    stampImageId,
    stampScope,
    stampSnapToCenter,
    stampHoverInfo,
    setStampHoverInfo,
  } = useUIStore()

  const isSelected = selectedKeyIds.includes(keyData.id)
  const isOutOfScope =
    stampMode &&
    stampScope === 'selected' &&
    !isSelected &&
    selectedKeyIds.length > 0
  const dimKey = stampMode && isOutOfScope

  const profile =
    keyData.profile || activeProject?.globalSettings.profile || 'Cherry'
  const finish =
    keyData.finish || activeProject?.globalSettings.finish || 'matte'

  const hU = keyData.heightUnits || 1
  const x = centerInScene ? 0 : keyData.col + keyData.widthUnits / 2
  const z = centerInScene ? 0 : keyData.row + hU / 2

  const width = keyData.widthUnits
  const depth = hU

  const rowStr = getRowStr(keyData)
  const profConfig = PROFILES[profile] || PROFILES['Cherry']
  const h = profConfig.heights[rowStr] || profConfig.heights['R3']
  const tilt = profConfig.tilts[rowStr] * (Math.PI / 180)

  const geometry = useMemo(() => {
    const cacheKey = `${width}-${depth}-${profile}-${rowStr}-${h}-${tilt}-${keyData.shape || 'standard'}`
    if (geometryCache.has(cacheKey)) {
      return geometryCache.get(cacheKey)!
    }

    const geosParams: {
      shape: THREE.Shape
      offsetY: number
      depth?: number
    }[] = []

    if (keyData.shape === 'iso-enter') {
      const pts = [
        [-0.67, 0.92],
        [-0.67, 0.08],
        [-0.42, 0.08],
        [-0.42, -0.92],
        [0.67, -0.92],
        [0.67, 0.92],
      ]
      geosParams.push({ shape: createShape(pts), offsetY: 0 })
    } else if (keyData.shape === 'big-ass-enter') {
      const pts = [
        [-0.295, 0.92],
        [-0.295, -0.08],
        [-1.045, -0.08],
        [-1.045, -0.92],
        [1.045, -0.92],
        [1.045, 0.92],
      ]
      geosParams.push({ shape: createShape(pts), offsetY: 0 })
    } else if (keyData.shape === 'stepped-caps') {
      // Extended left shape to overlap the right step
      const leftPts = [
        [-0.875 + 0.08, 0.5 - 0.08],
        [-0.875 + 0.08, -0.5 + 0.08],
        [0.375 + 0.08, -0.5 + 0.08],
        [0.375 + 0.08, 0.5 - 0.08],
      ]
      geosParams.push({ shape: createShape(leftPts), offsetY: 0, depth: 0.9 })

      // Extended right step to cleanly intersect inside the left shape
      // Lower depth keeps the base flush with the bottom while lowering the top.
      const rightPts = [
        [0.375 - 0.08, 0.5 - 0.08],
        [0.375 - 0.08, -0.5 + 0.08],
        [0.875 - 0.08, -0.5 + 0.08],
        [0.875 - 0.08, 0.5 - 0.08],
      ]
      geosParams.push({ shape: createShape(rightPts), offsetY: 0, depth: 0.45 })
    } else {
      const w = keyData.widthUnits
      const d = hU
      const pts = [
        [-w / 2 + 0.08, d / 2 - 0.08],
        [-w / 2 + 0.08, -d / 2 + 0.08],
        [w / 2 - 0.08, -d / 2 + 0.08],
        [w / 2 - 0.08, d / 2 - 0.08],
      ]
      geosParams.push({ shape: createShape(pts), offsetY: 0 })
    }

    const extrudedGeometries = geosParams.map((g) => {
      const geo = new THREE.ExtrudeGeometry(g.shape, {
        depth: g.depth ?? 0.9,
        bevelEnabled: true,
        bevelSegments: 16,
        bevelSize: 0.05,
        bevelThickness: 0.05,
      })

      geo.rotateX(-Math.PI / 2)
      geo.translate(0, -0.45 + g.offsetY, 0)

      const pos = geo.attributes.position
      const totalHalfWidth = width / 2
      const totalHalfDepth = depth / 2
      const insetX = (1.0 * (1 - profConfig.topScaleX)) / 2
      const insetZ = (1.0 * (1 - profConfig.topScaleZ)) / 2

      for (let i = 0; i < pos.count; i++) {
        let vx = pos.getX(i)
        let vy = pos.getY(i) - g.offsetY
        let vz = pos.getZ(i)

        const ny = vy + 0.5

        vx = vx * ((totalHalfWidth - insetX * ny) / totalHalfWidth)
        vz = vz * ((totalHalfDepth - insetZ * ny) / totalHalfDepth)

        let finalY = ny * h
        finalY += ny * (-vz * Math.tan(tilt))

        let dip = 0
        const nx = vx / totalHalfWidth
        const nz = vz / totalHalfDepth

        if (rowStr === 'SPACE') {
          dip = -Math.cos(nz * (Math.PI / 2)) * profConfig.scoopDepth
        } else {
          if (profConfig.type === 'cylindrical') {
            dip = Math.cos(nx * (Math.PI / 2)) * profConfig.scoopDepth
          } else {
            const dist = Math.sqrt(nx * nx + nz * nz)
            dip =
              Math.max(0, Math.cos(Math.min(dist, 1) * (Math.PI / 2))) *
              profConfig.scoopDepth
          }
        }

        let scoopBlend = 0
        if (ny > 0.8) {
          scoopBlend = (ny - 0.8) / 0.2
          scoopBlend = scoopBlend * scoopBlend * (3 - 2 * scoopBlend)
        }
        finalY -= scoopBlend * dip

        pos.setXYZ(i, vx, finalY + g.offsetY, vz)
      }

      geo.computeVertexNormals()
      return geo
    })

    const finalGeo =
      extrudedGeometries.length > 1
        ? mergeBufferGeometries(extrudedGeometries, false)
        : extrudedGeometries[0]

    geometryCache.set(cacheKey, finalGeo!)
    return finalGeo!
  }, [
    width,
    depth,
    profConfig,
    profile,
    rowStr,
    h,
    tilt,
    keyData.shape,
    keyData.widthUnits,
    hU,
  ])

  const roughness =
    finish === 'glossy' ? 0.1 : finish === 'transparent' ? 0.1 : 1.0
  const metalness = finish === 'glossy' ? 0.3 : 0

  useEffect(() => {
    if (stampMode && stampImageId) {
      const imgObj = activeProject?.images.find((i) => i.id === stampImageId)
      if (imgObj?.data) {
        new THREE.TextureLoader().load(imgObj.data, (t) => {
          t.colorSpace = THREE.SRGBColorSpace
          setGhostTex(t)
        })
      } else {
        setGhostTex(null)
      }
    } else {
      setGhostTex(null)
    }
  }, [stampMode, stampImageId, activeProject])

  const { scopeScale, scopeCenterX, scopeCenterZ } = useMemo(() => {
    let sScale = 1
    let sCenterX = 0
    let sCenterZ = 0

    if (stampMode && activeProject) {
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

      if (minX !== Infinity) {
        sScale = Math.min(maxX - minX, maxZ - minZ) * 0.9
        sCenterX = minX + (maxX - minX) / 2
        sCenterZ = minZ + (maxZ - minZ) / 2
      }
    }
    return {
      scopeScale: sScale,
      scopeCenterX: sCenterX,
      scopeCenterZ: sCenterZ,
    }
  }, [stampMode, activeProject, stampScope, selectedKeyIds])

  let ghostPos: [number, number, number] | null = null
  let ghostRotation: THREE.Euler | null = null
  if (stampMode && stampImageId && stampHoverInfo && !isOutOfScope) {
    let clickLayoutX = scopeCenterX
    let clickLayoutZ = scopeCenterZ
    let clickLayoutY = 0.5

    if (!stampSnapToCenter) {
      const hKey = activeProject?.keys.find(
        (k) => k.id === stampHoverInfo.hoveredKeyId,
      )
      if (hKey) {
        const hX = hKey.col + hKey.widthUnits / 2
        const hZ = hKey.row + (hKey.heightUnits || 1) / 2
        clickLayoutX = hX + stampHoverInfo.localPos[0]
        clickLayoutZ = hZ + stampHoverInfo.localPos[2]
        clickLayoutY = stampHoverInfo.localPos[1]
      }
    }

    const myX = keyData.col + keyData.widthUnits / 2
    const myZ = keyData.row + (keyData.heightUnits || 1) / 2

    const ghostZ = clickLayoutZ - myZ
    const ghostX = clickLayoutX - myX
    const gY = clickLayoutY

    ghostPos = [ghostX, gY, ghostZ]

    if (stampSnapToCenter) {
      const normalVec = new THREE.Vector3(0, 1, 0).applyAxisAngle(
        new THREE.Vector3(1, 0, 0),
        -tilt,
      )
      ghostRotation = getRotationFromNormal(normalVec, 0)
    } else {
      const normalVec = stampHoverInfo.localNormal
        ? new THREE.Vector3(...stampHoverInfo.localNormal)
        : new THREE.Vector3(0, 1, 0).applyAxisAngle(
            new THREE.Vector3(1, 0, 0),
            -tilt,
          )
      ghostRotation = getRotationFromNormal(normalVec, 0)
    }
  }

  const handlePointerMove = (e: any) => {
    if (stampMode && stampImageId && ref.current) {
      e.stopPropagation()
      const local = ref.current.worldToLocal(e.point.clone())
      const localNormal = e.face
        ? [e.face.normal.x, e.face.normal.y, e.face.normal.z]
        : undefined
      setStampHoverInfo({
        hoveredKeyId: keyData.id,
        localPos: [local.x, local.y, local.z],
        localNormal: localNormal as [number, number, number],
      })
    }
  }

  const handleClick = (e: any) => {
    e.stopPropagation()
    if (stampMode && stampImageId) {
      if (ref.current) {
        const local = ref.current.worldToLocal(e.point.clone())
        const localNormal = e.face
          ? [e.face.normal.x, e.face.normal.y, e.face.normal.z]
          : undefined
        placeStamp(
          keyData.id,
          [local.x, local.y, local.z],
          localNormal as [number, number, number],
        )
      }
      return
    }

    if (e.shiftKey) {
      setSelectedKeys((prev) =>
        prev.includes(keyData.id)
          ? prev.filter((id) => id !== keyData.id)
          : [...prev, keyData.id],
      )
    } else {
      setSelectedKeys([keyData.id])
    }
  }

  const baseColor = new THREE.Color(keyData.colour)
  if (dimKey) {
    baseColor.lerp(new THREE.Color('#000000'), 0.5)
  }

  const getLabelPos = (pos: string): [number, number, number] => {
    const insetX = (1.0 * (1 - profConfig.topScaleX)) / 2
    const insetZ = (1.0 * (1 - profConfig.topScaleZ)) / 2
    const tw = width - 2 * insetX
    const td = depth - 2 * insetZ
    const offsetX = tw / 2 - 0.15
    const offsetZ = td / 2 - 0.15
    let lx = 0
    let lz = 0

    if (pos.includes('left')) lx = -offsetX
    if (pos.includes('right')) lx = offsetX
    if (pos.includes('top')) lz = -offsetZ
    if (pos.includes('bottom')) lz = offsetZ

    if (keyData.shape === 'stepped-caps') {
      lx -= 0.25
    }

    if (keyData.shape === 'big-ass-enter') {
      lx = 0
      lz = 0.4
    }

    const ly = h + -lz * Math.tan(tilt) + 0.02
    return [lx, ly, lz]
  }

  const labelPos = getLabelPos(keyData.labelStyle.position)

  return (
    <group position={[x, 0, z]}>
      <mesh
        ref={ref}
        geometry={geometry}
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          if (!stampMode) document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          if (!stampMode) document.body.style.cursor = 'auto'
        }}
      >
        <meshStandardMaterial
          color={baseColor}
          roughness={roughness}
          metalness={metalness}
          transparent={finish === 'transparent'}
          opacity={finish === 'transparent' ? 0.6 : 1}
          emissive={hovered && !isOutOfScope ? '#ffffff' : '#000000'}
          emissiveIntensity={hovered && !isOutOfScope ? 0.05 : 0}
        />
        {keyData.layers
          .filter((l) => l.visible && l.imageData)
          .map((layer) => (
            <LayerDecal key={layer.id} layer={layer} height={h} tilt={tilt} />
          ))}
        {stampMode &&
          stampImageId &&
          ghostTex &&
          ghostPos &&
          ghostRotation &&
          !isOutOfScope && (
            <Decal
              position={ghostPos}
              rotation={ghostRotation}
              scale={[scopeScale, scopeScale, 5]}
            >
              <meshStandardMaterial
                map={ghostTex}
                transparent
                opacity={0.5}
                polygonOffset
                polygonOffsetFactor={-10}
                depthTest={true}
                depthWrite={false}
                {...(ghostTex && { 'map-anisotropy': 16 })}
              />
            </Decal>
          )}
      </mesh>

      {isSelected && !centerInScene && (
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[width + 0.04, h + 0.05, depth + 0.04]} />
          <meshBasicMaterial color="#3B82F6" wireframe />
        </mesh>
      )}

      {keyData.label && (
        <Text
          position={labelPos}
          rotation={[-Math.PI / 2 - tilt, 0, 0]}
          fontSize={keyData.labelStyle.fontSize / 50}
          color={keyData.labelStyle.color}
          anchorX={
            keyData.labelStyle.position.includes('left')
              ? 'left'
              : keyData.labelStyle.position.includes('right')
                ? 'right'
                : 'center'
          }
          anchorY="middle"
          depthOffset={-1}
        >
          {keyData.label}
        </Text>
      )}
    </group>
  )
}
