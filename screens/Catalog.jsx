import React, { useCallback, useEffect, useRef, useState } from "react";
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
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import "../global.css";
import GradientBackground from '../components/GradientBackground';

export default function Catalog(props) {
  const [page, setPage] = useState(1); // current page (backend starts at 1)
  const [hasMore, setHasMore] = useState(true); // flag to disable further calls
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [isCartVisible, setCartVisible] = useState(false);
  const [isLimitModalVisible, setLimitModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { width } = Dimensions.get("window");
  const [timer, setTimer] = useState(180); // three minutes (in seconds)
  const [isFilterVisible, setFilterVisible] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [onlyInTheater, setOnlyInTheater] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");

  const sortList = ["popularity", "title", "release_date"];
  const sortOrderList = ["asc", "desc"];
  const genresList = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "History", "Horror", "Music",
    "Mystery", "Romance", "Science Fiction", "Thriller", "War", "Western"
  ]; // Replace with actual list
  const languageList = ["en", "la"]; // Replace with actual list
  const releaseYears = Array.from({ length: 30 }, (_, i) => 2024 - i); // past 30 years
  const [selectedGenres, setSelectedGenres] = useState(props.selectedGenres || []);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const renderGenreChips = () => (
    <View style={styles.chipContainer}>
      {genresList.map((genre) => (
        <TouchableOpacity
          key={genre}
          style={[
            styles.chip,
            selectedGenres.includes(genre) && styles.chipSelected,
          ]}
          onPress={() => toggleGenre(genre)}
        >
          <Text style={{ color: selectedGenres.includes(genre) ? "white" : "#f97316" }}>
            {genre}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

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

    // Send users to voting page when timer hits zero
    if (seconds == 0) {
      if (Object.keys(selectedMovies).length === 0) {
        console.log("User did not select a movie");
        console.log("Use this movie id: ", movies[0].id);
        setSelectedMovies((prev) => ({ ...prev, [movies[0].id]: !prev[movies[0].id] }));
        props.handleSendMovies(selectedMovies);
      } else {
        props.handleSendMovies(selectedMovies);
      }
    }


    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const controllerRef = useRef();
  const buildEndpoint = useCallback(
    (pageNumber) => {
      if (searchQuery.trim()) {
        return `https://backend-production-e0e1.up.railway.app/movies/search_API?query=${encodeURIComponent(
          searchQuery.trim()
        )}&page=${pageNumber}`;
      }

      const params = new URLSearchParams();

      // Use local state instead of props
      const joinedGenres = selectedGenres?.join("|");
      if (joinedGenres) params.append("genres", joinedGenres);

      if (props.yearRange?.from)
        params.append("release_year_min", props.yearRange.from);
      if (props.yearRange?.to)
        params.append("release_year_max", props.yearRange.to);

      if (selectedSort) params.append("sort_by", selectedSort);
      if (selectedOrder) params.append("order", selectedOrder);
      if (selectedLanguage) params.append("language", selectedLanguage);
      if (onlyInTheater) params.append("only_in_theater", onlyInTheater);

      params.append("page", pageNumber);
      return `https://backend-production-e0e1.up.railway.app/movies/filter_and_sort_V2?${params.toString()}`;
    },
    [
      searchQuery,
      selectedGenres,
      selectedSort,
      selectedOrder,
      selectedLanguage,
      onlyInTheater,
      props.yearRange,
    ]
  );

  const getMovies = useCallback(
    async (pageNumber = 1, reset = false) => {
      controllerRef.current?.abort?.();
      controllerRef.current = new AbortController();
      const signal = controllerRef.current.signal;

      try {
        if (reset) setLoading(true);
        const endpoint = buildEndpoint(pageNumber);
        const res = await fetch(endpoint, { signal });
        const data = await res.json();

        setHasMore(data.length > 0);
        setMovies((prev) => (pageNumber === 1 || reset ? data : [...prev, ...data]));
      } catch (err) {
        if (err.name !== "AbortError") console.error("Movie fetch failed", err);
      } finally {
        setLoading(false);
      }
    },
    [buildEndpoint]
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    getMovies(1, true);
  }, [searchQuery, props.selectedGenres, props.yearRange, props.selectedSort, props.selectedOrder, getMovies]);

  const loadNextPage = () => {
    if (loading || !hasMore) return;
    const next = page + 1;
    setPage(next);
    getMovies(next);
  };


  const fetchMovies = async (query = "") => {
    try {
      setLoading(true);
      const endpoint = query
        ? `https://backend-production-e0e1.up.railway.app/movies/search_API?query=${encodeURIComponent(query)}`
        : `https://backend-production-e0e1.up.railway.app/movies/get_all_movies`;

      const response = await fetch(endpoint);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger a search when the user types in the search bar
  useEffect(() => {
    if (searchQuery.trim() === "") return; // 🔒 prevent initial fetch
    const delayDebounce = setTimeout(() => {
      fetchMovies(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleFilterClick = async () => {
    const params = new URLSearchParams();

    //selectedGenres.forEach((genre) => params.append("genres", genre));

    var joinedGenres = props?.selectedGenres.join("|");

    if (joinedGenres) params.append("genres", joinedGenres);



    if (selectedLanguage) params.append("language", selectedLanguage);
    if (onlyInTheater) params.append("only_in_theater", onlyInTheater);
    if (sortList) params.append("sort_by", selectedSort);
    if (sortOrderList) params.append("order", selectedOrder);

    if (props.yearRange?.from) params.append("release_year_min", props.yearRange.from);
    if (props.yearRange?.to) params.append("release_year_max", props.yearRange.to);

    try {
      const response = await fetch(`https://backend-production-e0e1.up.railway.app/movies/filter_and_sort_V2?${params.toString()}`);
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

  const toggleSelectMovie = (movie) => {
    if (!(selectedMovies.find(item => item.id === movie.id)) && selectedCount >= maxNumber) {
      setLimitModalVisible(true);
      return;
    }

    if (selectedMovies.find(item => item.id === movie.id)) {
      console.log("Remove")
      setSelectedMovies(selectedMovies.filter(item => item.id !== movie.id));
    } else {
      console.log("Add")
      setSelectedMovies((prev) => ([...prev, movie]));
    }
  };
  const removeFromCart = (movie) => {
    setSelectedMovies(selectedMovies.filter(item => item.id !== movie.id));;
  };

  const numColumns = width > 900 ? 4 : width > 600 ? 3 : 2;

  return (
    <View style={{ flex: 1 }}>
      <GradientBackground>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="light" />

          <View className="px-4">
            <Text className="text-white text-3xl font-black text-center mb-4">
              Movie Catalog
            </Text>

            <Text className="text-white text-lg font-semibold text-center mb-2">
              Select movies you want to watch
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
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </View>

          <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
            <TouchableOpacity
              style={styles.filterToggle}
              onPress={() => setFilterVisible(true)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>☰ Filters</Text>
            </TouchableOpacity>
          </View>


          {loading ? (
            <ActivityIndicator size="large" color="orange" className="mt-4" />
          ) : (
            <FlatList
              data={movies}
              keyExtractor={(item) => item.id.toString()}
              numColumns={numColumns}
              key={numColumns}
              contentContainerStyle={{
                paddingBottom: 160,
                paddingHorizontal: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
              renderItem={({ item }) => (
                <FlipCard
                  movie={item}
                  isSelected={selectedMovies.find(movie => item.id === movie.id)}
                  toggleSelectMovie={toggleSelectMovie}
                />
              )}
              ListFooterComponent={() =>
                loading ? <ActivityIndicator style={{ margin: 20 }} /> : null
              }
              onEndReached={loadNextPage}
              onEndReachedThreshold={0.4}
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
                data={selectedMovies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View className="flex-row items-center mb-4 bg-gray-100 p-3 rounded-xl">
                    {item.poster_path ? (
                      <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                      }}
                      className="w-12 h-20 rounded mr-3"
                    />
                    ) : (
                      <View className="w-12 h-20 rounded mr-3 justify-center items-center bg-gray-200">
                        <Text className="text-gray-500 text-xs text-center px-1">No image</Text>
                      </View>
                    )}
                    <Text className="flex-1 font-semibold text-base">
                      {item.title}
                    </Text>
                    <TouchableOpacity onPress={() => removeFromCart(item)}>
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
          <Modal
            isVisible={isFilterVisible}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            onBackdropPress={() => setFilterVisible(false)}
            style={{ margin: 0, justifyContent: "flex-end", alignItems: "flex-end" }}
          >
            <View style={styles.filterDrawer}>
              <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.filterTitle}>Filter Movies 🎛️</Text>

                {/* Genres */}
                <Text className="text-white font-bold mt-4 mb-2">Genres</Text>
                {renderGenreChips()}

                {/* Language */}
                <Text className="text-white mt-4">Language:</Text>
                <View style={styles.dropdown}>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    style={styles.selectBox}
                  >
                    <option value="">-- Select --</option>
                    {languageList.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </View>

                {/* Release Year */}
                <Text className="text-white mt-4">Release Year:</Text>
                <View style={styles.dropdown}>
                  <select
                    value={props.yearRange?.from === props.yearRange?.to ? props.yearRange.from : ""}
                    onChange={(e) => props.setYearRange({ from: e.target.value, to: e.target.value })}
                    style={styles.selectBox}
                  >
                    <option value="">-- Select --</option>
                    {releaseYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </View>

                {/* In Theaters */}
                <Text className="text-white mt-4">In Theaters:</Text>
                <View style={styles.dropdown}>
                  <select
                    value={onlyInTheater}
                    onChange={(e) => setOnlyInTheater(e.target.value)}
                    style={styles.selectBox}
                  >
                    <option value="">-- Select --</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </View>

                {/* Sort By */}
                <Text className="text-white mt-4">Sort:</Text>
                <View style={styles.dropdown}>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    style={styles.selectBox}
                  >
                    <option value="">-- Select --</option>
                    <option value="popularity">Popularity</option>
                    <option value="title">Title</option>
                    <option value="release_date">Release Date</option>
                    <option value="vote_average">TMDB Rating</option>
                    <option value="vote_count"># of Votes</option>
                  </select>
                </View>

                {/* Sort Order */}
                <Text className="text-white mt-4">Sort Order:</Text>
                <View style={styles.dropdown}>
                  <select
                    value={selectedOrder}
                    onChange={(e) => setSelectedOrder(e.target.value)}
                    style={styles.selectBox}
                  >
                    <option value="">-- Select --</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </View>

                {/* Apply Button */}
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => {
                    props.setSelectedGenres(selectedGenres);
                    setPage(1);
                    getMovies(1, true);
                    setFilterVisible(false);
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Apply Filters</Text>
                </TouchableOpacity>
              </ScrollView>
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
  },
  filterToggle: {
    backgroundColor: "#f97316",
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: "#f97316",
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#f97316",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  chipSelected: {
    backgroundColor: "#f97316",
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 12,
  },
  selectBox: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  filterDrawer: {
    width: "80%",
    backgroundColor: "#1e1e1e",
    padding: 20,
    height: "100%",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  filterTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  }
});

const FlipCard = ({ movie, isSelected, toggleSelectMovie }) => {
  const isFlipped = useSharedValue(0);
  const [showDescription, setShowDescription] = useState(false);

  const handleFlip = () => {
    isFlipped.value = isFlipped.value ? 0 : 1;
    setShowDescription(false);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(isFlipped.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: withTiming(`${spin}deg`, { duration: 500 }) }],
      backfaceVisibility: "hidden",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(isFlipped.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: withTiming(`${spin}deg`, { duration: 500 }) }],
      backfaceVisibility: "hidden",
    };
  });

  return (
    <View className="m-2 w-[160px]">
      <TouchableOpacity
        onPress={handleFlip}
        className={`rounded-xl overflow-hidden h-[240px] ${isSelected ? "border-4 border-red-400" : ""
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
            <View className="w-full h-[200px] rounded-t-xl justify-center items-center bg-gray-200">
              <Text className="text-gray-500">No image</Text>
            </View>
          )}

          {/* Title section with semi-transparent background */}
          <View className="px-2 py-2 rounded-b-xl min-h-[50px] justify-center"
            style={{ backgroundColor: 'rgba(10, 15, 36, 0.6)' }}>
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
          <View>
            <Text className="text-sm text-gray-700 text-center mt-4">
              Genre{movie.genres.includes('-') && 's'}: {movie.genres.replaceAll("-", ", ")}{"\n"}
              Year: {movie.release_date.slice(0, 4) || "No year available."}{"\n"}
            </Text>
            {movie.overview ? (
              showDescription ? (
                <ScrollView style={{ maxHeight: 150 }} className="mb-4">
                  <Text className="text-sm text-gray-700 text-center">
                    {movie.overview}
                  </Text>
                </ScrollView>
              ) : (
                <TouchableOpacity onPress={() => setShowDescription(true)}>
                  <Text className="text-sm text-blue-600 text-center underline mb-4">
                    Read description
                  </Text>
                </TouchableOpacity>
              )
            ) : (
              <Text className="text-sm text-gray-500 text-center mb-4">
                No description available.
              </Text>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* + Button BELOW the card */}
      <TouchableOpacity
        onPress={() => toggleSelectMovie(movie)}
        className={`mt-2 rounded-full px-4 py-2 self-center ${isSelected ? "bg-red-600" : "bg-orange-500"
          }`}
      >
        <Text className="text-white font-bold text-center text-sm">
          {isSelected ? "-" : "+"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};