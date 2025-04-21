import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import ListTypeWriter from '@/component/Typewriter';


export default function Index() {

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className='flex-2 mt-16'>
          <MaskedView
          maskElement={
            <Text style={{ fontSize: 40, fontWeight: 'bold', textAlign: 'center' }}>
              MY SAFETY
            </Text>
          }
        >
          <LinearGradient
            colors={['#EF4444', '#10B981', '#FACC15', '#0EA5E9']} // rouge, vert, jaune, bleu
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 50 }}
          >
            <Text style={{ opacity: 0, fontSize: 40, fontWeight: 'bold', textAlign: 'center' }}>
              MY SAFETY
            </Text>
          </LinearGradient>
        </MaskedView>
      </View>
      <View className='flex-1 items-center justify-center gap-y-6'>
        <Image
          source={require('../assets/images/logoMaps.png')}
          style={{ width: 300, height: 300, borderRadius: 12 }}
          contentFit="contain"
        />
        <ListTypeWriter />
      </View>
      <View className='flex-2 mb-40'>
        <Pressable className="px-12 py-4 rounded-lg bg-blue-500">
          <Text className="text-white font-bold">Appuyer</Text>
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
