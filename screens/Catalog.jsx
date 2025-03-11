import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, 
  Image, Dimensions, StyleSheet, TextInput
} from "react-native";
import Modal from "react-native-modal";  // 📌 Import modal
import { StatusBar } from "expo-status-bar";
import { getMovies } from "../utils/api";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from "react-native-reanimated";

export default function Catalog(props) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovies, setSelectedMovies] = useState({});
  const [isCartVisible, setCartVisible] = useState(false);
  const [isLimitModalVisible, setLimitModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { width } = Dimensions.get("window");

  useEffect(() => {
    fetchMovies();
  }, []);
  
  const fetchMovies = async () => {
    try {
      const movieList = await fetch(`https://backend-production-e0e1.up.railway.app/movies/get_all_movies`);
      const data = await movieList.json();
      //const movieList = await getMovies();
      setMovies(data);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const maxNumber = 3; //subject to change
  const selectedCount = Object.values(selectedMovies).filter(Boolean).length;

  const toggleSelectMovie = (id) => {

    if (!selectedMovies[id] && selectedCount >= 3) {
        setLimitModalVisible(true);
        return;
    }

    setSelectedMovies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const removeFromCart = (id) => {
    setSelectedMovies((prev) => ({ ...prev, [id]: false }));
  };

  const numColumns = width > 900 ? 4 : width > 600 ? 3 : 2;
  
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>Movie Catalog</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          key={numColumns} // Forces re-render when layout changes
          contentContainerStyle={{ paddingBottom: 80 }} // Space for the cart button
          renderItem={({ item }) => (
            <FlipCard 
              movie={item} 
              isSelected={selectedMovies[item.id]} 
              toggleSelectMovie={toggleSelectMovie}
            />
          )}
        />
      )}

      {/* Cart Button */}
      <TouchableOpacity style={styles.cartButton} onPress={() => setCartVisible(true)}>
        <Text style={styles.cartButtonText}>
          🛒 Cart ({selectedCount} / {maxNumber})
        </Text>
      </TouchableOpacity>

      {/* 🛒 Bottom Sheet Cart Modal */}
      <Modal
        isVisible={isCartVisible}
        onBackdropPress={() => setCartVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.cartContainer}>
          {/* ❌ Close Button (X) */}
          <TouchableOpacity style={styles.closeIcon} onPress={() => setCartVisible(false)}>
            <Text style={styles.closeIconText}>✖</Text>
          </TouchableOpacity>

          <Text style={styles.cartTitle}>Your Cart ({selectedCount})</Text>

          {/* Cart Items */}
          <FlatList
            data={movies.filter((movie) => selectedMovies[movie.id])}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`}} style={styles.cartImage} />
                <Text style={styles.cartMovieTitle}>{item.title}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.removeButton}>❌</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* ✅ Ready Button */}
          a<TouchableOpacity style={styles.readyButton} onPress={() => props.handleSendMovies(selectedMovies)}>
            <Text style={styles.readyButtonText}>Ready</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Selection Limit Modal */}
      <Modal isVisible={isLimitModalVisible} onBackdropPress={() => setLimitModalVisible(false)}>
        <View style={styles.limitModal}>
          <Text style={styles.limitTitle}>🚨 Selection Limit Reached</Text>
          <Text style={styles.limitText}>You can only select up to 3 movies.</Text>
          <TouchableOpacity style={styles.closeLimitButton} onPress={() => setLimitModalVisible(false)}>
            <Text style={styles.closeLimitText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );
}

const FlipCard = ({ movie, isSelected, toggleSelectMovie }) => {
  const isFlipped = useSharedValue(0);

  const handleFlip = () => {
    isFlipped.value = isFlipped.value ? 0 : 1;
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(isFlipped.value, [0, 1], [0, 180]);
    return { transform: [{ rotateY: withTiming(`${spin}deg`, { duration: 500 }) }] };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(isFlipped.value, [0, 1], [180, 360]);
    return { transform: [{ rotateY: withTiming(`${spin}deg`, { duration: 500 }) }] };
  });

  return (
    <View style={styles.flipCardContainer}>
      {/* Flip Animation on tap */}
      <TouchableOpacity onPress={handleFlip} style={[styles.flipContainer, isSelected && styles.selectedCard]}>
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          {movie.poster_path ? (
            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} style={styles.image} />
          ) : (
            <Text style={styles.placeholderText}>Image not available</Text>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.movieTitle}>{movie.title}</Text>
          </View>
        </Animated.View>
        <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
          <Text style={styles.description}>{movie.title} - Movie Description</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* "+" Button to add to cart */}
      <TouchableOpacity onPress={() => toggleSelectMovie(movie.id)} style={styles.addButton}>
        <Text style={styles.addButtonText}>{isSelected ? "✓ Selected" : "+"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  flipContainer: { 
    margin: 5,  
    borderRadius: 10, 
    alignItems: "center", 
    overflow: "hidden", 
    width: 150, 
    height: 250, 
  },
  card: { width: 150, height: 250, backfaceVisibility: "hidden", justifyContent: "center", alignItems: "center" },
  backCard: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#f8f8f8", padding: 10, justifyContent: "center", alignItems: "center" },
  selectedCard: { 
    borderColor: "#00eb3f", 
    borderWidth: 4,  
    borderRadius: 10,  
    overflow: "hidden" 
  },
  image: { width: "100%", height: "80%", borderRadius: 10 },
  placeholderText: { fontSize: 14, color: "gray", textAlign: "center" },
  titleContainer: { paddingVertical: 8, alignItems: "center"},
  movieTitle: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
  description: { fontSize: 14, textAlign: "center", color: "#333" },
  cartButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
  cartButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  cartContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 1,
  },
  closeIconText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  cartTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
  },
  cartImage: {
    width: 50,
    height: 75,
    borderRadius: 5,
    marginRight: 10,
  },
  cartMovieTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
  readyButton: {
    backgroundColor: "#05b445",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  readyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  limitModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  limitTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
  },
  limitText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  closeLimitButton: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  closeLimitText: {
    color: "white",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  flipCardContainer: {
    alignItems: "center",
    margin: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 10,
  },
});