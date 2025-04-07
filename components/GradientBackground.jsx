// components/GradientBackground.js
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, useWindowDimensions, Animated, ImageBackground, View } from 'react-native';
import { useEffect, useRef } from 'react';

export default function GradientBackground({ children }) {
  const { width } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const showImage = width >= 768;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showImage ? 1 : 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [showImage]);

  return (
    <View style={styles.container}>
      {/* Gradient Background (always visible) */}
      <LinearGradient
        colors={["#0a0f24", "#2e1a47", "#813f6e"]}
        locations={[0.2, 0.7, 1]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Optional pink glow */}
      <View style={styles.pinkGlow} />

      {/* Background image fades in on large screens */}
      <Animated.View style={[styles.imageWrapper, { opacity: fadeAnim }]}>
        <ImageBackground
          source={require("../assets/cinema-background.png")}
          resizeMode="cover"
          style={styles.imageBackground}
        />
      </Animated.View>

      {/* App Content */}
      <View style={styles.overlay}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  pinkGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 160,
    height: 160,
    backgroundColor: '#ff9de2',
    opacity: 0.15,
    borderRadius: 80,
    zIndex: -1,
  },
  imageWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});
