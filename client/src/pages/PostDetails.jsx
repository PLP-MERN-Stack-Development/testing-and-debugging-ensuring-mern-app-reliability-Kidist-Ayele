import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '../services/api';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postService.getPost(postId);
        setPost(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Post not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await postService.addComment(postId, {
        content: commentContent,
        userId: null,
      });
      setPost(response.data);
      setCommentContent('');
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-600">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Link 
          to="/" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold no-underline transition-colors inline-block"
        >
          Back to posts
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <Link 
        to="/" 
        className="text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer font-medium mb-4 inline-block no-underline"
      >
        ← Back to posts
      </Link>
      
      <div className="bg-white rounded-xl p-6 shadow-md mt-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex gap-4 text-gray-500 text-sm mb-6 pb-4 border-b border-gray-200">
          <span>{post.author?.name || 'Unknown author'}</span>
          <span>{post.category?.name || 'General'}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
          {post.content}
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Comments ({post.comments?.length || 0})
        </h3>

        <form onSubmit={handleAddComment} className="flex flex-col gap-3 mb-8">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            rows="3"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
          <button
            type="submit"
            disabled={submittingComment || !commentContent.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full font-semibold transition-colors w-fit"
          >
            {submittingComment ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        <div className="flex flex-col gap-4">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">
                    {comment.user?.name || 'Anonymous'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-gray-700 leading-relaxed">{comment.content}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostDetails;
