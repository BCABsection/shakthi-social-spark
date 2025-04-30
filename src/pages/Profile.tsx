
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, BookmarkIcon, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { usePosts } from '@/contexts/PostsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const Profile = () => {
  const { currentUser, isLoading } = useAuth();
  const { userPosts } = usePosts();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, isLoading, navigate]);
  
  if (isLoading || !currentUser) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-8">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-4 flex-1">
            <Skeleton className="h-8 w-[180px]" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  const posts = userPosts(currentUser.id);
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentUser.profileImage} alt={currentUser.username} />
          <AvatarFallback>{getInitials(currentUser.fullName)}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-4 flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-xl font-medium">{currentUser.username}</h1>
            <div className="flex gap-2 justify-center sm:justify-start">
              <Button variant="outline" size="sm">Edit Profile</Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center sm:justify-start gap-6">
            <div>
              <span className="font-medium">{posts.length}</span> posts
            </div>
            <div>
              <span className="font-medium">{currentUser.followers}</span> followers
            </div>
            <div>
              <span className="font-medium">{currentUser.following}</span> following
            </div>
          </div>
          
          <div>
            <p className="font-medium">{currentUser.fullName}</p>
            {currentUser.bio && <p>{currentUser.bio}</p>}
          </div>
        </div>
      </div>
      
      {/* Posts Grid */}
      <Tabs defaultValue="posts">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            <span>Posts</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <BookmarkIcon className="h-4 w-4" />
            <span>Saved</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          {posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <div key={post.id} className="aspect-square">
                  <img
                    src={post.imageUrl}
                    alt={`Post by ${currentUser.username}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-xl font-medium">No Posts Yet</h2>
              <p className="text-muted-foreground mt-2">
                When you share photos, they'll appear here.
              </p>
              <Button className="mt-6 shakthi-button">
                Share your first photo
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved">
          <div className="text-center py-20">
            <h2 className="text-xl font-medium">No Saved Posts</h2>
            <p className="text-muted-foreground mt-2">
              Save posts to view them later.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
