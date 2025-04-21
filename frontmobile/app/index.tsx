import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';


export default function Index() {

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className='flex-2 bg-indigo-700'>
        <Text>My Mapeazeazezae</Text>
      </View>
      <View className='flex-1 bg-teal-400'>
        <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero aliquid aperiam alias.</Text>
      </View>
      <View className='flex-2 bg-green-400'>
        <Pressable>
          <Text className="">Appuyer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  errorContainer: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
  },
});
