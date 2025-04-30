
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePosts } from '@/contexts/PostsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { posts } = usePosts();
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, isLoading, navigate]);
  
  // Simple filter for posts based on caption or username
  const filteredPosts = posts.filter(post => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      post.caption.toLowerCase().includes(lowerSearchTerm) ||
      post.username.toLowerCase().includes(lowerSearchTerm)
    );
  });

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts, users, or tags"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-1">
        {filteredPosts.map((post) => (
          <div 
            key={post.id} 
            className="aspect-square cursor-pointer"
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <img
              src={post.imageUrl}
              alt={`Post by ${post.username}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-xl font-medium">No Results Found</h2>
          <p className="text-muted-foreground mt-2">
            Try searching for something else
          </p>
        </div>
      )}
    </div>
  );
};

export default Explore;
