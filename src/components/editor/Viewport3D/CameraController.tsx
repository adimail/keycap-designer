import { useThree, useFrame } from '@react-three/fiber'
import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function CameraController({
  controlsRef,
  isStudioMode,
}: {
  controlsRef: any
  isStudioMode?: boolean
}) {
  const { cameraCommand, setCameraCommand } = useUIStore()
  const { activeProject, selectedKeyIds } = useProjectStore()
  const { camera, gl, size } = useThree()
  const studioTarget = useRef(new THREE.Vector3(0, 0, 0))
  const animatedTarget = useRef(new THREE.Vector3(0, 0, 0))
  const animatedPosition = useRef(new THREE.Vector3(0, 10, 15))
  const isAnimatingCamera = useRef(false)

  const getVisibleKeyboardBounds = () => {
    const visibleKeys = activeProject?.keys.filter((key) => key.visible) || []

    if (visibleKeys.length === 0) {
      return { width: 12, depth: 5 }
    }

    const bounds = visibleKeys.reduce(
      (acc, key) => {
        const height = key.heightUnits || 1
        return {
          minX: Math.min(acc.minX, key.col),
          maxX: Math.max(acc.maxX, key.col + key.widthUnits),
          minZ: Math.min(acc.minZ, key.row),
          maxZ: Math.max(acc.maxZ, key.row + height),
        }
      },
      {
        minX: Infinity,
        maxX: -Infinity,
        minZ: Infinity,
        maxZ: -Infinity,
      },
    )

    return {
      width: Math.max(bounds.maxX - bounds.minX, 1),
      depth: Math.max(bounds.maxZ - bounds.minZ, 1),
    }
  }

  const queueFitKeyboardView = () => {
    const { width, depth } = getVisibleKeyboardBounds()
    const aspect = size.width / Math.max(size.height, 1)
    const verticalFov = THREE.MathUtils.degToRad(
      'fov' in camera ? camera.fov : 40,
    )
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect)
    const radius = Math.sqrt(width * width + depth * depth) / 2
    const distance =
      Math.max(
        radius / Math.sin(verticalFov / 2),
        radius / Math.sin(horizontalFov / 2),
      ) * 1.18
    const viewDirection = new THREE.Vector3(0, 0.62, 0.78).normalize()

    animatedTarget.current.set(0, 0, 0)
    animatedPosition.current.copy(
      animatedTarget.current
        .clone()
        .add(viewDirection.multiplyScalar(Math.max(distance, 9))),
    )
    isAnimatingCamera.current = true
  }

  useEffect(() => {
    if (!cameraCommand) return

    if (cameraCommand === 'center') {
      queueFitKeyboardView()
      setCameraCommand(null)
    }

    if (cameraCommand === 'zoom-in' || cameraCommand === 'zoom-out') {
      const zoomFactor = cameraCommand === 'zoom-in' ? 0.8 : 1.25
      if (camera.type === 'PerspectiveCamera') {
        const target = controlsRef.current?.target || new THREE.Vector3(0, 0, 0)
        const direction = camera.position.clone().sub(target)
        animatedTarget.current.copy(target)
        animatedPosition.current
          .copy(target)
          .add(direction.multiplyScalar(zoomFactor))
        isAnimatingCamera.current = true
      }
      setCameraCommand(null)
    }

    if (cameraCommand === 'screenshot') {
      const link = document.createElement('a')
      const safeName =
        activeProject?.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() ||
        'keyforge-layout'
      link.setAttribute('download', `${safeName}.png`)
      link.setAttribute(
        'href',
        gl.domElement
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream'),
      )
      link.click()
      setCameraCommand(null)
    }
  }, [
    cameraCommand,
    camera,
    gl,
    controlsRef,
    activeProject,
    setCameraCommand,
    size.width,
    size.height,
  ])

  useEffect(() => {
    if (isStudioMode && selectedKeyIds.length === 1 && activeProject) {
      const key = activeProject.keys.find((k) => k.id === selectedKeyIds[0])
      if (key) {
        let minX = Infinity,
          maxX = -Infinity,
          minZ = Infinity,
          maxZ = -Infinity

        activeProject.keys.forEach((k) => {
          if (!k.visible) return
          const left = k.col
          const right = k.col + k.widthUnits
          const top = k.row
          const bottom = k.row + (k.heightUnits || 1)
          if (left < minX) minX = left
          if (right > maxX) maxX = right
          if (top < minZ) minZ = top
          if (bottom > maxZ) maxZ = bottom
        })

        if (minX === Infinity) {
          minX = 0
          maxX = 0
          minZ = 0
          maxZ = 0
        }

        const boardCenterX = minX + (maxX - minX) / 2
        const boardCenterZ = minZ + (maxZ - minZ) / 2

        const keyWorldX = key.col + key.widthUnits / 2 - boardCenterX
        const keyWorldZ = key.row + (key.heightUnits || 1) / 2 - boardCenterZ

        studioTarget.current.set(keyWorldX, 0, keyWorldZ)
      }
    }
  }, [isStudioMode, selectedKeyIds, activeProject])

  useFrame((_, delta) => {
    if (isAnimatingCamera.current && controlsRef.current) {
      const alpha = 1 - Math.exp(-delta * 6)
      camera.position.lerp(animatedPosition.current, alpha)
      controlsRef.current.target.lerp(animatedTarget.current, alpha)
      camera.lookAt(controlsRef.current.target)
      controlsRef.current.update()

      const positionSettled =
        camera.position.distanceToSquared(animatedPosition.current) < 0.0004
      const targetSettled =
        controlsRef.current.target.distanceToSquared(animatedTarget.current) <
        0.0004

      if (positionSettled && targetSettled) {
        camera.position.copy(animatedPosition.current)
        controlsRef.current.target.copy(animatedTarget.current)
        controlsRef.current.update()
        isAnimatingCamera.current = false
      }

      return
    }

    if (isStudioMode && controlsRef.current) {
      const diff = new THREE.Vector3().subVectors(
        studioTarget.current,
        controlsRef.current.target,
      )

      if (diff.lengthSq() > 0.0001) {
        const step = diff.multiplyScalar(Math.min(delta * 8, 1))
        controlsRef.current.target.add(step)
        camera.position.add(step)
        controlsRef.current.update()
      }
    }
  })

  return null
}
