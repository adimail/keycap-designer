import { useRef } from 'react'
import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import { v4 as uuidv4 } from 'uuid'
import { Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { ActionButton } from '@/components/ActionButton'
import { motion } from 'framer-motion'

export function ImagesTab() {
  const { activeProject, addImage, deleteImage, selectedKeyIds, globalImages } =
    useProjectStore()
  const { stampMode, stampImageId, setStampMode } = useUIStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
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
      loading: 'Processing images...',
      success: `${files.length} image(s) added to library`,
      error: 'Error uploading images',
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getUsageCount = (imgId: string) => {
    if (!activeProject) return 0
    let count = 0
    activeProject.keys.forEach((k) => {
      if (k.layers.some((l) => l.imageData === imgId)) count++
    })
    return count
  }

  const handleDelete = async (id: string) => {
    if (
      window.confirm('Delete this image? It will be removed from all keys.')
    ) {
      const img = globalImages.find((i) => i.id === id)
      await deleteImage(id)
      if (stampImageId === id) {
        setStampMode(false)
      }
      toast.success(`Deleted "${img?.name || 'image'}" from library`)
    }
  }

  const handleStamp = (imgId: string) => {
    setStampMode(true, imgId, selectedKeyIds.length > 0 ? 'selected' : 'all')
  }

  return (
    <div className="mt-4 flex flex-col h-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/png, image/jpeg, image/svg+xml, image/webp"
        multiple
        className="hidden"
      />
      <ActionButton
        type="button"
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        size="sm"
        className="w-full mb-4 bg-[var(--line)]"
      >
        <Plus className="w-4 h-4" /> Upload Images
      </ActionButton>
      <motion.div
        className="grid grid-cols-2 gap-2 overflow-y-auto pb-10"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.04 } },
        }}
        initial="hidden"
        animate="visible"
      >
        {globalImages.map((img) => {
          const usage = getUsageCount(img.id)
          const isStampingThis = stampMode && stampImageId === img.id
          return (
            <motion.div
              key={img.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 260, damping: 24 },
                },
              }}
              whileHover={{ y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
              className={`relative group border rounded overflow-hidden aspect-square bg-[var(--foam)] ${isStampingThis ? 'border-[var(--color-action)] shadow-[0_0_0_2px_var(--color-action)]' : 'border-[var(--line)]'}`}
            >
              <img
                src={img.data}
                alt={img.name}
                className="w-full h-full object-contain p-1 cursor-pointer"
                onClick={() => handleStamp(img.id)}
              />
              {usage > 0 && (
                <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded pointer-events-none">
                  {usage} uses
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 pointer-events-none">
                <ActionButton
                  type="button"
                  onClick={() => handleStamp(img.id)}
                  variant="primary"
                  size="sm"
                  className="pointer-events-auto px-2 py-1 text-[10px]"
                >
                  {isStampingThis ? 'Stamping...' : 'Stamp'}
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  variant="danger"
                  size="n"
                  className="p-1 bg-red-500 text-white rounded pointer-events-auto"
                >
                  <Trash2 className="w-3 h-3" />
                </ActionButton>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
