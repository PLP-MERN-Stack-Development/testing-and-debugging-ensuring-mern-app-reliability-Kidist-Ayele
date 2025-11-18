// PostList.test.jsx - Unit tests for PostList component

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import PostList from '../../../components/PostList';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PostList Component', () => {
  const mockPosts = [
    {
      _id: '1',
      title: 'First Post',
      content: 'First post content',
      author: { name: 'Author 1' },
      category: { name: 'Tech' },
    },
    {
      _id: '2',
      title: 'Second Post',
      content: 'Second post content',
      author: { name: 'Author 2' },
      category: { name: 'Science' },
    },
  ];

  it('renders empty message when no posts', () => {
    renderWithRouter(<PostList posts={[]} />);
    expect(screen.getByText(/no posts yet/i)).toBeInTheDocument();
  });

  it('renders all posts when provided', () => {
    renderWithRouter(<PostList posts={mockPosts} />);
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('renders correct number of posts', () => {
    const { container } = renderWithRouter(<PostList posts={mockPosts} />);
    const postCards = container.querySelectorAll('.post-card');
    expect(postCards).toHaveLength(2);
  });

  it('renders single post correctly', () => {
    const singlePost = [mockPosts[0]];
    renderWithRouter(<PostList posts={singlePost} />);
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.queryByText('Second Post')).not.toBeInTheDocument();
  });
});

