import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import "../global.css";

function Join(props) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const handleInputCode = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setCode(numericText);
  };

  const isDisabled = code.trim() === "" || name.trim() === "";

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0a0f24", "#010409"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View className="flex-1 justify-center items-center px-4">
        <View className="bg-white rounded-2xl shadow-md w-full max-w-sm p-6 items-center">
          <Text className="text-[#0a0f24] text-3xl font-black text-center mb-2">
            Join a Session
          </Text>

          <Text className="text-gray-600 text-sm text-center mb-4">
            Enter your session code and name to join.
          </Text>

          <TextInput
            value={code}
            onChangeText={handleInputCode}
            placeholder="Session Code"
            keyboardType="numeric"
            maxLength={6}
            placeholderTextColor="#999"
            className="border border-gray-300 rounded-md px-4 py-3 text-base w-full mb-4"
          />

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor="#999"
            className="border border-gray-300 rounded-md px-4 py-3 text-base w-full mb-4"
          />

          <Pressable
            style={[
              styles.button,
              isDisabled ? styles.buttonDisabled : styles.buttonEnabled,
            ]}
            onPress={() => props.handleJoinSession(code, name)}
            disabled={isDisabled}
          >
            <Text className="text-center text-white font-semibold text-base">
              JOIN
            </Text>
          </Pressable>

          <TouchableOpacity onPress={() => props.setIsJoining(false)} style={{ marginTop: 8 }}>
            <Text className="text-sm text-gray-500 underline">← Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonEnabled: {
    backgroundColor: "#f97316", // orange-500
  },
  buttonDisabled: {
    backgroundColor: "#d1d5db", // gray-300
  },
});

export default Join;
