import { View, StyleSheet  } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getUserPosts } from '@/api/posts/getUserPosts';
import ProfileGalleryItem from './profileGallery/ProfileGalleryItem';

export default function ProfileGallery({
  user
}:
{
  user: any
}) {

  const { data: postsData } = useQuery({
    queryKey: ['userPosts'],
    queryFn: async () => await getUserPosts(user.id),
    refetchOnWindowFocus: false
  })

  const renderProfileGalleryItems = () => {
    return postsData?.map((item: any, idx: number) => {
      return (
        <ProfileGalleryItem key={idx} item={item} />
      )
    })
  }

  return (
    <View style={styles.container}>
      {renderProfileGalleryItems()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});
