import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function Step2TypeScreen({ navigation }) {
  return (
    <View className="flex-1 justify-center items-center bg-black px-6">
      <Text className="text-gray-400 text-lg mb-2">Step 2 of 3</Text>
      <Text className="text-white text-2xl font-bold mb-8 text-center">
        What kind of movies are you looking for?
      </Text>

      {["Latest releases", "Popular classics", "Any"].map((type) => (
        <Pressable 
          key={type} 
          className="bg-gray-100 p-4 w-full rounded-lg items-center mb-4"
        >
          <Text className="text-black text-lg">{type}</Text>
        </Pressable>
      ))}

      <Pressable 
        onPress={() => navigation.navigate('Step3')} 
        className="bg-orange-500 px-12 py-3 rounded-full mt-6"
      >
        <Text className="text-white font-bold text-lg">Next</Text>
      </Pressable>
    </View>
  );
}
