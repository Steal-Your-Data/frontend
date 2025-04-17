import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function Step1GenreScreen({ navigation }) {
  return (
    <View className="flex-1 justify-center items-center bg-black px-6">
      <Text className="text-gray-400 text-lg mb-2">Step 1 of 3</Text>
      <Text className="text-white text-2xl font-bold mb-8">Choose a genre</Text>

      <View className="grid grid-cols-2 gap-4 mb-12">
        {["Action", "Horror", "Comedy", "Sci-Fi"].map((genre) => (
          <Pressable key={genre} className="bg-gray-100 p-6 rounded-lg items-center justify-center">
            <Text className="text-black text-lg">{genre}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable 
        onPress={() => navigation.navigate('Step2')} 
        className="bg-orange-500 px-12 py-3 rounded-full"
      >
        <Text className="text-white font-bold text-lg">Next</Text>
      </Pressable>
    </View>
  );
}