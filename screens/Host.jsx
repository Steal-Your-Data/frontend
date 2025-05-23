import { useState } from "react";
import { View, Text, TextInput, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import GradientBackground from "../components/GradientBackground";
import "../global.css";

function Host(props) {
  const [hostName, setHostName] = useState("");
  const isDisabled = hostName.trim() === "";

  return (
    <GradientBackground>
      <View className="flex-1 justify-center items-center px-4">
        <View className="bg-white rounded-2xl shadow-md w-full max-w-sm p-6 items-center">
          <Text className="text-[#0a0f24] text-3xl font-black text-center mb-2">
            Host a Session
          </Text>

          <Text className="text-gray-600 text-sm text-center mb-4">
            Enter your name to begin hosting.
          </Text>

          <TextInput
            value={hostName}
            onChangeText={setHostName}
            placeholder="Your name"
            placeholderTextColor="#999"
            className="border border-gray-300 rounded-md px-4 py-3 text-base w-full mb-4"
          />

          <Pressable
            style={[
              styles.button,
              isDisabled ? styles.buttonDisabled : styles.buttonEnabled,
            ]}
            onPress={() => props.handleHostSession(hostName)}
            disabled={isDisabled}
          >
            <Text className="text-center text-white font-semibold text-base">HOST</Text>
          </Pressable>

          <TouchableOpacity onPress={() => props.setIsHosting(false)} style={{ marginTop: 8 }}>
            <Text className="text-sm text-gray-500 underline">← Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonEnabled: {
    backgroundColor: "#ea580c", // orange-600
  },
  buttonDisabled: {
    backgroundColor: "#d1d5db", // gray-300
  },
});

export default Host;
