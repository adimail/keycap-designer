import { useRef } from 'react'
import { useProjectStore } from '@/store/useProjectStore'
import { useUIStore } from '@/store/useUIStore'
import { v4 as uuidv4 } from 'uuid'
import { Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { ActionButton } from '@/components/ActionButton'

export function ImagesTab() {
  const { activeProject, addImage, deleteImage, selectedKeyIds } = useProjectStore()
  const { stampMode, stampImageId, setStampMode } = useUIStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File too large', {
        description: 'Maximum size is 5MB',
      })
    }

    const reader = new FileReader()
    const upload = new Promise<string>((resolve, reject) => {
      reader.onload = (ev) => {
        if (ev.target?.result) {
          addImage({
            id: uuidv4(),
            name: file.name,
            data: ev.target.result as string,
          })
          resolve(file.name)
        } else {
          reject(new Error('Failed to read file'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })

    toast.promise(upload, {
      loading: 'Processing image...',
      success: (name) => `Added ${name} to library`,
      error: 'Error uploading image',
    })
  }

  const getUsageCount = (imgId: string) => {
    if (!activeProject) return 0
    let count = 0
    activeProject.keys.forEach((k) => {
      if (k.layers.some((l) => l.imageData === imgId)) count++
    })
    return count
  }

  const handleDelete = (id: string) => {
    if (
      window.confirm('Delete this image? It will be removed from all keys.')
    ) {
      const img = activeProject?.images.find((i) => i.id === id)
      deleteImage(id)
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
        className="hidden"
      />
      <ActionButton
        type="button"
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        size="sm"
        className="w-full mb-4 bg-[var(--line)]"
      >
        <Plus className="w-4 h-4" /> Upload Image
      </ActionButton>
      <div className="grid grid-cols-2 gap-2 overflow-y-auto pb-10">
        {(activeProject?.images || []).map((img) => {
          const usage = getUsageCount(img.id)
          const isStampingThis = stampMode && stampImageId === img.id
          return (
            <div
              key={img.id}
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
