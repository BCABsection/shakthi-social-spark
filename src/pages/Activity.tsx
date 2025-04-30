
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostsContext';

const Activity = () => {
  const { currentUser, isLoading } = useAuth();
  const { posts } = usePosts();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, isLoading, navigate]);

  // For demo purposes, generate some mock activities
  const mockFollowRequests = [
    {
      id: '101',
      username: 'travel_lover',
      fullName: 'Alex Johnson',
      profileImage: 'https://randomuser.me/api/portraits/men/35.jpg',
      timestamp: '2023-05-01T10:15:00Z'
    }
  ];

  const mockLikes = posts.flatMap(post => 
    post.likes.map(userId => ({
      id: `like-${userId}-${post.id}`,
      userId: userId,
      username: userId === '1' ? 'john_doe' : 'jane_smith',
      profileImage: userId === '1' 
        ? 'https://randomuser.me/api/portraits/men/1.jpg' 
        : 'https://randomuser.me/api/portraits/women/2.jpg',
      postId: post.id,
      postImage: post.imageUrl,
      timestamp: new Date(post.timestamp).getTime() + 10000
    }))
  );

  const mockFollowers = [
    {
      id: '201',
      username: 'photo_expert',
      fullName: 'Sam Wilson',
      profileImage: 'https://randomuser.me/api/portraits/men/22.jpg',
      timestamp: '2023-05-02T15:30:00Z'
    },
    {
      id: '202',
      username: 'food_blogger',
      fullName: 'Emily Davis',
      profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
      timestamp: '2023-05-03T09:20:00Z'
    }
  ];
  
  const getInitials = (name: string) => {
    return name.split('_').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Activity</h1>
      
      <Tabs defaultValue="you">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="you">You</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        
        <TabsContent value="you" className="space-y-8">
          {/* Follow Requests */}
          {mockFollowRequests.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-semibold">Follow Requests</h2>
              {mockFollowRequests.map(request => (
                <div key={request.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={request.profileImage} alt={request.username} />
                      <AvatarFallback>{getInitials(request.username)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>
                        <span className="font-medium">{request.username}</span>
                        <span className="text-sm text-muted-foreground ml-1">
                          {request.fullName}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested to follow you
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="shakthi-button">
                      Confirm
                    </Button>
                    <Button size="sm" variant="outline">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Likes */}
          <div className="space-y-4">
            <h2 className="font-semibold">Recent Activity</h2>
            {mockLikes.length > 0 ? (
              mockLikes.map(like => (
                <div key={like.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={like.profileImage} alt={like.username} />
                      <AvatarFallback>{getInitials(like.username)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>
                        <span className="font-medium">{like.username}</span>
                        <span className="text-muted-foreground ml-1">
                          liked your photo
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat('en-US', {
                          day: 'numeric',
                          month: 'short'
                        }).format(new Date(like.timestamp))}
                      </p>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-gray-100">
                    <img 
                      src={like.postImage} 
                      alt="Post thumbnail" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Heart className="h-16 w-16 mx-auto text-gray-300" />
                <p className="mt-4 text-muted-foreground">
                  No activity yet
                </p>
              </div>
            )}
          </div>
          
          {/* New Followers */}
          <div className="space-y-4">
            <h2 className="font-semibold">New Followers</h2>
            {mockFollowers.map(follower => (
              <div key={follower.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={follower.profileImage} alt={follower.username} />
                    <AvatarFallback>{getInitials(follower.username)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>
                      <Link to={`/user/${follower.id}`} className="font-medium hover:underline">
                        {follower.username}
                      </Link>
                      <span className="text-sm text-muted-foreground ml-1">
                        {follower.fullName}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Started following you
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="following">
          <div className="text-center py-12">
            <h2 className="text-xl font-medium">Coming Soon</h2>
            <p className="text-muted-foreground mt-2">
              We're working on this feature!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Activity;
