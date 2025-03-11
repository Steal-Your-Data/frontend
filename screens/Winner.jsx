import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getMovies } from '../utils/api';

function Winner({ finalVotes, setGoWinner, setGoHome, fetchWinner}) { // Accept setGoHome
    const [movie, setMovie] = useState([]);
    const [winningMovies, setWinningMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [votes, setVotes] = useState(0);


     // Use useEffect to fetch movies once when component mounts
    useEffect(() => {
        const loadWinner = async () => {
            setLoading(true); // Set loading state before fetching
            const fetchedWinner = await fetchWinner(); // Call the async function
            setMovie(fetchedWinner.movieInfo);
            setVotes(fetchedWinner.votes); // Set the movies state
            setLoading(false); // Mark loading as false after fetching
        };
     
            loadWinner();
    }, []); // Dependency array ensures it runs once

    useEffect(() => {
        setWinningMovies(Array.isArray(movie) ? movie : [movie]); // Ensure it's an array
    }, [movie]);

    const handleReturnHome = () => {
        setGoWinner(false); // Exit Winner Screen
        setGoHome(true); // Navigate back to Home
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Calculating Winner...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.header}>🏆 Winner 🏆</Text>
            {winningMovies.length > 1 && <Text style={styles.subHeader}>It's a tie! Multiple winners.</Text>}

            {winningMovies.map((movie) => (
                <View key={movie.id} style={styles.movieContainer}>
                    <Image source={{ uri:`https://image.tmdb.org/t/p/w500${movie.poster_path}` }} style={styles.movieImage} />
                    <Text style={styles.movieTitle}>{movie.title}</Text>
                    <Text style={styles.description}>{movie.overview}</Text>
                    <Text style={styles.voteCount}>Votes: { votes || 0}</Text>
                </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleReturnHome}>
                <Text style={styles.buttonText}>Return to Home</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#f8f8f8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 15,
        textAlign: 'center',
    },
    movieContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        width: '90%',
    },
    movieImage: {
        width: 250,
        height: 350,
        borderRadius: 10,
        marginBottom: 10,
    },
    movieTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    voteCount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    button: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 20,
        color: '#555',
        marginTop: 10,
    },
});

export default Winner;
