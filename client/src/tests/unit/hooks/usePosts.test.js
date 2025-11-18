// usePosts.test.js - Unit tests for usePosts hook

import { renderHook, waitFor } from '@testing-library/react';
import usePosts from '../../../hooks/usePosts';
import { postService } from '../../../services/api';

// Mock the API service
jest.mock('../../../services/api', () => ({
  postService: {
    getAllPosts: jest.fn(),
    getPost: jest.fn(),
    createPost: jest.fn(),
  },
}));

describe('usePosts Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty posts and loading state', () => {
    postService.getAllPosts.mockResolvedValue({
      data: [],
      pagination: { page: 1, pages: 1, total: 0, limit: 10 },
    });

    const { result } = renderHook(() => usePosts());

    expect(result.current.posts).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe('');
  });

  it('fetches posts on mount', async () => {
    const mockPosts = [
      { _id: '1', title: 'Post 1', content: 'Content 1' },
      { _id: '2', title: 'Post 2', content: 'Content 2' },
    ];

    postService.getAllPosts.mockResolvedValue({
      data: mockPosts,
      pagination: { page: 1, pages: 1, total: 2, limit: 10 },
    });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(postService.getAllPosts).toHaveBeenCalledTimes(1);
    expect(result.current.posts).toEqual(mockPosts);
  });

  it('handles fetch errors correctly', async () => {
    const errorMessage = 'Failed to load posts';
    postService.getAllPosts.mockRejectedValue({
      response: { data: { error: errorMessage } },
    });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.posts).toEqual([]);
  });

  it('fetchPosts function updates posts', async () => {
    const initialPosts = [{ _id: '1', title: 'Post 1' }];
    const newPosts = [{ _id: '2', title: 'Post 2' }];

    postService.getAllPosts
      .mockResolvedValueOnce({
        data: initialPosts,
        pagination: { page: 1, pages: 1, total: 1, limit: 10 },
      })
      .mockResolvedValueOnce({
        data: newPosts,
        pagination: { page: 1, pages: 1, total: 1, limit: 10 },
      });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.fetchPosts(1, '');

    await waitFor(() => {
      expect(result.current.posts).toEqual(newPosts);
    });
  });

  it('fetchPostById fetches a single post', async () => {
    const mockPost = { _id: '1', title: 'Single Post', content: 'Content' };
    postService.getPost.mockResolvedValue({ data: mockPost });
    postService.getAllPosts.mockResolvedValue({
      data: [],
      pagination: { page: 1, pages: 1, total: 0, limit: 10 },
    });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const post = await result.current.fetchPostById('1');

    expect(postService.getPost).toHaveBeenCalledWith('1');
    expect(post).toEqual(mockPost);
  });

  it('createPost adds new post to the list', async () => {
    const newPost = { _id: '3', title: 'New Post', content: 'New Content' };
    postService.createPost.mockResolvedValue({ data: newPost });
    postService.getAllPosts.mockResolvedValue({
      data: [],
      pagination: { page: 1, pages: 1, total: 0, limit: 10 },
    });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const created = await result.current.createPost(newPost);

    expect(postService.createPost).toHaveBeenCalledWith(newPost);
    expect(created).toEqual(newPost);
    expect(result.current.posts).toContainEqual(newPost);
  });
});

