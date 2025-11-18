import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { categoryService } from '../services/api';
import usePosts from '../hooks/usePosts';

const PostEditor = () => {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const [categories, setCategories] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (values) => {
    setStatusMessage('Saving draft...');
    try {
      const saved = await createPost(values);
      setStatusMessage('Post saved successfully!');
      setTimeout(() => {
        navigate(`/posts/${saved._id}`, { replace: true });
      }, 1000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.details?.join(', ') ||
        'Something went wrong. Please try again.';
      setStatusMessage(`Error: ${errorMsg}`);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Create or Edit Post</h2>
      <div className="bg-white rounded-xl p-6 shadow-md">
        <PostForm categories={categories} onSubmit={handleSubmit} />
      </div>
      {statusMessage && (
        <p className={`mt-4 ${statusMessage.startsWith('Error') ? 'text-red-600' : 'text-blue-600'}`}>
          {statusMessage}
        </p>
      )}
    </section>
  );
};

export default PostEditor;
