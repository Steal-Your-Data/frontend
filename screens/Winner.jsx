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
    Easing,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import GradientBackground from '../components/GradientBackground';
import "../global.css";

export default function Winner({ finalVotes, setGoWinner, setGoHome, fetchWinner }) {
    const [movie, setMovie] = useState([]);
    const [winningMovies, setWinningMovies] = useState([]);
    const [finalistMovies, setFinalistMovies] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [winnerId, setWinnerId] = useState(null);

    const scaleAnim = useRef(new Animated.Value(0)).current;

    const spinAnim = useRef(new Animated.Value(0)).current; // horizontal translate for the spinner
    const [spinCompleted, setSpinCompleted] = useState(false);

    const [containerWidth, setContainerWidth] = useState(0);
    const [itemWidth, setItemWidth] = useState(0);

    const confettiRef = useRef(null);

    const [shouldSpin, setShouldSpin] = useState(false);

    useEffect(() => {
        const loadWinner = async () => {
            setLoading(true);
            const fetchedWinner = await fetchWinner();
            console.log(fetchedWinner);
            setMovie(fetchedWinner.movies_list);
            setFinalistMovies(fetchedWinner.movies_list);
            setWinnerId(fetchedWinner.movie_id);
            setLoading(false);
        };
        loadWinner();
    }, [fetchWinner]);

    useEffect(() => {
        var movies = Array.isArray(movie) ? movie : [movie];

        const topFinalists = movies.filter((m) => m.votes === Math.max(...movies.map((m) => m.votes)));

        setWinningMovies(topFinalists);
    }, [movie]);

    useEffect(() => {
        if (!loading && winningMovies.length > 0) {
            if (winningMovies.length === 1) {
                setSelectedMovie(winningMovies[0]);
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => {
                    confettiRef.current?.start();
                });
            } else {
                const timer = setTimeout(() => {
                    setShouldSpin(true);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [loading, winningMovies]);

    useEffect(() => {
        if (shouldSpin && containerWidth > 0 && itemWidth > 0) {
            runTiebreakerSpin();
        }
    }, [shouldSpin, containerWidth, itemWidth]);

    useEffect(() => {
        if (containerWidth && itemWidth) {
            const initialOffset = (containerWidth - itemWidth) / 2;
            spinAnim.setValue(initialOffset);
        }
    }, [containerWidth, itemWidth, spinAnim]);

    const runTiebreakerSpin = () => {
        const singleSetLength = winningMovies.length;
        const actualIndex = winningMovies.findIndex(m => m.movie.id === winnerId); // e.g. 0, 1, or 2

        const finalIndex = actualIndex + 4 * singleSetLength;

        const itemSpacing = itemWidth + 16;
        const initialOffset = (containerWidth - itemWidth) / 2;
        const finalOffset = initialOffset - itemSpacing * finalIndex;

        Animated.timing(spinAnim, {
            toValue: finalOffset,
            duration: 7000,
            easing: Easing.out(Easing.exp),
            useNativeDriver: false,
        }).start(() => {
            setSpinCompleted(true);
            setSelectedMovie(winningMovies[actualIndex]);
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                confettiRef.current?.start();
            });
        });
    };

    const handleReturnHome = () => {
        setGoWinner(false);
        setGoHome(true);
    };

    if (loading) {
        return (
            <View style={[styles.flexCenter, { flex: 1, backgroundColor: '#000' }]}>
                <ActivityIndicator size="large" color="#FFA500" />
                <Text style={{ color: 'white', marginTop: 16, fontSize: 16 }}>
                    Calculating Winner...
                </Text>
            </View>
        );
    }

    return (
        <GradientBackground>
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.header}>🏆 Winner 🏆</Text>
                    {winningMovies.length > 1 && !spinCompleted && !selectedMovie && (
                        <>
                            <Text style={styles.tieText}>
                                It's a tie! Spinning the wheel...
                            </Text>

                            <View
                                style={styles.spinnerContainer}
                                onLayout={(e) => {
                                    const w = e.nativeEvent.layout.width;
                                    if (w !== containerWidth) setContainerWidth(w);
                                }}
                            >
                                <Animated.View
                                    style={{
                                        flexDirection: 'row',
                                        transform: [{ translateX: spinAnim }],
                                    }}
                                >
                                    {[...Array(8)].flatMap(() => winningMovies).map((m, idx) => (
                                        <View
                                            key={idx}
                                            style={styles.itemWrapper}
                                            onLayout={(ev) => {
                                                if (!itemWidth) {
                                                    setItemWidth(ev.nativeEvent.layout.width);
                                                }
                                            }}
                                        >
                                            {m.movie.poster_path ? (
                                                <Image
                                                    source={{ uri: `https://image.tmdb.org/t/p/w500${m.movie.poster_path}` }}
                                                    style={styles.itemPoster}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View style={[styles.itemPoster, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e5e7eb' }]}>
                                                    <Text className="text-gray-500 text-center">No image</Text>
                                                </View>
                                            )}

                                        </View>
                                    ))}
                                </Animated.View>
                            </View>
                        </>
                    )}

                    {selectedMovie && (
                        <Animated.View
                            style={[
                                styles.movieCard,
                                { transform: [{ scale: scaleAnim }] },
                            ]}
                        >
                            {selectedMovie.movie.poster_path ? (
                                <Image
                                    source={{
                                        uri: `https://image.tmdb.org/t/p/w500${selectedMovie.movie.poster_path}`,
                                    }}
                                    style={styles.poster}
                                />
                            ) : (
                                <View className="w-64 h-96 rounded-[10px] mb-4 justify-center items-center bg-gray-200">
                                    <Text className="text-gray-500">No image</Text>
                                </View>
                            )}

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

                    <TouchableOpacity style={styles.returnButton} onPress={handleReturnHome}>
                        <Text style={styles.returnButtonText}>Return to Home</Text>
                    </TouchableOpacity>

                    {(winningMovies.length === 1 || spinCompleted) && finalistMovies && (
                        <View style={styles.finalistsContainer}>
                            <Text style={styles.finalistsHeader}>All Finalists</Text>
                            {finalistMovies
                                .filter((film) => film.movie.id !== winnerId)
                                .sort((a, b) => b.votes - a.votes)
                                .slice(0, 2)
                                .map((film) => (
                                    <View style={styles.finalistItem} key={film.movie.id}>
                                        {film.movie.poster_path ? (
                                            <Image
                                                source={{
                                                    uri: `https://image.tmdb.org/t/p/w500${film.movie.poster_path}`,
                                                }}
                                                style={styles.finalistImage}
                                            />
                                        ) : (
                                            <View style={[styles.finalistImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e5e7eb' }]}>
                                                <Text className="text-gray-500 text-xs text-center">No image</Text>
                                            </View>
                                        )}

                                        <View style={styles.finalistInfo}>
                                            <Text style={styles.finalistTitle}>{film.movie.title}</Text>
                                            <Text style={styles.finalistVotes}>
                                                {film.votes} {film.votes === 1 ? 'vote' : 'votes'}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                        </View>
                    )}
                </ScrollView>

                <ConfettiCannon
                    count={100}
                    origin={{ x: 200, y: -20 }}
                    fadeOut
                    autoStart={false}
                    ref={confettiRef}
                />
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    flexCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 40,
    },
    header: {
        fontSize: 26,
        fontWeight: '900',
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
    },
    tieText: {
        color: '#fbd38d',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 12,
    },
    spinnerContainer: {
        width: '100%',
        height: 200,
        overflow: 'hidden',
        backgroundColor: 'transparent',
        marginBottom: 20,
    },
    itemWrapper: {
        marginHorizontal: 8,
    },
    itemPoster: {
        width: 120,
        height: 180,
        borderRadius: 8,
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
    returnButton: {
        backgroundColor: '#f97316',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 15,
        marginTop: 4,
    },
    returnButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    finalistsContainer: {
        width: '100%',
        marginTop: 30,
        paddingHorizontal: 10,
    },
    finalistsHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        marginBottom: 12,
        textAlign: 'center',
    },
    finalistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 4,
    },
    finalistImage: {
        width: 60,
        height: 90,
        borderRadius: 6,
        marginRight: 12,
    },
    finalistInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    finalistTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0a0f24',
        marginBottom: 4,
    },
    finalistVotes: {
        fontSize: 14,
        color: 'gray',
    },
});
