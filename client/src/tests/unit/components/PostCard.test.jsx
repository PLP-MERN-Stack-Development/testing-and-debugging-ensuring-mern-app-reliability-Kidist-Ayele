// PostCard.test.jsx - Unit tests for PostCard component

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import PostCard from '../../../components/PostCard';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PostCard Component', () => {
  const mockPost = {
    _id: '123',
    title: 'Test Post',
    content: 'This is the content of the test post',
    excerpt: 'This is an excerpt',
    author: { name: 'John Doe', email: 'john@example.com' },
    category: { name: 'Technology', slug: 'technology' },
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  it('renders post title correctly', () => {
    renderWithRouter(<PostCard post={mockPost} />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  it('renders post excerpt when available', () => {
    renderWithRouter(<PostCard post={mockPost} />);
    expect(screen.getByText('This is an excerpt')).toBeInTheDocument();
  });

  it('renders truncated content when excerpt is not available', () => {
    const postWithoutExcerpt = { ...mockPost, excerpt: null };
    renderWithRouter(<PostCard post={postWithoutExcerpt} />);
    expect(screen.getByText(/This is the content of the test post/i)).toBeInTheDocument();
  });

  it('renders author name correctly', () => {
    renderWithRouter(<PostCard post={mockPost} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders category name correctly', () => {
    renderWithRouter(<PostCard post={mockPost} />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('handles post with string category', () => {
    const postWithStringCategory = { ...mockPost, category: 'Technology' };
    renderWithRouter(<PostCard post={postWithStringCategory} />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders date correctly', () => {
    renderWithRouter(<PostCard post={mockPost} />);
    // Date formatting may vary, so we check for parts of the date
    expect(screen.getByText(/2024|Jan|January/i)).toBeInTheDocument();
  });

  it('handles missing author gracefully', () => {
    const postWithoutAuthor = { ...mockPost, author: null };
    renderWithRouter(<PostCard post={postWithoutAuthor} />);
    expect(screen.getByText(/unknown author/i)).toBeInTheDocument();
  });

  it('creates correct link to post details', () => {
    renderWithRouter(<PostCard post={mockPost} />);
    const link = screen.getByRole('link', { name: /test post/i });
    expect(link).toHaveAttribute('href', '/posts/123');
  });
});

