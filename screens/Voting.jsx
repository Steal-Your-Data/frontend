import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import GradientBackground from '../components/GradientBackground'; // ✅ custom background
import "../global.css";

function Voting({ setGoVoting, setGoWinner, setFinalVotes, handleYes, handleFinalVote, fetchMovies }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [timer, setTimer] = useState(20); // 20 seconds

  // timer
  useEffect(() => {
    if (timer === 0 && !voted) {
      handleVote(movies[currentIndex].id, "no");
    }
  
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [timer, voted, currentIndex, movies]);
  

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const fetchedMovies = await fetchMovies();
      setMovies(fetchedMovies);
      setLoading(false);
    };

    loadMovies();
  }, []);

  const handleVote = (movieId, voteType) => {
    const newVotes = {
      ...votes,
      [movieId]: (votes[movieId] || 0) + (voteType === "yes" ? 1 : 0),
    };

    setVotes(newVotes);
    if (voteType === "yes") handleYes(movieId);
    setVoted(true);

    setTimeout(() => {
      const isLastMovie = currentIndex >= movies.length - 1;

      if (isLastMovie) {
        setFinalVotes(newVotes);
        handleFinalVote();
      } else {
        setCurrentIndex(currentIndex + 1);
        setVoted(false);
        setTimer(15);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <GradientBackground>
        <View className="flex-1 justify-center items-center px-6">
          <ActivityIndicator size="large" color="#FFA500" />
          <Text className="text-white mt-4 text-base">Loading movies...</Text>
        </View>
      </GradientBackground>
    );
  }

  if (movies.length === 0) {
    return (
      <GradientBackground>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-500 text-lg font-semibold">No movies available.</Text>
        </View>
      </GradientBackground>
    );
  }

  const movie = movies[currentIndex];
  const progress = ((currentIndex + 1) / movies.length) * 100;

  const styles = StyleSheet.create({
    timerContainer: {
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: "#f97316",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 999
    },
    timerText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    }
  });

  return (
    <GradientBackground>
      <View className="flex-1 justify-center items-center px-6 py-4">
        {/* Progress Indicator */}
        <View className="w-full max-w-md mb-6">
          <Text className="text-white text-sm text-center mb-1">
            Movie {currentIndex + 1} of {movies.length}
          </Text>
          <View className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <View style={{ width: `${progress}%` }} className="h-full bg-orange-500" />
          </View>
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            ⏳ {timer}
          </Text>
        </View>

        <Text className="text-white text-2xl font-bold text-center mb-4">
          Vote on this Movie
        </Text>

        {movie.poster_path ? (
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
            className="w-48 h-72 rounded-xl mb-2"
          />
        ):(
          <View className="w-48 h-72 rounded-xl mb-2 justify-center items-center bg-gray-200">
            <Text className="text-gray-500">No image</Text>
          </View>
        )}

        <View className="bg-black bg-opacity-80 rounded-xl w-full max-w-4xl my-4 px-2 justify-center items-center">
          <Text className="text-white text-xl font-semibold text-center my-2">
            {movie.title}
          </Text>
          
          {movie.overview ? (
            <Text className="text-white text-sm text-center mb-3">
              {movie.overview}
            </Text>
          ):(
            <Text className="text-white text-sm text-center mb-3">
              No description available.
            </Text>
          )}
        </View>

        <View className="flex-row justify-around w-full max-w-md">
          <TouchableOpacity
            className={`px-6 py-3 rounded-xl ${voted ? 'bg-green-400 opacity-50' : 'bg-green-500'}`}
            onPress={() => handleVote(movie.id, "yes")}
            disabled={voted}
          >
            <Text className="text-white text-lg font-bold">Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-6 py-3 rounded-xl ${voted ? 'bg-red-400 opacity-50' : 'bg-red-500'}`}
            onPress={() => handleVote(movie.id, "no")}
            disabled={voted}
          >
            <Text className="text-white text-lg font-bold">No</Text>
          </TouchableOpacity>
        </View>

        {voted && (
          <Text className="text-orange-300 text-sm mt-6 italic">
            Thank you for voting! Moving to next...
          </Text>
        )}
      </View>
    </GradientBackground>
  );
}

export default Voting;
