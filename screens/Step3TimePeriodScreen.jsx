import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';

export default function Step3TimePeriodScreen({ onNext, sessionCode, participantID }) {

  const handleNext = () => {
    onNext({ from: fromYear, to: toYear }); // Pass year range
  };
  

  const [fromYear, setFromYear] = useState("2000");
  const [toYear, setToYear] = useState("2020");

  return (
    <View className="flex-1 justify-center items-center bg-black px-6">
      <Text className="text-gray-400 text-lg mb-2">Step 3 of 3</Text>
      <Text className="text-white text-2xl font-bold mb-8 text-center">
        What time period are you interested in?
      </Text>

      <View className="flex-row justify-between space-x-4 mb-12">
        <View className="bg-gray-800 p-4 rounded-lg w-32 items-center">
          <Text className="text-gray-400 mb-2">From</Text>
          <TextInput 
            keyboardType="numeric" 
            className="text-white text-xl text-center w-full"
            value={fromYear}
            onChangeText={setFromYear}
          />
        </View>
        <View className="bg-gray-800 p-4 rounded-lg w-32 items-center">
          <Text className="text-gray-400 mb-2">To</Text>
          <TextInput 
            keyboardType="numeric" 
            className="text-white text-xl text-center w-full"
            value={toYear}
            onChangeText={setToYear}
          />
        </View>
      </View>

      <Pressable 
        onPress={handleNext}
        className="bg-orange-500 px-12 py-3 rounded-full"
      >
        <Text className="text-white font-bold text-lg">Finish</Text>
      </Pressable>
    </View>
  );
}
