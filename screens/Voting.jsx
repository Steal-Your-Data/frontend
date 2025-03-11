import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getMovies } from '../utils/api'; // Import API function

function Voting({ setGoVoting, setGoWinner, setFinalVotes, fetchMovies }) { // Pass setFinalVotes
    const [movies, setMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [votes, setVotes] = useState({});
    const [voted, setVoted] = useState(false);
    const [loading, setLoading] = useState(true);

    setMovies(fetchMovies());

    console.log(movies);

    const handleVote = (movieId, voteType) => {
        setVotes(prevVotes => ({
            ...prevVotes,
            [movieId]: (prevVotes[movieId] || 0) + (voteType === "yes" ? 1 : 0) // Store "yes" votes
        }));

        setVoted(true);

        setTimeout(() => {
            if (currentIndex < movies.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setVoted(false);
            } else {
                setGoVoting(false);
                setFinalVotes(votes); // Pass votes to Winner screen
                setGoWinner(true);
            }
        }, 1000);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading movies...</Text>
            </View>
        );
    }

    if (movies.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No movies available.</Text>
            </View>
        );
    }

    const movie = movies[currentIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Vote on this Movie ({currentIndex + 1}/{movies.length})</Text>
            <Image source={{ uri: movie.image }} style={styles.movieImage} />
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <Text style={styles.description}>{movie.description}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.yesButton, voted && styles.disabledButton]}
                    onPress={() => handleVote(movie.id, "yes")}
                    disabled={voted}
                >
                    <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.noButton, voted && styles.disabledButton]}
                    onPress={() => handleVote(movie.id, "no")}
                    disabled={voted}
                >
                    <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
            </View>

            {voted && <Text style={styles.thankYouText}>Thank you for voting! Moving to next...</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    movieImage: {
        width: 200,
        height: 300,
        borderRadius: 10,
        marginBottom: 15,
    },
    movieTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginHorizontal: 10,
    },
    yesButton: {
        backgroundColor: '#4CAF50',
    },
    noButton: {
        backgroundColor: '#E53935',
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    thankYouText: {
        fontSize: 16,
        marginTop: 10,
        color: '#555',
    },
    loadingText: {
        fontSize: 18,
        marginTop: 10,
        color: '#555',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
});

export default Voting;
