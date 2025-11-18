import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PostList from '../components/PostList';
import usePosts from '../hooks/usePosts';

const Home = () => {
  const { posts, loading, error, pagination, fetchPosts } = usePosts();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(1, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchPosts(1, '');
  };

  const handlePageChange = (page) => {
    fetchPosts(page, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Posts</h2>
          <p className="text-gray-600">Posts coming directly from the Express API.</p>
        </div>
        <Link 
          to="/create" 
          className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-2 rounded-full font-semibold no-underline transition-colors"
        >
          Write a Post
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6 items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
        >
          Search
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer font-medium"
          >
            Clear
          </button>
        )}
      </form>

      {loading && <p className="text-gray-600">Loading posts...</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
      {!loading && !error && <PostList posts={posts} />}

      {!loading && !error && !searchQuery && pagination.total > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8 py-4">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 px-6 py-2 rounded-full font-semibold transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-600 text-sm">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total posts)
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 px-6 py-2 rounded-full font-semibold transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default Home;
