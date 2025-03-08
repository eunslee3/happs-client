import { StyleSheet, View, Pressable, FlatList, Text } from 'react-native';
import React, { useState, useEffect } from 'react';


export default function CommentBottomSheet() {

  return (
  <View style={styles.container}>
    <Text>Bottom Sheet</Text>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    opacity: 0,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
});
