import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, Dimensions, Modal } from 'react-native';
import { Image } from 'expo-image';
import postStore from '@/store/postStore';
import { useRouter } from 'expo-router';

const windowWidth = Dimensions.get('window').width;
const itemHeight = (windowWidth * 0.50) * 1.5

export default function UploadModal ({ selectedAsset, clearSelectedAsset }: { selectedAsset: any, clearSelectedAsset: () => void }) {

  const handlePress = () => {

  }

  return (
    <View style={[styles.container, styles.shadowContainer]}>
      <View style={styles.contentContainer}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Upload Photo?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '75%',
    height: itemHeight,
    left: '50%',
    top: '50%',
    borderRadius: 10,
    backgroundColor: 'white',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    padding: 20,
  },
  shadowContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Android Shadow
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  }
})