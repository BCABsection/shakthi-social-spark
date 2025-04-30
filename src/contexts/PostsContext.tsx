
import React, { createContext, useContext, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userProfileImage: string;
  imageUrl: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  timestamp: string;
}

interface PostsContextType {
  posts: Post[];
  userPosts: (userId: string) => Post[];
  addPost: (imageUrl: string, caption: string) => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
}

// Mock post data - in a real app, this would come from Firebase
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    userId: '2',
    username: 'jane_smith',
    userProfileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    caption: 'Beautiful sunset at the beach today! 🌅 #nature #photography',
    likes: ['1'],
    comments: [
      {
        id: '101',
        userId: '1',
        username: 'john_doe',
        text: 'Amazing shot! 📸',
        timestamp: '2023-04-28T15:32:00Z'
      }
    ],
    timestamp: '2023-04-28T14:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    username: 'john_doe',
    userProfileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    caption: 'Exploring the mountains this weekend. The view was breathtaking! 🏔️ #adventure #hiking',
    likes: ['2'],
    comments: [
      {
        id: '102',
        userId: '2',
        username: 'jane_smith',
        text: 'Looks incredible! Where is this?',
        timestamp: '2023-04-29T10:15:00Z'
      }
    ],
    timestamp: '2023-04-29T09:45:00Z'
  },
  {
    id: '3',
    userId: '2',
    username: 'jane_smith',
    userProfileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
    caption: 'Morning coffee and a good book. Perfect start to the day! ☕📚 #coffeetime #reading',
    likes: [],
    comments: [],
    timestamp: '2023-04-30T07:20:00Z'
  }
];

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const { currentUser } = useAuth();

  const userPosts = (userId: string) => {
    return posts.filter(post => post.userId === userId);
  };

  const addPost = (imageUrl: string, caption: string) => {
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to post',
      });
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      userProfileImage: currentUser.profileImage,
      imageUrl,
      caption,
      likes: [],
      comments: [],
      timestamp: new Date().toISOString()
    };

    setPosts([newPost, ...posts]);
    toast({
      title: 'Post created!',
      description: 'Your post has been published',
    });
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;

    setPosts(
      posts.map(post => {
        if (post.id === postId && !post.likes.includes(currentUser.id)) {
          return {
            ...post,
            likes: [...post.likes, currentUser.id]
          };
        }
        return post;
      })
    );
  };

  const unlikePost = (postId: string) => {
    if (!currentUser) return;

    setPosts(
      posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes.filter(id => id !== currentUser.id)
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!currentUser) return;

    setPosts(
      posts.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: Date.now().toString(),
            userId: currentUser.id,
            username: currentUser.username,
            text,
            timestamp: new Date().toISOString()
          };
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );
  };

  return (
    <PostsContext.Provider value={{ 
      posts, 
      userPosts,
      addPost, 
      likePost, 
      unlikePost, 
      addComment 
    }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};
