
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from '@/components/ui/card';
import { type Post as PostType } from '@/contexts/PostsContext';
import { usePosts } from '@/contexts/PostsContext';
import { useAuth } from '@/contexts/AuthContext';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { currentUser } = useAuth();
  const { likePost, unlikePost, addComment } = usePosts();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
  
  const handleLikeToggle = () => {
    if (!currentUser) return;
    
    if (isLiked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    addComment(post.id, comment);
    setComment('');
    setShowComments(true);
  };
  
  const getInitials = (name: string) => {
    return name.split('_').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <Card className="mb-6 border-gray-200 dark:border-gray-800">
      <CardHeader className="flex flex-row items-center space-y-0 p-4">
        <Link to={`/user/${post.userId}`} className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.userProfileImage} alt={post.username} />
            <AvatarFallback>{getInitials(post.username)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{post.username}</span>
        </Link>
        <div className="ml-auto">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <img 
          src={post.imageUrl}
          alt={`Post by ${post.username}`}
          className="w-full h-auto object-cover aspect-square sm:aspect-[4/3] md:aspect-[16/9]"
        />
      </CardContent>
      
      <CardFooter className="flex flex-col items-start space-y-3 p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={handleLikeToggle}
            >
              <Heart
                className={`h-6 w-6 ${isLiked ? 'fill-shakthi-pink text-shakthi-pink' : ''}`}
              />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 ml-auto">
            <Bookmark className="h-6 w-6" />
          </Button>
        </div>
        
        {post.likes.length > 0 && (
          <p className="font-medium">{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</p>
        )}
        
        <div className="w-full">
          <p>
            <Link to={`/user/${post.userId}`} className="font-medium mr-2">
              {post.username}
            </Link>
            {post.caption}
          </p>
          
          {post.comments.length > 0 && (
            <div className={`mt-2 space-y-1 ${!showComments && post.comments.length > 2 ? 'max-h-16 overflow-hidden' : ''}`}>
              {showComments ? (
                post.comments.map(comment => (
                  <p key={comment.id} className="text-sm">
                    <Link to={`/user/${comment.userId}`} className="font-medium mr-1">
                      {comment.username}
                    </Link>
                    {comment.text}
                  </p>
                ))
              ) : (
                post.comments.slice(0, 2).map(comment => (
                  <p key={comment.id} className="text-sm">
                    <Link to={`/user/${comment.userId}`} className="font-medium mr-1">
                      {comment.username}
                    </Link>
                    {comment.text}
                  </p>
                ))
              )}
              
              {!showComments && post.comments.length > 2 && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-muted-foreground text-sm"
                  onClick={() => setShowComments(true)}
                >
                  View all {post.comments.length} comments
                </Button>
              )}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
          </p>
        </div>
        
        {currentUser && (
          <form onSubmit={handleCommentSubmit} className="w-full flex mt-2">
            <Input
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-full"
            />
            <Button 
              type="submit" 
              className="ml-2 shakthi-button"
              disabled={!comment.trim()}
            >
              Post
            </Button>
          </form>
        )}
      </CardFooter>
    </Card>
  );
};

export default Post;
