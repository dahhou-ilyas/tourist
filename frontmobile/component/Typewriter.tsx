/* components/GradientTypewriter.tsx */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleProp, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

interface TypewriterProps {
  text: string;
  letterDelay?: number;
  style?: StyleProp<TextStyle>;
  onComplete?: () => void;
}

/* 🔥 Nouveau dégradé “Instagram corporate” */
const GRADIENT_COLORS = [
  '#F58529', // orange punchy
  '#FF5E3A', // corail
  '#DD2A7B', // magenta
  '#8134AF', // violet
  '#515BD4', // indigo
];

const AnimatedText = Animated.createAnimatedComponent(Text);

export const GradientTypewriter: React.FC<TypewriterProps> = ({
  text,
  letterDelay = 75,
  style,
  onComplete,
}) => {
  const [displayed, setDisplayed] = useState('');
  const cursorOpacity = useSharedValue(1);

  useEffect(() => {
    cursorOpacity.value = withRepeat(
      withTiming(0, { duration: 550 }),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i === text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, letterDelay);
    return () => clearInterval(interval);
  }, [text, letterDelay]);

  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }));

  return (
    <MaskedView
      maskElement={
        <Text style={[{ fontSize: 20, fontWeight: '600', textAlign: 'center' }, style]}>
          {displayed || ' '}
        </Text>
      }
    >
      <LinearGradient colors={GRADIENT_COLORS} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text style={[{ fontSize: 20, fontWeight: '600', textAlign: 'center', opacity: 0 }, style]}>
          {displayed}
        </Text>
      </LinearGradient>

      {/* Curseur animé */}
      <AnimatedText
        style={[
          { fontSize: 20, fontWeight: '600', marginLeft: 2, textAlignVertical: 'center' },
          cursorStyle,
          style,
        ]}
      >
        |
      </AnimatedText>
    </MaskedView>
  );
};

/* --- Pas de changement dans ListTypewriter --- */
const PHRASES = [
  'Zones à risque détectées',
  'Restaurants à proximité',
  'Déclarez un lieu dangereux',
];

const ListTypewriter: React.FC = () => {
  const [idx, setIdx] = useState(0);

  return (
    <View style={{ marginTop: 32 }}>
      <GradientTypewriter
        key={idx}
        text={PHRASES[idx]}
        letterDelay={65}
        style={{ fontFamily: 'System', fontSize: 22 }}
        onComplete={() => setTimeout(() => setIdx((idx + 1) % PHRASES.length), 1200)}
      />
    </View>
  );
};

export default ListTypewriter;
