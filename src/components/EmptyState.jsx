import { Images } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Images size={25} strokeWidth={1.7} /></span>
      <p>У вас пока нет файлов</p>
      <span>Загрузите первое изображение — оно появится здесь</span>
    </div>
  )
}
