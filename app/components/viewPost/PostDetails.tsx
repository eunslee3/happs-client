import { StyleSheet, View, Pressable, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import Octicons from '@expo/vector-icons/Octicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import postStore from '@/store/postStore';

export default function PostDetail({ user, post }: { user: any, post: any }) {
  console.log({
    post,
    user
  })
  const timeAgo = (timestamp: string | number | Date): string => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
  
    if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years === 1 ? "" : "s"} ago`;
  };
  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfo}>
          {user.profilePictureUrl ? 
            <Image source={user.profilePictureUrl} /> 
            : 
            <View style={styles.defaultProfilePicture}>
              <Image 
                style={styles.defaultProfilePicture} 
                source={require('../../../assets/images/Default_pfp.jpg')} 
              />
            </View>
          }
          <View style={styles.userTextInfo}>
            <Text style={{ fontSize: 14 }}>{user.username}</Text>
            <Text style={{ color: '#9DA1A5', fontSize: 12 }}>{timeAgo(post.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.followBtnContainer}>
          <Pressable style={styles.followBtn}>
            <Text>Follow</Text>
          </Pressable>
        </View>
      </View>
      
      <View>
        <View></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 15
  },
  userInfoContainer: {
    width: '100%',
    height: 46,
    flexDirection: 'row'
  },
  defaultProfilePicture: {
    borderRadius: 50,
    width: 46,
    height: 46,
    backgroundColor: '#c8d2d7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    height: '100%',
    width: '50%',
    alignItems: 'center',
    flexDirection: 'row'
  },
  userTextInfo: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10
  },
  followBtnContainer: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  followBtn: {
    height: 32,
    width: 75,
    backgroundColor: '#F4F6F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  detailsContainer: {
    width: '100%'
  }
});
