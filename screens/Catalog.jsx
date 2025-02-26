import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, 
  Image, Dimensions, StyleSheet,
} from "react-native";
import Modal from "react-native-modal";  // 📌 Import modal
import { StatusBar } from "expo-status-bar";
import { getMovies } from "../utils/api";

export default function Catalog() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovies, setSelectedMovies] = useState({});
  const [isCartVisible, setCartVisible] = useState(false);
  const [isLimitModalVisible, setLimitModalVisible] = useState(false);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    fetchMovies();
  }, []);
  
  const fetchMovies = async () => {
    try {
      const movieList = await getMovies();
      setMovies(movieList);
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
            <TouchableOpacity
              onPress={() => toggleSelectMovie(item.id)}
              style={[
                styles.movieCard,
                selectedMovies[item.id] && styles.selectedCard,
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.movieTitle}>{item.title}</Text>
            </TouchableOpacity>
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
                <Image source={{ uri: item.image }} style={styles.cartImage} />
                <Text style={styles.cartMovieTitle}>{item.title}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.removeButton}>❌</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* ✅ Ready Button */}
          <TouchableOpacity style={styles.readyButton}>
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
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 3, 
    borderColor: "transparent", 
    overflow: "hidden",
  },
  selectedCard: {
    borderColor: "#007bff",
  },
  image: {
    width: "100%",
    height: 220, 
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  titleContainer: {
    backgroundColor: "white",
    paddingVertical: 8,  
    width: "100%",
    alignItems: "center",
  },
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
});