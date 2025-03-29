import {
    View,
    Text,
    Pressable,
  } from "react-native";
  import GradientBackground from "../components/GradientBackground";
  import Animated, { FadeInUp } from "react-native-reanimated";
  import "../global.css";
  
  function Home(props) {
    return (
      <GradientBackground>
        <View className="flex-1 justify-center items-center px-4">
  
          {/* Glowing Mood Title */}
        <Text
        className="text-white text-8xl font-extrabold tracking-tight mb-6"
        style={{
            paddingBottom: 10, // adds separation from the modal
            textShadowColor: 'rgba(255,165,0,0.6)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 14,
        }}
        >
        Mood
        </Text>
  
          {/* Animated Card */}
          <Animated.View
            entering={FadeInUp.duration(600)}
            className="bg-white/90 rounded-2xl shadow-2xl w-full max-w-sm p-6 items-center border border-white/30"
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
  