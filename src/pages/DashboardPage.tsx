import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { ArrowDownWideNarrow, Check, Images, LayoutGrid, Search, ShieldCheck } from 'lucide-react'
import Header from '../components/Header.tsx'
import Dropzone from '../components/Dropzone.tsx'
import EmptyState from '../components/EmptyState.tsx'
import FileCard from '../components/FileCard.tsx'
import ImageViewer from '../components/ImageViewer.tsx'
import { useFiles } from '../context/FilesContext.tsx'
import type { CloudFile } from '../types.ts'

type Filter = 'all' | 'images'
type SortOrder = 'newest' | 'oldest'

export default function DashboardPage() {
  const { files, ready, removeFile } = useFiles()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [viewingFile, setViewingFile] = useState<CloudFile | null>(null)
  const visibleFiles = useMemo(() => files.filter((file) => {
    const matchesType = filter === 'all' || file.type.startsWith('image/')
            return matchesType && file.name.toLowerCase().includes(query.trim().toLowerCase())
  }).sort((a, b) => sortOrder === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt), [files, filter, query, sortOrder])

  return (
    <div className="dashboard-shell">
      <Header />
      <main className="dashboard-main">
        <div className="page-heading"><div><span className="eyebrow">ВАШЕ ПРОСТРАНСТВО</span><h1>Мои файлы</h1><p>Храните памятные моменты в одном месте.</p></div><div className="storage-badge"><ShieldCheck size={16} /> Только для вас</div></div>
        <Dropzone />
        <section className="library-section">
          <div className="library-heading"><div><h2>Библиотека</h2><span>{files.length} {files.length === 1 ? 'файл' : 'файлов'}</span></div><div className="library-tools"><label className="search-field"><Search size={16} /><input aria-label="Поиск по файлам" placeholder="Найти файл" value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} /></label><div className="filter-tabs" role="tablist" aria-label="Фильтр файлов"><button className={filter === 'all' ? 'active' : ''} type="button" role="tab" aria-selected={filter === 'all'} onClick={() => setFilter('all')}><LayoutGrid size={15} /> Все</button><button className={filter === 'images' ? 'active' : ''} type="button" role="tab" aria-selected={filter === 'images'} onClick={() => setFilter('images')}><Images size={15} /> Фото</button></div><label className="sort-field"><ArrowDownWideNarrow size={15} /><select aria-label="Сортировка по дате добавления" value={sortOrder} onChange={(event: ChangeEvent<HTMLSelectElement>) => setSortOrder(event.target.value as SortOrder)}><option value="newest">Сначала новые</option><option value="oldest">Сначала старые</option></select></label></div></div>
          {!ready ? <div className="library-loading"><span className="loading-dot" /> Загружаем библиотеку…</div> : visibleFiles.length ? <div className="file-grid">{visibleFiles.map((file) => <FileCard key={file.id} file={file} onDelete={removeFile} onView={setViewingFile} />)}</div> : files.length ? <div className="search-empty"><Search size={20} /><span>Ничего не найдено. Попробуйте изменить запрос.</span></div> : <EmptyState />}
        </section>
        <footer className="dashboard-footer"><span><Check size={14} /> Ваши файлы сохранены на этом устройстве</span><span>IndexedDB · личное хранилище</span></footer>
      </main>
      {viewingFile && <ImageViewer file={viewingFile} onClose={() => setViewingFile(null)} />}
    </div>
  )
}
