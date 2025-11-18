import { useState, useEffect, useCallback } from 'react';
import { postService } from '../services/api';

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });

  const fetchPosts = useCallback(
    async (page = 1, searchQuery = '') => {
      setLoading(true);
      setError('');
      try {
        const response = await postService.getAllPosts(page, pagination.limit, null, searchQuery);
        setPosts(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  const fetchPostById = useCallback(async (idOrSlug) => {
    const response = await postService.getPost(idOrSlug);
    return response.data;
  }, []);

  const createPost = useCallback(async (payload) => {
    const response = await postService.createPost(payload);
    setPosts((prev) => [response.data, ...prev]);
    return response.data;
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
    fetchPostById,
    createPost,
  };
};

export default usePosts;

