import { StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Octicons from '@expo/vector-icons/Octicons';
import { Image } from 'expo-image';

export default function PostCard({ post }: { post: any }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const [imageAvailable, setImageAvailable] = useState(false);

  useEffect(() => {
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
  }, [post]);
  
  // Prevent rendering if thumbnailUrl is missing
  if (!post.mediaUrls[0]?.thumbnailUrl) {
    console.log("Thumbnail URL is missing, skipping render");
    return null;
  }

  if (post.mediaUrls[0].type === 'video') {
    return (
      <View style={styles.postContainer}>
        <Octicons
          name="video"
          color='white'
          size={20} 
          style={styles.videoIcon}
        />
        { imageAvailable && (
          <Image 
          source={{ uri: post.mediaUrls[0].thumbnailUrl, cache: "reload" }} 
          style={styles.thumbnail}
          key={imageKey} 
        />
        )}
      </View>
    );
  }

  return (
    <View style={styles.postContainer}>
      <Image 
        source={{ uri: post.mediaUrls[0].url, cache: "reload" }} 
        style={{ width: '100%', height: '100%' }} 
      />
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
  }
});
