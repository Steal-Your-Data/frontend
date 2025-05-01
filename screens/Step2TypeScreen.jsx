import React, {useState} from 'react';
import {View, Text, Pressable, SafeAreaView} from 'react-native';
import GradientBackground from "../components/GradientBackground";

export default function Step2TypeScreen({onNext, sessionCode, participantID}) {
    const [selectedType, setSelectedType] = useState("");

    const handleNext = () => {
        const sort = selectedType === "Latest releases" ? "release_date" :
            selectedType === "Popular movies" ? "popularity" : "";
        const order = "desc"; // Assuming always descending for now

        onNext({sortBy: sort, order});  // Send sort config
    };

    return (
        <GradientBackground>
            <SafeAreaView className="flex-1 bg-transparent">
                <View className="flex-1 justify-center items-center bg-transparent px-6">
                    <Text className="text-gray-400 text-lg mb-2">Step 2 of 3</Text>
                    <Text className="text-white text-3xl font-bold mb-8 text-center">
                        What kind of movies are you looking for?
                    </Text>

                    {["Latest releases", "Popular movies"].map((type) => (
                        <Pressable
                            key={type}
                            onPress={() => setSelectedType(type)}
                            className={`bg-gray-100 p-4 w-full max-w-4xl rounded-lg items-center mb-4 shadow-lg ${selectedType === type ? 'bg-orange-500/90 border-orange-300' : 'bg-white/10 border-white/20'}`}>
                            <Text
                                className={`text-center font-semibold leading-tight lg:text-xl ${
                                    selectedType === type ? "text-black" : "text-white/80"
                                }`}
                            >
                                {type}
                            </Text>
                        </Pressable>
                    ))}
                </View>
                <View className="p-6 bg-orange-50/10 border-t border-white/20">
                    <Pressable
                        onPress={handleNext}
                        disabled={selectedType.length === 0}
                        className={`rounded-full px-12 py-3 ${
                            selectedType.length ? "bg-orange-500" : "bg-gray-600"
                        }`}
                    >
                        <Text className="text-white font-bold text-lg text-center">Next</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}
