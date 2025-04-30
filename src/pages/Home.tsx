
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '@/components/Post';
import { usePosts } from '@/contexts/PostsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const Home = () => {
  const { posts } = usePosts();
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <Skeleton className="h-[300px] w-full rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[70%]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">No posts yet</h2>
          <p className="text-muted-foreground mt-2">
            Start following people to see their posts here
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
