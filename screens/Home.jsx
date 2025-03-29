import {
    View,
    Text,
    Pressable,
  } from "react-native";
  import GradientBackground from "../components/GradientBackground"; // <-- make sure this path matches your file structure
  import "../global.css";
  
  function Home(props) {
    return (
      <GradientBackground>
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-white/90 rounded-2xl shadow-lg w-full max-w-sm p-6 items-center">
            <Text className="text-[#0a0f24] text-4xl font-black text-center mb-1 tracking-tight">
              Mood
            </Text>
  
            <Text className="text-gray-700 text-lg font-semibold text-center mb-2">
              What are you in the mood for?
            </Text>
  
            <Text className="text-gray-500 text-sm text-center mb-6 leading-relaxed">
              Find something to watch by joining a matching session or hosting your own!
            </Text>
  
            <Pressable
              className="bg-orange-500 px-6 py-3 rounded-lg mb-3 w-full active:scale-[.98]"
              onPress={() => props.setIsJoining(true)}
            >
              <Text className="text-center text-white font-semibold text-base">Join</Text>
            </Pressable>
  
            <Pressable
              className="bg-orange-600 px-6 py-3 rounded-lg mb-3 w-full active:scale-[.98]"
              onPress={() => props.setIsHosting(true)}
            >
              <Text className="text-center text-white font-semibold text-base">Host</Text>
            </Pressable>
  
            <Pressable
              className="bg-orange-700 px-6 py-3 rounded-lg w-full active:scale-[.98]"
              onPress={() => props.setGoWaiting(true)}
            >
              <Text className="text-center text-white font-semibold text-base">Waiting</Text>
            </Pressable>
          </View>
  
          <Text className="text-white text-sm text-center mt-10 opacity-60 italic">
            Mood • Match. Watch. Vibe.
          </Text>
        </View>
      </GradientBackground>
    );
  }
  
  export default Home;
  