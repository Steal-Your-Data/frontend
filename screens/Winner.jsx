import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import GradientBackground from '../components/GradientBackground'; // ✅ Use your custom component
import "../global.css";

function Winner({ finalVotes, setGoWinner, setGoHome, fetchWinner }) {
  const [movie, setMovie] = useState([]);
  const [winningMovies, setWinningMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState(0);
  const confettiRef = useRef(null);

  useEffect(() => {
    const loadWinner = async () => {
      setLoading(true); // Set loading state before fetching
      const fetchedWinner = await fetchWinner(); // Call the async function
      setMovie(fetchedWinner.movies_list);
      setLoading(false);
    };
    loadWinner();
  }, []);

  useEffect(() => {
    setWinningMovies(Array.isArray(movie) ? movie : [movie]);
  }, [movie]);

  useEffect(() => {
    if (!loading && confettiRef.current) {
      confettiRef.current.start();
    }
  }, [loading]);

  const handleReturnHome = () => {
    setGoWinner(false);
    setGoHome(true);
  };

  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text className="text-white mt-4 text-base">Calculating Winner...</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text className="text-3xl font-black text-white text-center mb-2">🏆 Winner 🏆</Text>

        {winningMovies.length > 1 && (
          <Text className="text-orange-300 text-base text-center mb-4">
            It's a tie! Multiple winners.
          </Text>
        )}

        {winningMovies.map((movie) => (
          <View
            key={movie?.movie?.id}
            className="items-center bg-white rounded-2xl shadow-lg p-4 mb-6 w-full max-w-md"
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.movie?.poster_path}` }}
              className="w-64 h-96 rounded-xl mb-4"
            />
            <Text className="text-[#0a0f24] text-xl font-bold text-center mb-2">
              {movie?.movie?.title}
            </Text>
            <Text className="text-gray-700 text-sm text-center mb-3 px-2">
              {movie?.movie?.overview}
            </Text>
            <Text className="text-blue-600 font-semibold text-base">
              Votes: {movie?.votes || 0}
            </Text>
          </View>
        ))}

        <TouchableOpacity
          className="bg-orange-500 px-6 py-3 rounded-xl mt-6"
          onPress={handleReturnHome}
        >
          <Text className="text-white font-bold text-lg text-center">Return to Home</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfettiCannon
        count={100}
        origin={{ x: 200, y: -20 }}
        fadeOut
        autoStart={false}
        ref={confettiRef}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 80,
    paddingBottom: 40,
  },
});

export default Winner;
