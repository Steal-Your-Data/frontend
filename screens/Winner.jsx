import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Animated,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import GradientBackground from '../components/GradientBackground'; // ✅ Use your custom component
import "../global.css";

function Winner({ finalVotes, setGoWinner, setGoHome, fetchWinner }) {
    const [movie, setMovie] = useState([]);
    const [winningMovies, setWinningMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const scaleAnim = useRef(new Animated.Value(0)).current; // for card entrance animation
    const confettiRef = useRef(null);
    const [winnerId, setWinnerId] = useState(null);

    useEffect(() => {
        const loadWinner = async () => {
            setLoading(true); // Set loading state before fetching
            const fetchedWinner = await fetchWinner(); // Call the async function
            setMovie(fetchedWinner.movies_list);
            setWinnerId(fetchedWinner.movie_id);
            setLoading(false);
        };
        loadWinner();
    }, [fetchWinner]);

    useEffect(() => {
        setWinningMovies(Array.isArray(movie) ? movie : [movie]);
    }, [movie]);

    useEffect(() => {
        if (!loading && winningMovies.length > 0) {
            // If there is only one winner, use it
            if (winningMovies.length === 1) {
                setSelectedMovie(winningMovies[0]);
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            }
            else if (winningMovies.length > 1) {
                const timer = setTimeout(() => {
                    setSelectedMovie(winningMovies.find((movie) => movie.movie.id === winnerId));


                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }).start();
                }, 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [loading, winningMovies, scaleAnim, winnerId]);

    // Start confetti after selection is made
    useEffect(() => {
        if (!loading && selectedMovie && confettiRef.current) {
            confettiRef.current.start();
        }
    }, [loading, selectedMovie]);

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

                {/* Show tie message until a random movie is picked */}
                {winningMovies.length > 1 && !selectedMovie && (
                    <Text className="text-orange-300 text-base text-center mb-4">
                        It's a tie! Randomly selecting a winner...
                    </Text>
                )}

                {/* Once a movie is selected, display it with an animated entrance */}
                {selectedMovie && (
                    <Animated.View
                        style={[
                            styles.movieCard,
                            { transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        <Image
                            source={{ uri: `https://image.tmdb.org/t/p/w500${selectedMovie?.movie?.poster_path}` }}
                            style={styles.poster}
                        />
                        <Text style={styles.title}>
                            {selectedMovie?.movie?.title}
                        </Text>
                        <Text style={styles.overview}>
                            {selectedMovie?.movie?.overview}
                        </Text>
                        <Text style={styles.votes}>
                            Votes: {selectedMovie?.votes || 0}
                        </Text>
                    </Animated.View>
                )}

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
    movieCard: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '90%',
        maxWidth: 350,
    },
    poster: {
        width: 256,
        height: 384,
        borderRadius: 10,
        marginBottom: 16,
    },
    title: {
        color: '#0a0f24',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    overview: {
        color: 'gray',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    votes: {
        color: '#1E90FF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Winner;
