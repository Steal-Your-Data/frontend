import React, {useState} from 'react';
import {View, Text, Pressable, SafeAreaView} from 'react-native';
import GradientBackground from "../components/GradientBackground";

export default function Step2TypeScreen({onNext, sessionCode, participantID}) {
    const [selectedType, setSelectedType] = useState("");

    const handleNext = () => {
        const sort = selectedType === "Latest releases" ? "release_date" :
            selectedType === "Popular movies" ? "popularity" : "";
        const order = "desc";
        onNext({sortBy: sort, order});
    };

    return (
        <GradientBackground>
            <SafeAreaView className="flex-1 bg-transparent">
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-gray-400 text-lg mb-2">Step 2 of 3</Text>
                    <Text className="text-white text-3xl font-bold mb-8 text-center">
                        What kind of movies are you looking for?
                    </Text>

                    {["Latest releases", "Popular movies"].map((type) => {
                        const isSelected = selectedType === type;
                        return (
                            <Pressable
                                key={type}
                                onPress={() => setSelectedType(type)}
                                className={`w-full max-w-4xl rounded-2xl p-4 mb-4 border-2 shadow-xl items-center ${
                                    isSelected
                                        ? "bg-orange-500 border-orange-300"
                                        : "bg-white/90 border-gray-300"
                                }`}
                            >
                                <Text
                                    className={`text-center font-semibold text-lg ${
                                        isSelected ? "text-black" : "text-black"
                                    }`}
                                >
                                    {type}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <View className="p-6 border-t border-white/20 bg-white/20">
                    <Pressable
                        onPress={handleNext}
                        disabled={selectedType.length === 0}
                        className={`rounded-full px-12 py-4 shadow-xl ${
                            selectedType.length ? "bg-orange-500" : "bg-gray-500"
                        }`}
                    >
                        <Text className="text-black font-bold text-lg text-center">Next</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}
