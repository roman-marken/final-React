import { useMemo, useState } from 'react'
import { Check, Images, LayoutGrid, Search, ShieldCheck } from 'lucide-react'
import Header from '../components/Header.jsx'
import Dropzone from '../components/Dropzone.jsx'
import EmptyState from '../components/EmptyState.jsx'
import FileCard from '../components/FileCard.jsx'
import { useFiles } from '../context/FilesContext.jsx'

export default function DashboardPage() {
  const { files, ready, removeFile } = useFiles()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const visibleFiles = useMemo(() => files.filter((file) => {
    const matchesType = filter === 'all' || file.type.startsWith('image/')
    return matchesType && file.name.toLowerCase().includes(query.trim().toLowerCase())
  }), [files, filter, query])

  return (
    <div className="dashboard-shell">
      <Header />
      <main className="dashboard-main">
        <div className="page-heading"><div><span className="eyebrow">ВАШЕ ПРОСТРАНСТВО</span><h1>Мои файлы</h1><p>Храните памятные моменты в одном месте.</p></div><div className="storage-badge"><ShieldCheck size={16} /> Только для вас</div></div>
        <Dropzone />
        <section className="library-section">
          <div className="library-heading"><div><h2>Библиотека</h2><span>{files.length} {files.length === 1 ? 'файл' : 'файлов'}</span></div><div className="library-tools"><label className="search-field"><Search size={16} /><input aria-label="Поиск по файлам" placeholder="Найти файл" value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="filter-tabs" role="tablist" aria-label="Фильтр файлов"><button className={filter === 'all' ? 'active' : ''} type="button" role="tab" aria-selected={filter === 'all'} onClick={() => setFilter('all')}><LayoutGrid size={15} /> Все</button><button className={filter === 'images' ? 'active' : ''} type="button" role="tab" aria-selected={filter === 'images'} onClick={() => setFilter('images')}><Images size={15} /> Фото</button></div></div></div>
          {!ready ? <div className="library-loading"><span className="loading-dot" /> Загружаем библиотеку…</div> : visibleFiles.length ? <div className="file-grid">{visibleFiles.map((file) => <FileCard key={file.id} file={file} onDelete={removeFile} />)}</div> : files.length ? <div className="search-empty"><Search size={20} /><span>Ничего не найдено. Попробуйте изменить запрос.</span></div> : <EmptyState />}
        </section>
        <footer className="dashboard-footer"><span><Check size={14} /> Ваши файлы сохранены на этом устройстве</span><span>IndexedDB · личное хранилище</span></footer>
      </main>
    </div>
  )
}
