import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import io from 'socket.io-client';
import "../global.css";

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
});

function Waiting({ setGoWaiting, setGoVoting }) {
  const totalUsers = 4; // Could be dynamic later
  const [finishedUsers, setFinishedUsers] = useState(0);
  const [countdown, setCountdown] = useState(1); // Placeholder countdown

  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-[#0a0f24] to-[#010409] px-4">
      <Text className="text-white text-xl font-bold text-center mb-4">
        Waiting for Everyone to Finish...
      </Text>

      <ActivityIndicator size="large" color="#FFA500" />

      <Text className="text-white text-lg mt-6">
        {finishedUsers}/{totalUsers} people have finished voting
      </Text>

      <Text className="text-orange-300 text-base mt-2">
        Time Remaining: {countdown}s
      </Text>
    </View>
  );
}

export default Waiting;