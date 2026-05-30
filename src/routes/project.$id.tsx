import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { TopBar } from '../components/editor/TopBar'
import { LeftPanel } from '../components/editor/LeftPanel'
import { RightPanel } from '../components/editor/RightPanel'
import { Viewport3D } from '../components/editor/Viewport3D'
import { getProject } from '../lib/db'
import { useProjectStore } from '../store/useProjectStore'
import { useUIStore } from '../store/useUIStore'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { UploadCloud } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const Route = createFileRoute('/project/$id')({
  component: EditorRoute,
})

function EditorRoute() {
  const { id } = Route.useParams()
  const { setActiveProject, loadGlobalImages, addImage } = useProjectStore()
  const { setRightPanelTab } = useUIStore()
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        await loadGlobalImages()
        const proj = await getProject(id)
        if (proj) {
          setActiveProject(proj)
        }
      } catch {
        toast.error('Failed to load project')
      }
    }
    load()
  }, [id, setActiveProject, loadGlobalImages])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/'),
    )

    if (!files.length) return

    const uploadPromises = files.map((file) => {
      if (file.size > 5 * 1024 * 1024) {
        return Promise.reject(new Error('File too large'))
      }
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (ev) => {
          if (ev.target?.result) {
            const img = new Image()
            img.onload = () => {
              const aspectRatio = img.width / img.height
              addImage({
                id: uuidv4(),
                name: file.name,
                data: ev?.target?.result as string,
                aspectRatio,
              })
              resolve(file.name)
            }
            img.onerror = () => reject(new Error('Failed to load image'))
            img.src = ev.target.result as string
          } else {
            reject(new Error('Failed to read file'))
          }
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
    })

    toast.promise(Promise.all(uploadPromises), {
      loading: 'Processing dropped images...',
      success: `${files.length} image(s) added to library`,
      error: 'Error uploading dropped images',
    })

    setRightPanelTab('images')
  }

  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden bg-[var(--bg-base)] relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative">
        <LeftPanel />
        <Viewport3D />
        <RightPanel />
      </div>

      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
          >
            <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-[var(--color-action)] rounded-3xl bg-[var(--surface-strong)]">
              <UploadCloud className="w-20 h-20 text-[var(--color-action)] mb-4" />
              <h2 className="text-2xl font-bold text-[var(--sea-ink)]">
                Drop images to upload
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
