import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import io from 'socket.io-client';
import "../global.css";

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
});

function Waiting({ finishedUsers, participants }) {
  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-[#0a0f24] to-[#010409] px-4">
      <Text className="text-white text-xl font-bold text-center mb-4">
        Waiting for Everyone to Finish...
      </Text>

      <ActivityIndicator size="large" color="#FFA500" />

      <Text className="text-white text-lg mt-6">
        {finishedUsers}/{participants.length} people have finished
      </Text>
    </View>
  );
}

export default Waiting;