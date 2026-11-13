import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import localforage from 'localforage'
import type { ReactNode } from 'react'
import type { CloudFile, CloudFileMetadata } from '../types.ts'

const storage = localforage.createInstance({ name: 'mini-cloud', storeName: 'images' })
const indexKey = 'files-index'
type FilesContextValue = {
  files: CloudFile[]
  ready: boolean
  addFile: (file: CloudFile) => Promise<void>
  removeFile: (id: string) => Promise<void>
}
const FilesContext = createContext<FilesContextValue | null>(null)

export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<CloudFile[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    async function loadFiles() {
      try {
        const index = await storage.getItem<CloudFileMetadata[]>(indexKey) || []
        const saved = await Promise.all(index.map(async (file): Promise<CloudFile | null> => {
          const dataUrl = await storage.getItem<string>(`file:${file.id}`)
          return dataUrl ? { ...file, dataUrl } : null
        }))
        if (active) setFiles(saved.filter((file): file is CloudFile => file !== null && Boolean(file.dataUrl)))
      } catch (error) {
        console.error('Не удалось прочитать файлы из IndexedDB', error)
      } finally {
        if (active) setReady(true)
      }
    }
    loadFiles()
    return () => { active = false }
  }, [])

  const addFile = useCallback(async (file: CloudFile) => {
    const metadata: CloudFileMetadata = { id: file.id, name: file.name, size: file.size, type: file.type, createdAt: file.createdAt }
    await storage.setItem(`file:${file.id}`, file.dataUrl)
    try {
      const index = await storage.getItem<CloudFileMetadata[]>(indexKey) || []
      await storage.setItem(indexKey, [metadata, ...index])
      setFiles((current) => [file, ...current])
    } catch (error) {
      await storage.removeItem(`file:${file.id}`)
      throw error
    }
  }, [])

  const removeFile = useCallback(async (id: string) => {
    const current = files
    setFiles((items) => items.filter((file) => file.id !== id))
    try {
      const index = await storage.getItem<CloudFileMetadata[]>(indexKey) || []
      await storage.setItem(indexKey, index.filter((file) => file.id !== id))
      await storage.removeItem(`file:${id}`)
    } catch (error) {
      setFiles(current)
      throw error
    }
  }, [files])

  return <FilesContext.Provider value={{ files, ready, addFile, removeFile }}>{children}</FilesContext.Provider>
}

export function useFiles() {
  const context = useContext(FilesContext)
  if (!context) throw new Error('useFiles должен вызываться внутри FilesProvider')
  return context
}
