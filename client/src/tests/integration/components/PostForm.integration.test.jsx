// PostForm.integration.test.jsx - Integration tests for PostForm with API

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostForm from '../../../components/PostForm';
import { postService } from '../../../services/api';

// Mock the API service
jest.mock('../../../services/api', () => ({
  postService: {
    createPost: jest.fn(),
  },
}));

describe('PostForm Integration Tests', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits form data and calls onSubmit callback', async () => {
    const mockPostData = {
      title: 'Integration Test Post',
      content: 'This is integration test content',
      author: 'author-id-123',
      category: 'category-id-456',
      isPublished: false,
    };

    render(<PostForm onSubmit={mockOnSubmit} categories={[]} />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: mockPostData.title },
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: mockPostData.content },
    });
    fireEvent.change(screen.getByLabelText(/author id/i), {
      target: { value: mockPostData.author },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: mockPostData.category },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save post/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: mockPostData.title,
          content: mockPostData.content,
          author: mockPostData.author,
          category: mockPostData.category,
        })
      );
    });
  });

  it('validates required fields before submission', () => {
    render(<PostForm onSubmit={mockOnSubmit} categories={[]} />);

    const form = screen.getByRole('form', { hidden: true }) || screen.getByRole('button', { name: /save post/i }).closest('form');
    
    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /save post/i }));

    // HTML5 validation should prevent submission
    // We can check if the form validation is working
    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput).toBeRequired();
  });

  it('handles checkbox state changes correctly', () => {
    render(<PostForm onSubmit={mockOnSubmit} categories={[]} />);

    const checkbox = screen.getByLabelText(/publish immediately/i);
    
    // Initially unchecked
    expect(checkbox).not.toBeChecked();

    // Check it
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Uncheck it
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});

