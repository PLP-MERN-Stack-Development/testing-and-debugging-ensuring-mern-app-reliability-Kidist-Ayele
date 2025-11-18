// PostForm.test.jsx - Unit tests for PostForm component

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostForm from '../../../components/PostForm';

describe('PostForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockCategories = [
    { _id: '1', name: 'Technology' },
    { _id: '2', name: 'Science' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<PostForm onSubmit={mockOnSubmit} categories={mockCategories} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });

  it('renders categories dropdown when categories are provided', () => {
    render(<PostForm onSubmit={mockOnSubmit} categories={mockCategories} />);

    const categorySelect = screen.getByLabelText(/category/i);
    expect(categorySelect.tagName).toBe('SELECT');
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
  });

  it('renders category input field when no categories provided', () => {
    render(<PostForm onSubmit={mockOnSubmit} categories={[]} />);

    const categoryInput = screen.getByLabelText(/category/i);
    expect(categoryInput.tagName).toBe('INPUT');
  });

  it('calls onSubmit with form data when submitted', async () => {
    render(<PostForm onSubmit={mockOnSubmit} categories={mockCategories} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Post' },
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'Test content' },
    });
    fireEvent.change(screen.getByLabelText(/author id/i), {
      target: { value: 'author123' },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: '1' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save post/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Post',
        content: 'Test content',
        author: 'author123',
        category: '1',
        isPublished: false,
      });
    });
  });

  it('updates form state when inputs change', () => {
    render(<PostForm onSubmit={mockOnSubmit} categories={mockCategories} />);

    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    expect(titleInput.value).toBe('New Title');
  });

  it('handles checkbox change for isPublished', () => {
    render(<PostForm onSubmit={mockOnSubmit} categories={mockCategories} />);

    const checkbox = screen.getByLabelText(/publish immediately/i);
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('initializes with initialValues when provided', () => {
    const initialValues = {
      title: 'Initial Title',
      content: 'Initial Content',
      author: 'initial-author',
      category: '1',
      isPublished: true,
    };

    render(
      <PostForm
        onSubmit={mockOnSubmit}
        categories={mockCategories}
        initialValues={initialValues}
      />
    );

    expect(screen.getByLabelText(/title/i).value).toBe('Initial Title');
    expect(screen.getByLabelText(/content/i).value).toBe('Initial Content');
    expect(screen.getByLabelText(/author id/i).value).toBe('initial-author');
    expect(screen.getByLabelText(/category/i).value).toBe('1');
    expect(screen.getByLabelText(/publish immediately/i)).toBeChecked();
  });
});

