import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import EmptyState from './EmptyState.jsx'

describe('EmptyState', () => {
  it('показывает сообщение, когда файлов ещё нет', () => {
    render(<EmptyState />)
    expect(screen.getByText('У вас пока нет файлов')).toBeInTheDocument()
  })
})
