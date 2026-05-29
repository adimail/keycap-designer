import { Link } from '@tanstack/react-router'
import { Copy, Trash2, MoreVertical, Edit2, FolderOpen } from 'lucide-react'
import type { Project } from '../../types'
import { timeAgo } from '@/utils/date'
import { useState } from 'react'
import { ActionButton } from '@/components/ActionButton'
import { ActionLink } from '@/components/ActionLink'
import { motion, AnimatePresence } from 'framer-motion'

export function ProjectCard({
  project,
  onDelete,
  onDuplicate,
  onRename,
}: {
  project: Project
  onDelete: (id: string) => void
  onDuplicate: (p: Project) => void
  onRename: (id: string, newName: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(project.name)

  return (
    <motion.div
      className="group border border-[var(--line)] rounded-xl bg-[var(--surface)] relative overflow-hidden"
      onMouseLeave={() => setMenuOpen(false)}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Thumbnail */}
      <Link
        to="/project/$id"
        params={{ id: project.id }}
        className="block relative"
      >
        <motion.div
          className="h-36 bg-gradient-to-br from-[var(--foam)] to-[var(--sand)] flex items-center justify-center overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              className="w-full h-full object-cover"
              alt=""
            />
          ) : (
            <motion.span
              className="opacity-20 text-3xl font-semibold tracking-widest"
              animate={{ opacity: [0.15, 0.25, 0.15] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              KF
            </motion.span>
          )}
        </motion.div>
        {/* Key count badge */}
        <span className="absolute top-2.5 right-2.5 bg-white/80 dark:bg-black/40 backdrop-blur-sm text-[11px] font-medium px-2 py-0.5 rounded-md border border-black/10 dark:border-white/10">
          {project.keys.length} keys
        </span>
      </Link>

      {/* Info */}
      <div className="px-3.5 pt-3 pb-2.5">
        {isEditing ? (
          <input
            autoFocus
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={() => {
              onRename(project.id, tempName)
              setIsEditing(false)
            }}
            onKeyDown={(e) =>
              e.key === 'Enter' && onRename(project.id, tempName)
            }
            className="w-full bg-transparent border-b border-[var(--line)] outline-none text-sm font-medium pb-0.5"
          />
        ) : (
          <div className="text-sm font-medium truncate leading-snug">
            {project.name}
          </div>
        )}
        <div className="text-xs text-[var(--muted)] mt-1">
          {timeAgo(project.updatedAt)}
        </div>
      </div>

      {/* Action strip */}
      <div className="border-t border-[var(--line)] flex items-center px-1 py-1 gap-0.5">
        <ActionLink
          to="/project/$id"
          params={{ id: project.id }}
          variant="ghost"
          size="n"
          className="flex-1 px-2 py-1.5 rounded-lg text-xs text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--line)] normal-case tracking-normal"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          Open
        </ActionLink>
        <ActionButton
          type="button"
          onClick={() => onDuplicate(project)}
          variant="ghost"
          size="n"
          className="flex-1 px-2 py-1.5 rounded-lg text-xs text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--line)] normal-case tracking-normal"
        >
          <Copy className="w-3.5 h-3.5" />
          Duplicate
        </ActionButton>

        {/* Overflow menu */}
        <div className="relative">
          <ActionButton
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            variant="ghost"
            size="n"
            className="w-7 h-7 rounded-lg hover:bg-[var(--line)] transition-colors text-[var(--muted)] hover:text-[var(--text)]"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </ActionButton>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="absolute right-0 bottom-full mb-1.5 w-36 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-[var(--line)] z-20 py-1 overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <ActionButton
                  type="button"
                  onClick={() => {
                    setIsEditing(true)
                    setMenuOpen(false)
                  }}
                  variant="ghost"
                  size="n"
                  className="w-full justify-start gap-2 px-3 py-1.5 text-xs hover:bg-[var(--line)] transition-colors normal-case tracking-normal"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Rename
                </ActionButton>
                <div className="my-1 border-t border-[var(--line)]" />
                <ActionButton
                  type="button"
                  onClick={() => onDelete(project.id)}
                  variant="danger"
                  size="n"
                  className="w-full justify-start gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors normal-case tracking-normal border-0"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </ActionButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
