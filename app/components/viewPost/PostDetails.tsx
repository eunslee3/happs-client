import { StyleSheet, View, Pressable, Text, TextInput } from 'react-native';
import React, { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';

export default function PostDetail({ user, post }: { user: any, post: any }) {
  const [commentInput, setCommentInput] = useState('');
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

  const handleTextChange = (text: any) => {
    setCommentInput(text);
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
      
      <View style={styles.detailsContainer}>
        <View style={styles.locationContainer}>
          <View style={styles.locationIconBg}>
            <MaterialIcons name="location-on" size={24} color="#00DCB7" />
          </View>
          <Text style={{ marginLeft: 10 }}>
            {post.location.length < 1 ? 'No Location' : post.location}
          </Text>
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {post.title}
        </Text>
        <Text style={styles.description}>
          {post.description}
        </Text>
      </View>

      <View style={styles.tagsContainer}>
        <View style={styles.tag}>
          <Text style={{ color: '#9155FF' }}>#Travel</Text>
        </View>
        <View style={styles.tag}>
          <Text style={{ color: '#9155FF' }}>#Abe</Text>
        </View>
        <View style={styles.tag}>
          <Text style={{ color: '#9155FF' }}>#HiddenGem</Text>
        </View>
        <View style={styles.tag}>
          <Text style={{ color: '#9155FF' }}>#BigRock</Text>
        </View>
        <View style={styles.tag}>
          <Text style={{ color: '#9155FF' }}>#BBQ</Text>
        </View>
      </View>

      <View style={styles.commentInputContainer}>
        <TextInput 
          style={styles.textInput} 
          placeholder="Type your comment"
          onChangeText={(text) => {handleTextChange(text)}}
        />
        <View style={styles.sendContainer}>
          <MaterialIcons name="send" size={24} color="white" />
        </View>
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
    width: '100%',
    flexDirection: 'column'
  },
  locationContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  locationIconBg: {
    backgroundColor: '#F4F6F7',
    width: 32,
    height: 32,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    width: '100%',
    flexDirection: 'column'
  },
  title: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 14,
  },
  tagsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  tag: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginLeft: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#CDCBCF'
  },
  commentInputContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
    padding: 10,
    alignItems: 'center'
  },
  textInput: {
    flexGrow: 1,
    height: 55,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    paddingHorizontal: 30,
  },
  sendContainer: {
    backgroundColor: '#00DCB7',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    height: 50,
    width: 50,
    marginLeft: 10
  }
});
