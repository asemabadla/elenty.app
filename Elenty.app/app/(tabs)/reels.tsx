import React, { useState, useRef } from 'react';
import { StyleSheet, View, FlatList, Dimensions, ViewToken } from 'react-native';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useSocialStore } from '@/store/social-store';

const { height } = Dimensions.get('window');

export default function ReelsScreen() {
  const { shortVideos } = useSocialStore();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveVideoIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={shortVideos}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <VideoPlayer
            video={item}
            isActive={index === activeVideoIndex}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height - 120} // Adjust for tab bar and status bar
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});