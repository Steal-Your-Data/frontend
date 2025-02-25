import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, 
  Image, Dimensions, StyleSheet,
} from "react-native";
import Modal from "react-native-modal";  // 📌 Import modal
import { StatusBar } from "expo-status-bar";

const MOVIES_API = [
  { id: 1, title: "Inception", image: "https://picsum.photos/200/300?random=1" },
  { id: 2, title: "Interstellar", image: "https://picsum.photos/200/300?random=2" },
  { id: 3, title: "The Dark Knight", image: "https://picsum.photos/200/300?random=3" },
  { id: 4, title: "Parasite", image: "https://picsum.photos/200/300?random=4" },
  { id: 5, title: "The Matrix", image: "https://picsum.photos/200/300?random=5" },
  { id: 6, title: "Avatar", image: "https://picsum.photos/200/300?random=6" },
  { id: 7, title: "The Matrix", image: "https://picsum.photos/200/300?random=5" },
  { id: 8, title: "Avatar", image: "https://picsum.photos/200/300?random=6" },
];

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovies, setSelectedMovies] = useState({});
  const [isCartVisible, setCartVisible] = useState(false);
  const [isLimitModalVisible, setLimitModalVisible] = useState(false);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    setTimeout(() => {
      setMovies(MOVIES_API);
      setLoading(false);
    }, 1000);
  }, []);

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
  
  

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>Movie Catalog</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          key={numColumns} // Forces re-render when layout changes
          contentContainerStyle={{ paddingBottom: 80 }} // Space for the cart button
          renderItem={({ item }) => (
            <View
              style={[
                styles.movieCard,
                selectedMovies[item.id] && styles.selectedCard,
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.movieTitle}>{item.title}</Text>
              <TouchableOpacity
                onPress={() => toggleSelectMovie(item.id)}
                style={[
                  styles.selectButton,
                  { backgroundColor: selectedMovies[item.id] ? "red" : "blue" },
                ]}
              >
                <Text style={styles.buttonText}>
                  {selectedMovies[item.id] ? "Remove" : "Select"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Cart Button */}
      <TouchableOpacity style={styles.cartButton} onPress={() => setCartVisible(true)}>
        <Text style={styles.cartButtonText}>
          🛒 Cart ({selectedCount} / {maxNumber})
        </Text>
      </TouchableOpacity>

      {/* Bottom Sheet Cart Modal */}
      <Modal
        isVisible={isCartVisible}
        onBackdropPress={() => setCartVisible(false)}
        onSwipeComplete={() => setCartVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.cartContainer}>
          <Text style={styles.cartTitle}>Your Cart ({selectedCount})</Text>

          {/* Cart Items */}
          <FlatList
            data={movies.filter((movie) => selectedMovies[movie.id])}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.cartImage} />
                <Text style={styles.cartMovieTitle}>{item.title}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.removeButton}>❌</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Close Button */}
          <TouchableOpacity style={styles.closeCartButton} onPress={() => setCartVisible(false)}>
            <Text style={styles.closeCartText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* 🚨 Selection Limit Modal */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  movieCard: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedCard: {
    backgroundColor: "#e0ffe0",
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  selectButton: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
  cartButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { height: 2, width: 0 },
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
  closeCartButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  closeCartText: {
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
});
