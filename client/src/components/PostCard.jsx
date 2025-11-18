import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <article className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer hover:-translate-y-1 transform transition-all">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-800">
          <Link to={`/posts/${post._id || post.id}`} className="no-underline">
            {post.title}
          </Link>
        </h3>
        {post.category && (
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
            {typeof post.category === 'string' ? post.category : post.category?.name}
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-4 line-clamp-3">
        {post.excerpt || post.content?.slice(0, 120)}
      </p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{post.author?.name || post.author || 'Unknown author'}</span>
        <span>
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Today'}
        </span>
      </div>
    </article>
  );
};

export default PostCard;
