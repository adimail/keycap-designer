import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Project } from '../types'

interface KeyForgeDB extends DBSchema {
  projects: {
    key: string
    value: Project
  }
}

let dbPromise: Promise<IDBPDatabase<KeyForgeDB>> | null = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<KeyForgeDB>('keyforge-db', 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

export async function saveProject(project: Project) {
  const db = await getDB()
  await db.put('projects', project)
}

export async function getProject(id: string) {
  const db = await getDB()
  return db.get('projects', id)
}

export async function getAllProjects() {
  const db = await getDB()
  return db.getAll('projects')
}

export async function deleteProject(id: string) {
  const db = await getDB()
  await db.delete('projects', id)
}
