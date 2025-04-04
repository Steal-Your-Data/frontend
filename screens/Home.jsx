import React, { useState, useEffect } from "react"; 
import {
  View,
  Text,
  Pressable,
} from "react-native";
import GradientBackground from "../components/GradientBackground";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInUp,
  withDelay,
} from "react-native-reanimated";
import "../global.css";

function Home(props) {
    const letters = ["C", "i", "n", "e", "M", "a", "t", "c", "h"];
    const animations = letters.map(() => ({
      x: useSharedValue(0),
      y: useSharedValue(0),
      r: useSharedValue(0),
    }));
    const [trigger, setTrigger] = useState(false);
  
    const handleBounce = () => {
      animations.forEach((anim, index) => {
        const randomX = (Math.random() - 0.5) * 60; // -30 to 30
        const randomY = (Math.random() - 1) * 60;   // -60 to 0
        const randomR = (Math.random() - 0.5) * 40; // -20 to 20 degrees
  
        anim.x.value = withDelay(index * 80, withSpring(randomX, { damping: 4 }));
        anim.y.value = withDelay(index * 80, withSpring(randomY, { damping: 4 }));
        anim.r.value = withDelay(index * 80, withSpring(randomR, { damping: 6 }));
  
        setTimeout(() => {
          anim.x.value = withSpring(0);
          anim.y.value = withSpring(0);
          anim.r.value = withSpring(0);
        }, 500 + index * 100);
      });
  
      setTrigger(!trigger);
    };
  
    useEffect(() => {
      handleBounce();
    }, []);
  
    return (
      <GradientBackground>
        <View className="flex-1 justify-center items-center px-4">
          {/* Glowing Mood Title with Bouncing Easter Egg */}
          <Pressable onPress={handleBounce} className="mb-6">
            <View className="flex-row">
              {letters.map((char, index) => {
                const animatedStyle = useAnimatedStyle(() => ({
                  transform: [
                    { translateX: animations[index].x.value },
                    { translateY: animations[index].y.value },
                    { rotate: `${animations[index].r.value}deg` },
                  ],
                }));
  
                return (
                  <Animated.Text
                    key={index}
                    style={[
                      {
                        textShadowColor: 'rgba(255,165,0,0.6)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 14,
                      },
                      animatedStyle,
                    ]}
                    className="text-orange-50 text-7xl font-extrabold tracking-tight"
                  >
                    {char}
                  </Animated.Text>
                );
              })}
            </View>
          </Pressable>
  
          {/* Animated Card */}
          <Animated.View
            entering={FadeInUp.duration(600)}
            className="bg-orange-50 rounded-2xl shadow-2xl w-full max-w-sm p-6 items-center border border-white/30"
          >
            <Text className="text-gray-700 text-lg font-semibold text-center mb-2">
              What are you in the mood for?
            </Text>
  
            <Text className="text-gray-500 text-sm text-center mb-6 leading-relaxed">
              Find something to watch by joining a matching session or hosting your own!
            </Text>
  
            <Pressable
              className="bg-orange-500 px-6 py-3 rounded-lg mb-3 w-full active:scale-[.98]"
              onPress={() => props.setIsJoining(true)}
              style={{
                shadowColor: '#FFA500',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 10,
              }}
            >
              <Text className="text-center text-white font-semibold text-base">Join</Text>
            </Pressable>
  
            <Pressable
              className="bg-orange-600 px-6 py-3 rounded-lg mb-3 w-full active:scale-[.98]"
              onPress={() => props.setIsHosting(true)}
              style={{
                shadowColor: '#FFA500',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 10,
              }}
            >
              <Text className="text-center text-white font-semibold text-base">Host</Text>
            </Pressable>
          </Animated.View>
  
          {/* Footer / Tagline */}
          <Text className="text-white text-sm text-center mt-10 opacity-60 italic">
            Mood • Match. Watch. Vibe.
          </Text>
  
          {/* Extra Detail */}
          <Text className="text-white text-xs text-center mt-3 opacity-40">
            Your watch party awaits 🍿
          </Text>
        </View>
      </GradientBackground>
    );
  }
  
  export default Home;
  