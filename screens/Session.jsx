import { View, Text, Pressable, FlatList } from 'react-native';
import GradientBackground from "../components/GradientBackground";
import "../global.css"; // NativeWind CSS import

function Session(props) { 
  const isHost = props.name == props.hostName;
  const enoughParticipants = props.participants.length >= 2;

  return (
    <GradientBackground>
      <View className="flex-1 justify-center items-center px-4">
        <View className="bg-white rounded-2xl shadow-md w-full max-w-sm p-6 items-center">
          <Text className="text-[#0a0f24] text-2xl font-extrabold text-center mb-2">
            {props.hostName}'s Session
          </Text>

          <Text className="text-gray-700 text-base mb-4">
            Code: <Text className="font-semibold">{props.sessionCode}</Text>
          </Text>

          <Text className="text-gray-800 text-lg font-bold mb-2">Participants:</Text>

          <FlatList
            data={props.participants}
            keyExtractor={(item, index) => index.toString()}
            className="mb-4 w-full"
            contentContainerStyle={{ alignItems: 'center' }}
            renderItem={({ item }) => (
              <Text className="text-base text-center text-gray-700 py-1">{item}</Text>
            )}
          />

          <Text className="text-gray-600 text-sm mb-4">
            {props.participants.length} participant
            {props.participants.length !== 1 && 's'}
          </Text>

          {isHost ? (
            <Pressable
              className={`px-6 py-3 rounded-lg w-full ${
                enoughParticipants
                  ? 'bg-orange-600 active:scale-[.98]'
                  : 'bg-gray-300'
              }`}
              onPress={props.handleStartSession}
              //disabled={!enoughParticipants}
            >
              <Text
                className={`text-center font-semibold text-base ${
                  enoughParticipants ? 'text-white' : 'text-gray-500'
                }`}
              >
                START
              </Text>
            </Pressable>
          ) : (
            <Text className="text-gray-500 italic">Waiting for host to start...</Text>
          )}

          <Pressable
              className="px-3 py-2 rounded-lg w-32 bg-red-600 active:scale-[.98] mt-4"
              onPress={props.handleLeaveSession}
          >
            <Text
                className={`text-center font-semibold text-base ${
                    'text-white-500'
                }`}
            >
              LEAVE
            </Text>
          </Pressable>
        </View>
      </View>
    </GradientBackground>
  );
}

export default Session;
