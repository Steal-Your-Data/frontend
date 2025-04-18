import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

export default function Step1GenreScreen({ onNext, sessionCode, participantID }) {

  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleNext = () => {
    onNext(selectedGenres);  // Go to Step2
  };

  const handleSelectGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };


  return (
    <View className="flex-1 justify-center items-center bg-black px-6">
      <Text className="text-gray-400 text-lg mb-2">Step 1 of 3</Text>
      <Text className="text-white text-2xl font-bold mb-8">Choose a genre</Text>

      <View className="grid grid-cols-2 gap-4 mb-12">
        {["Action", "Horror", "Comedy", "Sci-Fi"].map((genre) => (
          <Pressable
            key={genre}
            onPress={() => handleSelectGenre(genre)}
            className={`p-6 rounded-lg items-center justify-center ${
              selectedGenres.includes(genre) ? "bg-orange-400" : "bg-gray-100"
            }`}
          >
            <Text className="text-black text-lg">{genre}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable 
        onPress={handleNext} 
        className="bg-orange-500 px-12 py-3 rounded-full"
      >
        <Text className="text-white font-bold text-lg">Next</Text>
      </Pressable>
    </View>
  );
}