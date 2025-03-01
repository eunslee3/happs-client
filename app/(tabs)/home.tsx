import { ActivityIndicator, View, Image, StyleSheet, Platform, ScrollView, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import { getAllPosts } from '@/api/posts/getAllPosts';
import Ionicons from '@expo/vector-icons/Ionicons';
import uploadStore from '@/store/uploadStore';
import { useQuery } from '@tanstack/react-query';
import PostCard from '../components/feed/PostCard';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [allPosts, setAllPosts] = useState<any>([]);
  const { isUploading } = uploadStore();

  const { data: postsData } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => await getAllPosts()
  })

  useEffect(() => {
    setAllPosts(postsData)
  }, [postsData])

  const handleToggleActiveTab = (tab: 'All' | 'Clips' | 'Posts') => {
    switch (tab){
      case 'All':
        setActiveTab('All');
        break;
      case 'Clips':
        setActiveTab('Clips');
        break;
      case 'Posts':
        setActiveTab('Posts');
        break;
      default:
        setActiveTab('All');
    }
  }

  const renderPostCards = () => {
    if (allPosts) {
      return allPosts?.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>happs</Text>
              <Ionicons name="notifications-outline" size={24} color="black" />            
            </View>
            <View style={styles.headerRow}>
              <View style={styles.topTabBar}>
                <Pressable 
                  style={styles.topTab}
                  onPress={() => handleToggleActiveTab('All')}
                >
                  <Text style={activeTab === 'All' ? styles.activeTab : styles.inactiveTab}>All</Text>
                </Pressable>
                <Pressable 
                  style={styles.topTab}
                  onPress={() => handleToggleActiveTab('Clips')}
                >
                  <Text style={activeTab === 'Clips' ? styles.activeTab : styles.inactiveTab}>Clips</Text>
                </Pressable>
                <Pressable 
                  style={styles.topTab}
                  onPress={() => handleToggleActiveTab('Posts')}
                >
                  <Text style={activeTab === 'Posts' ? styles.activeTab : styles.inactiveTab}>Posts</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <View>
            {/* Progress bar */}
            { isUploading && (
            <View style={styles.uploadProgressContainer}>
              <View style={styles.uploadProgressItem}>
                <View style={styles.progressComponentContainer}>
                  <ActivityIndicator size='large' />
                </View>
                <View style={styles.progressComponentContainer}>
                  <Text>Posting...</Text>
                </View>
              </View>
            </View>
            )}
            <View style={styles.contentContainer}>
              {/* Content here: */}
              {allPosts ? renderPostCards() : <ActivityIndicator />}
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  scrollView: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    height: 100,
    width: '100%',
    flexDirection: "column"
  },
  headerRow: {
    height: '50%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10
  },
  headerText: {
    fontSize: 24,
    color: "black",
    fontWeight: 700,
    fontFamily: "Poppins-Bold",
  },
  topTabBar: {
    height: '100%',
    width: '100%',
    flexDirection: "row",
    alignItems: "flex-end",
  },
  topTab: {
    paddingLeft: 10,
    marginRight: 20,
  },
  activeTab: {
    fontWeight: 'bold',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  inactiveTab: {
    fontWeight: 'light',
    fontSize: 16,
  },
  uploadProgressContainer: {
    position: 'absolute',
    top: 50,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  uploadProgressItem: {
    display: 'flex',
    flexDirection: 'row',
    // height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 150,
    height: 75,
    borderWidth: 1,
    borderRadius: 10
  },
  uploadProgressImage: {
    width: 75,
    height: 73,
    resizeMode: 'cover',
    borderRadius: 10,
    margin: 0
  },
  progressComponentContainer: {
    height: 75,
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: 10,
    width: '100%',
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
  }
});
