import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText(/Vite \+ React/)).toBeInTheDocument()
  })

  it('renders the count button', () => {
    render(<App />)
    expect(screen.getByText(/count is 0/)).toBeInTheDocument()
  })

  it('increments count when button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const button = screen.getByText(/count is/)
    await user.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/count is 1/)).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    render(<App />)
    expect(screen.getByText(/Loading/)).toBeInTheDocument()
  })
})
