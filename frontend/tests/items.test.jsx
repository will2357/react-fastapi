import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Items from '../src/pages/Items';

vi.mock('../src/services/api', () => ({
  createItem: vi.fn(),
}));

import * as api from '../src/services/api';

describe('Items', () => {
  const mockCreateItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    api.createItem.mockResolvedValue({ message: 'Item created successfully' });
  });

  it('renders items heading', () => {
    render(<Items />);
    
    expect(screen.getByRole('heading', { name: /items/i })).toBeInTheDocument();
  });

  it('renders Create New Item heading', () => {
    render(<Items />);
    
    expect(screen.getByRole('heading', { name: /create new item/i })).toBeInTheDocument();
  });

  it('renders name input', () => {
    render(<Items />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('renders price input', () => {
    render(<Items />);
    
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<Items />);
    
    expect(screen.getByRole('button', { name: /create item/i })).toBeInTheDocument();
  });

  it('renders items-page class', () => {
    render(<Items />);
    
    expect(document.querySelector('.items-page')).toBeInTheDocument();
  });

  it('updates name on input change', async () => {
    const user = userEvent.setup();
    
    render(<Items />);
    
    await user.type(screen.getByLabelText(/name/i), 'Test Item');
    
    expect(screen.getByLabelText(/name/i)).toHaveValue('Test Item');
  });

  it('updates price on input change', async () => {
    const user = userEvent.setup();
    
    render(<Items />);
    
    await user.type(screen.getByLabelText(/price/i), '99.99');
    
    expect(screen.getByLabelText(/price/i)).toHaveValue('99.99');
  });

  it('calls createItem on form submit', async () => {
    const user = userEvent.setup();
    
    render(<Items />);
    
    await user.type(screen.getByLabelText(/name/i), 'New Item');
    await user.type(screen.getByLabelText(/price/i), '25.50');
    await user.click(screen.getByRole('button', { name: /create item/i }));
    
    expect(api.createItem).toHaveBeenCalledWith({
      name: 'New Item',
      price: 25.50,
    });
  });

  it('shows "Creating..." when loading', async () => {
    const user = userEvent.setup();
    api.createItem.mockImplementation(
      () => new Promise(() => {})
    );
    
    render(<Items />);
    
    await user.type(screen.getByLabelText(/name/i), 'New Item');
    await user.type(screen.getByLabelText(/price/i), '25');
    await user.click(screen.getByRole('button', { name: /create item/i }));
    
    expect(screen.getByRole('button', { name: /creating/i })).toBeInTheDocument();
  });

  it('disables button when loading', async () => {
    const user = userEvent.setup();
    api.createItem.mockImplementation(
      () => new Promise(() => {})
    );
    
    render(<Items />);
    
    await user.type(screen.getByLabelText(/name/i), 'New Item');
    await user.type(screen.getByLabelText(/price/i), '25');
    await user.click(screen.getByRole('button', { name: /create item/i }));
    
    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();
  });

  it('displays error message on failure', async () => {
    const user = userEvent.setup();
    api.createItem.mockRejectedValue(new Error('Failed to create'));
    
    render(<Items />);
    
    await user.type(screen.getByLabelText(/name/i), 'New Item');
    await user.type(screen.getByLabelText(/price/i), '25');
    await user.click(screen.getByRole('button', { name: /create item/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/failed to create/i)).toBeInTheDocument();
    });
  });

  it('clears form after successful creation', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<Items />);
    
    await user.type(screen.getByLabelText(/name/i), 'New Item');
    await user.type(screen.getByLabelText(/price/i), '25');
    await user.click(screen.getByRole('button', { name: /create item/i }));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/price/i)).toHaveValue('');
    });
    
    alertSpy.mockRestore();
  });

  it('validates price as number', async () => {
    const user = userEvent.setup();
    
    render(<Items />);
    
    const priceInput = screen.getByLabelText(/price/i);
    expect(priceInput.type).toBe('number');
  });
});
