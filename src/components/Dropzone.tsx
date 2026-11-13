import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { CloudUpload, ImagePlus } from 'lucide-react'
import { useFiles } from '../context/FilesContext.tsx'
import { MAX_FILE_SIZE, readAsDataUrl, storageErrorMessage } from '../utils/files.ts'

export default function Dropzone() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState<boolean>(false)
  const [loading, setLoading] = useState(0)
  const [message, setMessage] = useState<string>('')
  const { addFile } = useFiles()

  async function handleFiles(fileList: FileList | null) {
    const selected = Array.from(fileList || [])
    if (!selected.length) return
    setMessage('')
    setLoading((count) => count + selected.length)
    for (const file of selected) {
      try {
        if (!file.type.startsWith('image/')) throw new Error(`«${file.name}» — можно загружать только изображения.`)
        if (file.size > MAX_FILE_SIZE) throw new Error(`«${file.name}» больше 7 МБ. Выберите файл поменьше.`)
        const dataUrl = await readAsDataUrl(file)
        await addFile({ id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type, dataUrl, createdAt: Date.now() })
      } catch (error) {
        const message = error instanceof Error && error.message.startsWith('«') ? error.message : storageErrorMessage(error)
        setMessage((current) => [current, message].filter(Boolean).join(' '))
      } finally {
        setLoading((count) => count - 1)
      }
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <section className={`dropzone ${dragging ? 'dropzone-active' : ''}`} onDragOver={(event: DragEvent<HTMLElement>) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event: DragEvent<HTMLElement>) => { event.preventDefault(); setDragging(false); handleFiles(event.dataTransfer.files) }}>
      <input ref={inputRef} className="sr-only" type="file" accept="image/*" multiple onChange={(event: ChangeEvent<HTMLInputElement>) => handleFiles(event.target.files)} />
      <span className="upload-icon"><CloudUpload size={25} strokeWidth={1.8} /></span>
      <h2>Загрузите изображения в облако</h2>
      <p>Перетащите файлы в эту область или выберите их на устройстве</p>
      <button className="button-primary" type="button" onClick={() => inputRef.current?.click()}><ImagePlus size={17} /> Выбрать изображения</button>
      <span className="upload-hint">PNG, JPG, GIF или WEBP · до 7 МБ на файл</span>
      {loading > 0 && <span className="upload-progress">Обрабатываем файлов: {loading}</span>}
      {message && <div className="upload-error" role="alert">{message}</div>}
    </section>
  )
}
