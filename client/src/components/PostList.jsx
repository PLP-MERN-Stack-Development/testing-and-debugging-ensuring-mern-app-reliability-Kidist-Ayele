import React from 'react';
import PostCard from './PostCard';

const PostList = ({ posts }) => {
  if (!posts.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No posts yet. Create the first one!</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post._id || post.id} post={post} />
      ))}
    </section>
  );
};

export default PostList;
