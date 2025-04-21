import React, { useEffect } from 'react';
import { Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const JumpingLogo = () => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, {
          duration: 600,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(1, {
          duration: 600,
          easing: Easing.in(Easing.quad),
        })
      ),
      -1, // boucle infinie
      true // auto-reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedImage
      source={require('../assets/images/logoMaps.png')}
      style={[
        { width: 300, height: 300, borderRadius: 12 },
        animatedStyle
      ]}
      resizeMode="contain"
    />
  );
};

export default JumpingLogo;
