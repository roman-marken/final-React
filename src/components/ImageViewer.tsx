import { useEffect } from 'react'
import { X } from 'lucide-react'
import { formatSize } from '../utils/files.ts'
import type { CloudFile } from '../types.ts'

type ImageViewerProps = { file: CloudFile; onClose: () => void }

export default function ImageViewer({ file, onClose }: ImageViewerProps) {
  useEffect(() => {
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const addedAt = new Date(file.createdAt).toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })

  return (
    <div className="image-viewer-backdrop" onClick={onClose}>
      <section className="image-viewer" role="dialog" aria-modal="true" aria-label={`Просмотр фото: ${file.name}`} onClick={(event) => event.stopPropagation()}>
        <div className="image-viewer-toolbar">
          <div><h2 title={file.name}>{file.name}</h2><span>{addedAt} · {formatSize(file.size)}</span></div>
          <button className="image-viewer-close" type="button" aria-label="Закрыть просмотр" onClick={onClose}><X size={21} /></button>
        </div>
        <img className="image-viewer-image" src={file.dataUrl} alt={file.name} />
      </section>
    </div>
  )
}
