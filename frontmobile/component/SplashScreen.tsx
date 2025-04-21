import React from 'react';
import { View, Image, StyleSheet, SafeAreaView } from 'react-native';

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/images/logoMaps.png')} // ← Ton image ici
        style={styles.logo}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF6', // couleur de fond similaire à ton logo
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen;
