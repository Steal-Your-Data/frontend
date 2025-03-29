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
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import "../global.css";

function Winner({ finalVotes, setGoWinner, setGoHome, fetchWinner }) {
  const [movie, setMovie] = useState([]);
  const [winningMovies, setWinningMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState(0);
  const confettiRef = useRef(null);

  useEffect(() => {
    const loadWinner = async () => {
      setLoading(true);
      const fetchedWinner = await fetchWinner();
      setMovie(fetchedWinner.movieInfo);
      setVotes(fetchedWinner.votes);
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
      <LinearGradient
        colors={["#0a0f24", "#010409"]}
        style={styles.gradient}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text className="text-white mt-4 text-base">Calculating Winner...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0a0f24", "#010409"]}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >
        <Text className="text-3xl font-black text-white text-center mb-2">🏆 Winner 🏆</Text>

        {winningMovies.length > 1 && (
          <Text className="text-orange-300 text-base text-center mb-4">
            It's a tie! Multiple winners.
          </Text>
        )}

        {winningMovies.map((movie) => (
          <View
            key={movie.id}
            className="items-center bg-white rounded-2xl shadow-lg p-4 mb-6 w-full max-w-md"
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
              className="w-64 h-96 rounded-xl mb-4"
            />
            <Text className="text-[#0a0f24] text-xl font-bold text-center mb-2">
              {movie.title}
            </Text>
            <Text className="text-gray-700 text-sm text-center mb-3 px-2">
              {movie.overview}
            </Text>
            <Text className="text-blue-600 font-semibold text-base">
              Votes: {votes || 0}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 80,      // pushes content down
    paddingBottom: 40,   // gives breathing room under button
  },
});

export default Winner;
