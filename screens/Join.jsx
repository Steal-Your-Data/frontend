import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import GradientBackground from "../components/GradientBackground";
import "../global.css";

function Join(props) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState("");

  const handleInputCode = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setCode(numericText);
  };

  const isDisabled = code.trim() === "" || name.trim() === "";

  useEffect(() => {
    if (props.joinError) {
      setLocalError(props.joinError);
    }
  }, [props.joinError]);

  // sets error message and handles joining
  const onJoining = async () => {
    if (code.length !== 6) {
      setLocalError("Session code must be six digits");
      return;
    }
  
    setLocalError("");
  
    const success = await props.handleJoinSession(code, name);
    if (!success && props.joinError) {
      setLocalError(props.joinError);
    }
  };
  
  return (
    <GradientBackground>
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
            onChangeText={(text) => {
              setName(text);
              setLocalError(""); // Clear error as user types
            }}
            placeholder="Your Name"
            placeholderTextColor="#999"
            className="border border-gray-300 rounded-md px-4 py-3 text-base w-full mb-4"
          />

          {localError !== "" && (
            <Text className="text-red-500 text-sm mb-2 self-start pl-1">
              {localError}
            </Text>
          )}


          <Pressable
            style={[
              styles.button,
              isDisabled ? styles.buttonDisabled : styles.buttonEnabled,
            ]}
            onPress={onJoining}
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
    backgroundColor: "#f97316", // orange-500
  },
  buttonDisabled: {
    backgroundColor: "#d1d5db", // gray-300
  },
});

export default Join;
