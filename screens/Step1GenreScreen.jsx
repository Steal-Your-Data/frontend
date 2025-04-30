import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, Text, Pressable } from "react-native";

const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
  "Drama", "Family", "Fantasy", "History", "Horror", "Music",
  "Mystery", "Romance", "Science Fiction", "Thriller", "War", "Western",
];

export default function Step1GenreScreen({ onNext }) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleSelectGenre = (genre) => {
    if (selectedGenres.length >= 3 && !selectedGenres.includes(genre)) return;

    setSelectedGenres((prev) =>
        prev.includes(genre)
            ? prev.filter((g) => g !== genre)
            : [...prev, genre]
    );
  };

  const handleNext = () => onNext(selectedGenres);

  return (
      <SafeAreaView className="flex-1 bg-black">
        <ScrollView
            className="flex-1 px-6"
            contentContainerStyle={{ alignItems: "center", paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
          <Text className="text-gray-400 text-lg mt-6 mb-2">Step 1 of 3</Text>
          <Text className="text-white text-3xl font-bold mb-6 text-center">
            Choose up to 3 genres
          </Text>

          <View className="flex-row flex-wrap justify-center">
            {GENRES.map((genre) => (
                <Pressable
                    key={genre}
                    onPress={() => handleSelectGenre(genre)}
                    className={`w-[30%] sm:w-[18%] md:w-[15%] lg:w-[15%] aspect-square m-1 rounded-md items-center justify-center ${
                        selectedGenres.includes(genre) ? "bg-orange-400" : "bg-gray-100"
                    }`}
                >
                  <Text className="text-lg text-black text-center font-semibold leading-tight lg:text-2xl flex-wrap">
                    {genre}
                  </Text>
                </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* footer with sticky button */}
        <View className="p-6">
          <Pressable
              onPress={handleNext}
              disabled={selectedGenres.length === 0}
              className={`rounded-full px-12 py-3 ${
                  selectedGenres.length ? "bg-orange-500" : "bg-gray-600"
              }`}
          >
            <Text className="text-white font-bold text-lg text-center">
              Next
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
  );
}
