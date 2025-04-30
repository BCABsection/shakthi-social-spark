
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { usePosts } from '@/contexts/PostsContext';
import { useAuth } from '@/contexts/AuthContext';

const CreatePost = () => {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPost } = usePosts();
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, isLoading, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please select an image file (JPEG, PNG, etc.)'
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast({
        variant: 'destructive',
        title: 'No image selected',
        description: 'Please select an image to post'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app with Firebase, we'd upload the image first
    // and then save the post with the image URL
    // For this prototype, we'll just use the data URL
    
    addPost(image, caption);
    setIsSubmitting(false);
    navigate('/');
  };
  
  const clearImage = () => {
    setImage(null);
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {image ? (
              <div className="relative">
                <Button 
                  type="button"
                  variant="destructive" 
                  size="icon"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                <img 
                  src={image} 
                  alt="Preview" 
                  className="w-full rounded-md aspect-square object-cover"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-12 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
            
            <Textarea 
              placeholder="Write a caption..." 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full shakthi-button"
              disabled={!image || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Share'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreatePost;
