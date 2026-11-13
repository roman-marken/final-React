import { memo, useState } from 'react'
import { Image, LoaderCircle, MoreHorizontal, Trash2 } from 'lucide-react'
import { formatSize } from '../utils/files.ts'
import type { CloudFile } from '../types.ts'

type FileCardProps = { file: CloudFile; onDelete: (id: string) => void; onView: (file: CloudFile) => void }

function FileCard({ file, onDelete, onView }: FileCardProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  return (
    <article className="file-card">
      <div className="file-preview">
        <button className="file-preview-button" type="button" aria-label={`Открыть фото: ${file.name}`} onClick={() => onView(file)}>
          <img src={file.dataUrl} alt="" loading="lazy" />
        </button>
        <div className="preview-actions">
          <button className="icon-button" type="button" aria-label={`Действия: ${file.name}`} onClick={() => setMenuOpen(!menuOpen)}>
            <MoreHorizontal size={20} />
          </button>
          {menuOpen && <button className="delete-menu" type="button" onClick={() => onDelete(file.id)}><Trash2 size={15} /> Удалить</button>}
        </div>
      </div>
      <div className="file-info">
        <span className="file-type-icon"><Image size={15} /></span>
        <div className="file-copy"><p title={file.name}>{file.name}</p><span>{formatSize(file.size)}</span></div>
        <button className="delete-button" type="button" aria-label={`Удалить ${file.name}`} onClick={() => onDelete(file.id)}><Trash2 size={16} /></button>
      </div>
    </article>
  )
}

export default memo(FileCard)

export function FileLoadingCard() {
  return <div className="loading-card"><LoaderCircle className="spin" size={27} /><span>Сохраняем изображение…</span></div>
}
