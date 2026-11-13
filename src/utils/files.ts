export const MAX_FILE_SIZE = 7 * 1024 * 1024

export function formatSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} КБ`
    : `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

export function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => typeof reader.result === 'string'
      ? resolve(reader.result)
      : reject(new Error('Не удалось преобразовать файл в изображение'))
    reader.onerror = () => reject(reader.error || new Error('Не удалось прочитать файл'))
    reader.onabort = () => reject(new Error('Чтение файла отменено'))
    reader.readAsDataURL(file)
  })
}

export function storageErrorMessage(error: unknown): string {
  if (error instanceof Error && error.name === 'QuotaExceededError') return 'В хранилище браузера закончилось место. Удалите несколько файлов и попробуйте ещё раз.'
  return 'Не удалось сохранить файл в хранилище браузера. Проверьте, что в браузере разрешено хранение данных.'
}
