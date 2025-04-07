import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Dimensions,
    TextInput,
    SafeAreaView,
    StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import {StatusBar} from "expo-status-bar";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from "react-native-reanimated";
import {LinearGradient} from "expo-linear-gradient";
import "../global.css";
import GradientBackground from '../components/GradientBackground';

export default function Catalog(props) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovies, setSelectedMovies] = useState({});
    const [isCartVisible, setCartVisible] = useState(false);
    const [isLimitModalVisible, setLimitModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const {width} = Dimensions.get("window");
    const [timer, setTimer] = useState(180); // three minutes (in seconds)
    //const [selectedGenres, setSelectedGenres] = useState([]);

    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [onlyInTheater, setOnlyInTheater] = useState("");
    const [selectedSort, setSelectedSort] = useState("");
    const [selectedOrder, setSelectedOrder] = useState("");

    const sortList = ["popularity", "title", "release_date"];
    const sortOrderList = ["asc", "desc"];
    const genresList = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"]; // Replace with actual list
    const languageList = ["en", "la"]; // Replace with actual list
    const releaseYears = Array.from({length: 30}, (_, i) => 2024 - i); // past 30 years
    
    // timer
    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) {
                setTimer((prevTimer) => prevTimer - 1);
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    };
    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await fetch(
                `https://backend-production-e0e1.up.railway.app/movies/get_all_movies`
            );
            const data = await response.json();
            setMovies(data);
        } catch (error) {
            console.error("Failed to fetch movies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterClick = async () => {
        const params = new URLSearchParams();

        selectedGenres.forEach((genre) => params.append("genres", genre));
        if (selectedLanguage) params.append("language", selectedLanguage);
        if (selectedYear) params.append("release_year", selectedYear);
        if (onlyInTheater) params.append("only_in_theater", onlyInTheater);
        if (sortList) params.append("sort_by", selectedSort);
        if (sortOrderList) params.append("order", selectedOrder);

        try {
            const response = await fetch(`https://backend-production-e0e1.up.railway.app/movies/filter_and_sort?${params.toString()}`);
            const filtered = await response.json();
            setMovies(filtered); // Or call a handler from App.js like handleFilter(filtered)
        } catch (error) {
            console.error("Failed to fetch filtered movies:", error);
        }
    };

    let maxNumber;
    if (props.participants.length < 4) {
        maxNumber = 3;
    } else if (props.participants.length > 3 && props.participants.length < 6) {
        maxNumber = 2;
    } else {
        maxNumber = 1;
    }

    const selectedCount = Object.values(selectedMovies).filter(Boolean).length;

    const toggleSelectMovie = (id) => {
        if (!selectedMovies[id] && selectedCount >= maxNumber) {
            setLimitModalVisible(true);
            return;
        }
        setSelectedMovies((prev) => ({...prev, [id]: !prev[id]}));
    };

    const removeFromCart = (id) => {
        setSelectedMovies((prev) => ({...prev, [id]: false}));
    };

    const numColumns = width > 900 ? 4 : width > 600 ? 3 : 2;
    const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={{flex: 1}}>
            <GradientBackground>
                <SafeAreaView style={{flex: 1}}>
                    <StatusBar style="light"/>

                    <View className="px-4">
                        <Text className="text-white text-3xl font-black text-center mb-4">
                            Movie Catalog
                        </Text>

                        <TextInput
                            className="bg-white text-black px-4 py-2 rounded-lg mb-4"
                            placeholder="Search movies..."
                            placeholderTextColor="#888"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Timer */}
                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>
                            {formatTime(timer)}
                        </Text>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="orange" className="mt-4"/>
                    ) : (
                        <FlatList
                            data={filteredMovies}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={numColumns}
                            key={numColumns}
                            contentContainerStyle={{
                                paddingBottom: 140,
                                paddingHorizontal: 12,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            renderItem={({item}) => (
                                <FlipCard
                                    movie={item}
                                    isSelected={selectedMovies[item.id]}
                                    toggleSelectMovie={toggleSelectMovie}
                                />
                            )}
                        />
                    )}

                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => setCartVisible(true)}
                    >
                        <Text className="text-white font-bold text-sm">
                            🎥 Selection ({selectedCount} / {maxNumber})
                        </Text>
                    </TouchableOpacity>

                    <div>
                        {/* Filter Menu */}
                        <div style={{padding: "1rem", borderBottom: "1px solid #ccc"}}>
                            <h3
                                className="text-white"
                            >
                                Filter Movies</h3>

                            {/* Genres (multiselect) */}
                            <label
                                className="text-white"
                            >
                                Genres:</label>
                            <select multiple value={selectedGenres} onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                setSelectedGenres(selected);
                            }}>
                                {genresList.map((genre) => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>

                            {/* Language */}
                            <label
                                className="text-white"
                            >
                                Language:</label>
                            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                                <option value="">-- Select --</option>
                                {languageList.map((lang) => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>

                            {/* Release Year */}
                            <label
                                className="text-white"
                            >
                                Release Year:</label>
                            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                <option value="">-- Select --</option>
                                {releaseYears.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>

                            {/* In Theaters */}
                            <label
                                className="text-white"
                            >
                                In Theaters:</label>
                            <select value={onlyInTheater} onChange={(e) => setOnlyInTheater(e.target.value)}>
                                <option value="">-- Select --</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        {/* Sort Menu */}
                        <div style={{padding: "1rem", borderBottom: "1px solid #ccc"}}>
                            <h3
                                className="text-white"
                            >
                                Sort Movies</h3>

                            {/* Sort */}
                            <label
                                className="text-white"
                            >
                                Sort:</label>
                            <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)}>
                                <option value="">-- Select --</option>
                                {sortList.map((sort) => (
                                    <option key={sort} value={sort}>{sort}</option>
                                ))}
                            </select>

                            {/* Order */}
                            <label
                                className="text-white"
                            >
                                Sort Order:</label>
                            <select value={selectedOrder} onChange={(e) => setSelectedOrder(e.target.value)}>
                                <option value="">-- Select --</option>
                                <option value="asc">asc</option>
                                <option value="desc">desc</option>
                            </select>
                        </div>
                    </div>

                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            bottom: 20,
                            alignSelf: "left",
                            backgroundColor: "#f97316",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 999
                        }}
                        onPress={() => {
                            handleFilterClick();
                        }}
                    >
                        <Text className="text-white font-bold text-sm">
                            Filter
                        </Text>
                    </TouchableOpacity>

                    {/* Cart Modal */}
                    <Modal
                        isVisible={isCartVisible}
                        onBackdropPress={() => setCartVisible(false)}
                        swipeDirection="down"
                        className="m-0 justify-end"
                    >
                        <View className="bg-white rounded-t-2xl p-6 max-h-[80%]">
                            <TouchableOpacity
                                className="absolute top-4 right-4 z-10"
                                onPress={() => setCartVisible(false)}
                            >
                                <Text className="text-2xl font-bold text-gray-700">✖</Text>
                            </TouchableOpacity>

                            <Text className="text-xl font-bold text-center mb-4">
                                Your Movies ({selectedCount})
                            </Text>

                            <FlatList
                                data={movies.filter((movie) => selectedMovies[movie.id])}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({item}) => (
                                    <View className="flex-row items-center mb-4 bg-gray-100 p-3 rounded-xl">
                                        <Image
                                            source={{
                                                uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                                            }}
                                            className="w-12 h-20 rounded mr-3"
                                        />
                                        <Text className="flex-1 font-semibold text-base">
                                            {item.title}
                                        </Text>
                                        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                                            <Text className="text-red-600 text-lg font-bold">❌</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />

                            <TouchableOpacity
                                className="bg-green-600 mt-4 py-3 rounded-xl"
                                onPress={() => props.handleSendMovies(selectedMovies)}
                            >
                                <Text className="text-white font-bold text-center text-lg">
                                    Ready
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                    {/* Limit Modal */}
                    <Modal
                        isVisible={isLimitModalVisible}
                        onBackdropPress={() => setLimitModalVisible(false)}
                    >
                        <View className="bg-white p-6 rounded-xl items-center">
                            <Text className="text-lg font-bold text-red-600 mb-2">
                                🚨 Selection Limit Reached
                            </Text>
                            <Text className="text-base text-center mb-4">
                                You can only select up to {maxNumber} movie
                                {maxNumber !== 1 && 's'}
                            </Text>
                            <TouchableOpacity
                                className="bg-red-500 px-4 py-2 rounded"
                                onPress={() => setLimitModalVisible(false)}
                            >
                                <Text className="text-white font-bold">Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </SafeAreaView>
            </GradientBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    cartButton: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        backgroundColor: "#f97316",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 999
    },
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

const FlipCard = ({movie, isSelected, toggleSelectMovie}) => {
    const isFlipped = useSharedValue(0);

    const handleFlip = () => {
        isFlipped.value = isFlipped.value ? 0 : 1;
    };

    const frontAnimatedStyle = useAnimatedStyle(() => {
        const spin = interpolate(isFlipped.value, [0, 1], [0, 180]);
        return {
            transform: [{rotateY: withTiming(`${spin}deg`, {duration: 500})}],
            backfaceVisibility: "hidden",
        };
    });

    const backAnimatedStyle = useAnimatedStyle(() => {
        const spin = interpolate(isFlipped.value, [0, 1], [180, 360]);
        return {
            transform: [{rotateY: withTiming(`${spin}deg`, {duration: 500})}],
            backfaceVisibility: "hidden",
        };
    });

    return (
        <View className="m-2 w-[160px]">
            <TouchableOpacity
                onPress={handleFlip}
                className={`rounded-xl overflow-hidden h-[240px] ${
                    isSelected ? "border-4 border-green-400" : ""
                }`}
                activeOpacity={1}
            >
                <Animated.View
                    style={[frontAnimatedStyle]}
                    className="absolute w-full h-full bg-white rounded-xl"
                >
                    {movie.poster_path ? (
                        <Image
                            source={{
                                uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                            }}
                            className="w-full h-[200px] rounded-t-xl"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-[200px] justify-center items-center bg-gray-200">
                            <Text className="text-gray-500">No image</Text>
                        </View>
                    )}

                    {/* Title section with semi-transparent background */}
                    <View className="px-2 py-2 rounded-b-xl min-h-[50px] justify-center"
                          style={{backgroundColor: 'rgba(10, 15, 36, 0.6)'}}>
                        <Text
                            className="text-white text-center text-sm font-semibold"
                            numberOfLines={2}
                        >
                            {movie.title}
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View
                    style={[backAnimatedStyle]}
                    className="absolute w-full h-full bg-gray-200 justify-center items-center p-4 rounded-xl"
                >
                    <Text
                        className="text-sm text-gray-700 text-center"
                        numberOfLines={6}
                    >
                        {movie.overview || "No description available."}
                    </Text>
                </Animated.View>
            </TouchableOpacity>

            {/* + Button BELOW the card */}
            <TouchableOpacity
                onPress={() => toggleSelectMovie(movie.id)}
                className={`mt-2 rounded-full px-4 py-2 self-center ${
                    isSelected ? "bg-green-600" : "bg-orange-500"
                }`}
            >
                <Text className="text-white font-bold text-center text-sm">
                    {isSelected ? "✓ Selected" : "+"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};