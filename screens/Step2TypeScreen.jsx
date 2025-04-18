import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

export default function Step2TypeScreen({ onNext, sessionCode, participantID }) {
  const [selectedType, setSelectedType] = useState("");

  const handleNext = () => {
    const sort = selectedType === "Latest releases" ? "release_date" :
                 selectedType === "Popular classics" ? "popularity" : "";
    const order = "desc"; // Assuming always descending for now
  
    onNext({ sortBy: sort, order });  // Send sort config
  };  

  return (
    <View className="flex-1 justify-center items-center bg-black px-6">
      <Text className="text-gray-400 text-lg mb-2">Step 2 of 3</Text>
      <Text className="text-white text-2xl font-bold mb-8 text-center">
        What kind of movies are you looking for?
      </Text>

      {["Latest releases", "Popular classics", "Any"].map((type) => (
        <Pressable 
          key={type} 
          onPress={() => setSelectedType(type)}
          className={`bg-gray-100 p-4 w-full rounded-lg items-center mb-4 ${selectedType === type ? 'bg-orange-300' : ''}`}        >
          <Text className="text-black text-lg">{type}</Text>
        </Pressable>
      ))}

      <Pressable 
        onPress={handleNext} 
        className="bg-orange-500 px-12 py-3 rounded-full mt-6"
      >
        <Text className="text-white font-bold text-lg">Next</Text>
      </Pressable>
    </View>
  );
}
