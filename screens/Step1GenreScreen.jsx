import React, {useState} from "react";
import {SafeAreaView, ScrollView, View, Text, Pressable} from "react-native";
import GradientBackground from "../components/GradientBackground";

const GENRES = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Thriller",
    "War",
    "Western",
];

export default function Step1GenreScreen({onNext}) {
    const [selectedGenres, setSelectedGenres] = useState([]);

    const handleSelectGenre = (genre) => {
        setSelectedGenres((prev) => {
            if (prev.includes(genre)) {
                return prev.filter((g) => g !== genre);
            }
            if (prev.length >= 3) return prev; // limit to 3 selections
            return [...prev, genre];
        });
    };

    const handleNext = () => onNext(selectedGenres);

    return (
        <GradientBackground>
            <SafeAreaView className="flex-1 bg-transparent">
                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{alignItems: "center", paddingBottom: 24}}
                    showsVerticalScrollIndicator={false}
                >

                    <Text className="text-gray-400 text-lg mt-6 mb-2">Step 1 of 3</Text>
                    <Text className="text-white text-3xl font-bold mb-6 text-center">
                        Choose up to 3 genres
                    </Text>

                    <View className="flex-row flex-wrap justify-center">
                        {GENRES.map((genre) => {
                            const isSelected = selectedGenres.includes(genre);
                            return (
                                <Pressable
                                    key={genre}
                                    onPress={() => handleSelectGenre(genre)}
                                    className={`w-[30%] sm:w-[18%] md:w-[15%] lg:w-[15%] aspect-square m-2 rounded-2xl items-center justify-center border-2 ${
                                        isSelected
                                        ? "bg-orange-500 border-orange-300"
                                        : "bg-white/90 border-gray-300"
                                    }`}
                                    >
                                    <Text
                                        className={`text-center font-bold text-base md:text-lg ${
                                        isSelected ? "text-black" : "text-black"
                                        }`}
                                    >
                                        {genre}
                                    </Text>
                                    </Pressable>

                            );
                        })}
                    </View>
                </ScrollView>


                {/* footer with sticky button */}
                <View className="p-6 bg-orange-50/10 border-t border-white/20">
                    <Pressable
                        onPress={handleNext}
                        disabled={selectedGenres.length === 0}
                        className={`rounded-full px-12 py-3 ${
                            selectedGenres.length ? "bg-orange-500" : "bg-gray-600"
                        }`}
                    >
                        <Text className="text-white font-bold text-lg text-center">Next</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}
