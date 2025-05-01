import React, {useCallback, useEffect, useRef, useState} from "react";
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
    ScrollView, Pressable,
} from "react-native";
import Modal from "react-native-modal";
import {StatusBar} from "expo-status-bar";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from "react-native-reanimated";
import "../global.css";
import GradientBackground from '../components/GradientBackground';
import MultiSlider from "@ptomasroos/react-native-multi-slider";
export default function Catalog(props) {
    const [page, setPage] = useState(1); // current page (backend starts at 1)
    const [hasMore, setHasMore] = useState(true); // flag to disable further calls
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [isCartVisible, setCartVisible] = useState(false);
    const [isLimitModalVisible, setLimitModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const {width} = Dimensions.get("window");
    const [timer, setTimer] = useState(180); // three minutes (in seconds)
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [isSortVisible, setSortVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [onlyInTheater, setOnlyInTheater] = useState("");
    const [selectedOrder, setSelectedOrder] = useState("");
    const [selectedGenres, setSelectedGenres] = useState(
      props.selectedGenres || []
    );
    const sortList = ["popularity", "title", "release_date"];
    const sortOrderList = ["asc", "desc"];
    const genresList = [
        "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
        "Drama", "Family", "Fantasy", "History", "Horror", "Music",
        "Mystery", "Romance", "Science Fiction", "Thriller", "War", "Western"
    ]; // Replace with actual list
    const languageList = {
        "Abkhazian": "ab",
        "Afar": "aa",
        "Afrikaans": "af",
        "Akan": "ak",
        "Albanian": "sq",
        "Amharic": "am",
        "Arabic": "ar",
        "Aragonese": "an",
        "Armenian": "hy",
        "Assamese": "as",
        "Avaric": "av",
        "Aymara": "ay",
        "Azerbaijani": "az",
        "Bambara": "bm",
        "Bashkir": "ba",
        "Basque": "eu",
        "Belarusian": "be",
        "Bengali": "bn",
        "Bislama": "bi",
        "Bokmål, Norwegian": "nb",
        "Bosnian": "bs",
        "Breton": "br",
        "Bulgarian": "bg",
        "Burmese": "my",
        "Catalan": "ca",
        "Central Khmer": "km",
        "Chamorro": "ch",
        "Chechen": "ce",
        "Chinese": "zh",
        "Chichewa": "ny",
        "Chuvash": "cv",
        "Cornish": "kw",
        "Corsican": "co",
        "Cree": "cr",
        "Croatian": "hr",
        "Czech": "cs",
        "Danish": "da",
        "Divehi": "dv",
        "Dutch": "nl",
        "Dzongkha": "dz",
        "English": "en",
        "Esperanto": "eo",
        "Estonian": "et",
        "Faroese": "fo",
        "Fijian": "fj",
        "Finnish": "fi",
        "French": "fr",
        "Fulah": "ff",
        "Gaelic": "gd",
        "Galician": "gl",
        "Ganda": "lg",
        "Georgian": "ka",
        "German": "de",
        "Greek": "el",
        "Guarani": "gn",
        "Gujarati": "gu",
        "Haitian": "ht",
        "Hausa": "ha",
        "Hebrew": "he",
        "Herero": "hz",
        "Hindi": "hi",
        "Hiri Motu": "ho",
        "Hungarian": "hu",
        "Icelandic": "is",
        "Igbo": "ig",
        "Indonesian": "id",
        "Interlingua": "ia",
        "Interlingue": "ie",
        "Inuktitut": "iu",
        "Inupiaq": "ik",
        "Irish": "ga",
        "Italian": "it",
        "Japanese": "ja",
        "Javanese": "jv",
        "Kalaallisut": "kl",
        "Kannada": "kn",
        "Kashmiri": "ks",
        "Kazakh": "kk",
        "Kikuyu": "ki",
        "Kinyarwanda": "rw",
        "Kirghiz": "ky",
        "Komi": "kv",
        "Kongo": "kg",
        "Korean": "ko",
        "Kuanyama": "kj",
        "Kurdish": "ku",
        "Lao": "lo",
        "Latin": "la",
        "Latvian": "lv",
        "Limburgan": "li",
        "Lingala": "ln",
        "Lithuanian": "lt",
        "Luxembourgish": "lb",
        "Macedonian": "mk",
        "Malagasy": "mg",
        "Malay": "ms",
        "Malayalam": "ml",
        "Maltese": "mt",
        "Manx": "gv",
        "Maori": "mi",
        "Marathi": "mr",
        "Marshallese": "mh",
        "Mongolian": "mn",
        "Navajo": "nv",
        "Ndebele, North": "nd",
        "Ndebele, South": "nr",
        "Nepali": "ne",
        "Norwegian": "no",
        "Norwegian Nynorsk": "nn",
        "Occitan": "oc",
        "Ojibwa": "oj",
        "Oriya": "or",
        "Oromo": "om",
        "Ossetian": "os",
        "Panjabi": "pa",
        "Persian": "fa",
        "Polish": "pl",
        "Portuguese": "pt",
        "Pushto": "ps",
        "Quechua": "qu",
        "Romansh": "rm",
        "Romanian": "ro",
        "Russian": "ru",
        "Rundi": "rn",
        "Samoan": "sm",
        "Sango": "sg",
        "Sanskrit": "sa",
        "Sardinian": "sc",
        "Serbian": "sr",
        "Shona": "sn",
        "Sindhi": "sd",
        "Sinhala": "si",
        "Slovak": "sk",
        "Slovenian": "sl",
        "Somali": "so",
        "Sotho, Southern": "st",
        "Spanish": "es",
        "Sundanese": "su",
        "Swahili": "sw",
        "Swati": "ss",
        "Swedish": "sv",
        "Tagalog": "tl",
        "Tahitian": "ty",
        "Tajik": "tg",
        "Tamil": "ta",
        "Tatar": "tt",
        "Telugu": "te",
        "Thai": "th",
        "Tibetan": "bo",
        "Tigrinya": "ti",
        "Tonga": "to",
        "Tsonga": "ts",
        "Tswana": "tn",
        "Turkish": "tr",
        "Turkmen": "tk",
        "Twi": "tw",
        "Uighur": "ug",
        "Ukrainian": "uk",
        "Urdu": "ur",
        "Uzbek": "uz",
        "Venda": "ve",
        "Vietnamese": "vi",
        "Welsh": "cy",
        "Western Frisian": "fy",
        "Wolof": "wo",
        "Xhosa": "xh",
        "Yiddish": "yi",
        "Yoruba": "yo",
        "Zulu": "zu"
    }


    const MAX_YEAR = 2025;
    const initialRange = [props.yearRange?.from || 2000, props.yearRange?.to || MAX_YEAR];
    const [range, setRange] = useState(initialRange); // local editing state

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
                    <Text style={{color: selectedGenres.includes(genre) ? "white" : "#f97316"}}>
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
                // console.log("User did not select a movie");
                // console.log("Use this movie id: ", movies[0].id);
                props.handleSendMovies([]);
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
      const joinedGenres = selectedGenres.join("|");
      if (joinedGenres) params.append("genres", joinedGenres);
      params.append("release_year_min", range[0]);
      params.append("release_year_max", range[1]);
      if (props.sortOption) params.append("sort_by", props.sortOption);
      if (props.sortOrder) params.append("order", props.sortOrder);
      if (selectedLanguage) params.append("language", selectedLanguage);
      if (onlyInTheater) params.append("only_in_theater", onlyInTheater);
      params.append("page", pageNumber);
      return `https://backend-production-e0e1.up.railway.app/movies/filter_and_sort_V2?${params.toString()}`;
        },
        [
            searchQuery,
            selectedGenres,
            props.sortOption,
            props.sortOrder,
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
                const res = await fetch(endpoint, {signal});
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
    }, [searchQuery, props.selectedGenres, props.yearRange, props.sortOption, props.sortOrder, getMovies]);

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

        //todo: look into that
        if (sortList) params.append("sort_by", props.sortOption);
        if (sortOrderList) params.append("order", props.sortOrder);

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
        setSelectedMovies(selectedMovies.filter(item => item.id !== movie.id));
        ;
    };

    const numColumns = width > 900 ? 4 : width > 600 ? 3 : 2;

    return (
      <GradientBackground>
      <SafeAreaView className="flex-1">
        {/* Header, search, timer, etc. (omitted) */}

        {/* ────────── FILTER DRAWER ────────── */}
        <Modal
          isVisible={isFilterVisible}
          animationIn="slideInRight"
          animationOut="slideOutRight"
          onBackdropPress={() => setFilterVisible(false)}
          style={{ margin: 0, justifyContent: "flex-end", alignItems: "flex-end" }}
        >
          <View style={styles.filterDrawer}>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
              <Text style={styles.filterTitle}>Filter Movies</Text>

              <Text className="text-white font-bold mt-4 mb-2">Genres</Text>
              {renderGenreChips()}

              <Text className="text-white mt-4">Language:</Text>
              <View style={styles.dropdown}>
                <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} style={styles.selectBox}>
                  <option value="">-- Select --</option>
                  {Object.keys(languageList).map((key) => (
                    <option key={key} value={languageList[key]}>{key}</option>
                  ))}
                </select>
              </View>

              <Text className="text-white mt-4 mb-2">Release Year Range:</Text>
              <Text style={{ color: "#FFA500", fontWeight: "700", fontSize: 16 }}>{range[0]} — {range[1]}</Text>
              <View style={{ marginVertical: 16, alignItems: "center" }}>
                <MultiSlider
                  values={range}
                  min={1850}
                  max={MAX_YEAR}
                  onValuesChange={setRange}
                  sliderLength={width * 0.7}
                  trackStyle={{ height: 8, borderRadius: 10, backgroundColor: "#555" }}
                  selectedStyle={{ backgroundColor: "#FFA500" }}
                  unselectedStyle={{ backgroundColor: "#333" }}
                  markerStyle={styles.sliderMarker}
                />
                <View style={styles.labelRow}>
                  <Text style={styles.thumbLabel}>1850</Text>
                  <Text style={styles.thumbLabel}>{MAX_YEAR}</Text>
                </View>
              </View>

              <Text className="text-white mt-4">In Theaters:</Text>
              <View style={styles.dropdown}>
                <select value={onlyInTheater} onChange={(e) => setOnlyInTheater(e.target.value)} style={styles.selectBox}>
                  <option value="">-- Select --</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </View>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  props.setSelectedGenres(selectedGenres);
                  props.setYearRange({ from: range[0], to: range[1] });
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

        {/* Movie grid, sort drawer, cart, etc. (unchanged for brevity) */}
      </SafeAreaView>
    </GradientBackground>
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
        left: 5,
        top: 10,
        backgroundColor: "#f97316",
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 999
    },
    timerText: {
        color: "white",
        fontWeight: "bold"
    },
    filterToggle: {
        backgroundColor: "#f97316",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 999,
        alignItems: "center",
        marginHorizontal: 5,
        flex: 1,
        marginBottom: 15
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

const FlipCard = ({movie, isSelected, toggleSelectMovie}) => {
    const isFlipped = useSharedValue(0);
    const [showDescription, setShowDescription] = useState(false);

    const handleFlip = () => {
        isFlipped.value = isFlipped.value ? 0 : 1;
        setShowDescription(false);
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
                className={`rounded-2xl overflow-hidden h-[240px] ${isSelected ? "border-4 border-red-400" : ""
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
                    <View className="rounded-b-xl min-h-[50px] justify-center"
                          style={{backgroundColor: 'rgba(10, 15, 36, 0.6)'}}>
                        <Text
                            className="text-white text-center text-sm px-2 pb-3 font-semibold"
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
                                <ScrollView style={{maxHeight: 150}} className="mb-4">
                                    <Text className="text-sm text-gray-700 text-center">
                                        {movie.overview}
                                    </Text>
                                </ScrollView>
                            ) : (
                                <TouchableOpacity onPress={() => setShowDescription(true)}>
                                    <Text className="text-sm text-[#1E90FF] text-center underline mb-4">
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