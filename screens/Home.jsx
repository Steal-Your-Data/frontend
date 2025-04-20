import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
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
      const randomX = (Math.random() - 0.5) * 60;
      const randomY = (Math.random() - 1) * 60;
      const randomR = (Math.random() - 0.5) * 40;

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
    const interval = setInterval(handleBounce, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center items-center px-4 pt-16 pb-10">
          {/* Title Animation */}
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
                    style={[{
                      textShadowColor: 'rgba(255,165,0,0.6)',
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 14,
                    }, animatedStyle]}
                    className="text-orange-50 text-7xl font-extrabold tracking-tight"
                  >
                    {char}
                  </Animated.Text>
                );
              })}
            </View>
          </Pressable>

          {/* Welcome Prompt */}
          <Animated.View
            entering={FadeInUp.duration(600)}
            className="bg-orange-50 rounded-2xl shadow-2xl w-full max-w-md p-6 items-center border border-white/30 mb-6"
          >
            <Text className="text-gray-800 text-lg font-semibold text-center mb-2">
              What are you in the mood for?
            </Text>
            <Text className="text-gray-500 text-sm text-center mb-4 leading-relaxed">
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

             {/* Step Preview Buttons */}
              <Pressable
                  className="bg-gray-700 px-6 py-3 rounded-lg mb-3 w-full active:scale-[.98]"
                  onPress={() => props.navigation.navigate("Step1")}
              >
                  <Text className="text-center text-white font-semibold text-base">Preview Step 1</Text>
              </Pressable>
             <Pressable
              className="bg-orange-600 px-6 py-3 rounded-lg mb-3 w-full active:scale-[.98]"
              onPress={() => props.setGoCatalog(true)}
              style={{
                shadowColor: '#FFA500',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 10,
              }}
            >    
              <Text className="text-center text-white font-semibold text-base">CATALOG</Text>

            </Pressable>

          </Animated.View>

          {/* Instructions */}
          <Animated.View
            entering={FadeInUp.duration(600)}
            className="bg-white/90 rounded-2xl shadow-xl w-full max-w-md p-6 border border-orange-100 mb-6"
          >
            <Text className="text-orange-600 text-xl font-extrabold mb-4">✨ Don't know what to stream tonight?</Text>

            <View className="mb-4">
              <Text className="text-orange-700 font-bold mb-1">1️⃣ Select your Streaming Platforms</Text>
              <Text className="text-gray-700 text-sm">Pick from Netflix, Prime, or Disney+. Only what's in your region shows up.</Text>
            </View>

            <View className="mb-4">
              <Text className="text-orange-700 font-bold mb-1">🎬 Choose your Genres</Text>
              <Text className="text-gray-700 text-sm">24 genres. All your group's faves. We'll handle the match-up magic.</Text>
            </View>

            <View className="mb-4">
              <Text className="text-orange-700 font-bold mb-1">👯 Invite Friends</Text>
              <Text className="text-gray-700 text-sm">Link, QR, or ID — everyone joins, swipes, and vibes together.</Text>
            </View>

            <View className="mb-4">
              <Text className="text-orange-700 font-bold mb-1">👉 Start Swiping</Text>
              <Text className="text-gray-700 text-sm">Left = nah. Right = let’s go. When everyone hearts the same one, it’s movie time!</Text>
            </View>

            <View>
              <Text className="text-orange-700 font-bold mb-1">🎉 Bonus: No installs. No hassle.</Text>
              <Text className="text-gray-700 text-sm">Just browser it. Or pin it. All fun, no fuss.</Text>
            </View>
          </Animated.View>

          {/* Footer */}
          <Text className="text-white text-sm text-center mt-10 opacity-60 italic">
            CineMatch • Match. Watch. Vibe.
          </Text>

          <Text className="text-white text-xs text-center mt-2 opacity-60">
            Your watch party awaits 🍿
          </Text>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

export default Home;