import { View, Image, StyleSheet, Platform, ScrollView, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { getAllPosts } from '@/api/posts/getAllPosts';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const handleGetAllPosts = () => {
    const response = getAllPosts();
    // console.log('wtf ru', response)
  }

  useEffect(() => {
    handleGetAllPosts()
  }, [])

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
            <Image source={{ uri: '../../assets/images/Apple.png'}} />
            {/* Content here: */}
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
  }
});
