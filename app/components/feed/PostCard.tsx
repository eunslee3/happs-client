import { StyleSheet, View, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import Octicons from '@expo/vector-icons/Octicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import postStore from '@/store/postStore';

export default function PostCard({ post }: { post: any }) {
  const [imageAvailable, setImageAvailable] = useState(false);
  const router = useRouter();
  const { setSelectedPost } = postStore();
  // S3 doesn't allow you to access the url right away - it'll return a 403
  // We need to give it some time before we load the image

  useEffect(() => {
    if (post.mediaUrls[0].type === 'video') {
      let attempts = 0;
  
      async function checkImageAvailability() {
        if (attempts > 5) return; // Stop checking after 5 tries
    
        try {
          const response = await fetch(post.mediaUrls[0].thumbnailUrl);
          if (response.ok) {
            setImageAvailable(true);
            return;
          }
        } catch (error) {}
    
        setTimeout(() => {
          attempts++;
          checkImageAvailability();
        }, 2000); // Retry every 2 seconds
      }
    
      checkImageAvailability();
    }
  }, [post]);

  const handleNavigation = () => {
    setSelectedPost(post)
    router.push({
      pathname: '../../components/ViewPost',
    })
  }

  // Prevent rendering if thumbnailUrl is missing
  if (!post.mediaUrls[0]?.thumbnailUrl && post.mediaUrls[0].type === 'video') {
    console.log("Thumbnail URL is missing, skipping render");
    return null;
  }

  if (post.mediaUrls[0].type === 'video') {
    return (
      <View style={styles.postContainer}>
        <Pressable onPress={handleNavigation} style={styles.pressableContainer}>
        { imageAvailable && (
          <>
            <Octicons
              name="video"
              color='white'
              size={20} 
              style={styles.videoIcon}
            />
              <Image 
              source={{ uri: post.mediaUrls[0].thumbnailUrl, cache: "reload" }} 
              style={styles.thumbnail}
            />
          </>
        )}
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.postContainer}>
      <Pressable onPress={handleNavigation} style={styles.pressableContainer}>
        <Image 
          source={{ uri: post.mediaUrls[0].url, cache: "reload" }} 
          style={styles.thumbnail} 
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '45%',
    maxWidth: '45%',
    height: 200,
    margin: 3
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 20
  },
  videoIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10, 
  },
  pressableContainer: {
    width: '100%',
    height: '100%'
  }
});
