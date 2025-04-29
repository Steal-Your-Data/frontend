import {useCallback, useState, useEffect} from "react";
import Home from './screens/Home';
import Host from './screens/Host';
import Join from './screens/Join';
import Session from './screens/Session';
import Catalog from './screens/Catalog';
import Waiting from './screens/Waiting';
import Voting from './screens/Voting'; // Import Voting Screen
import Winner from './screens/Winner';
import Step1GenreScreen from './screens/Step1GenreScreen';
import Step2TypeScreen from './screens/Step2TypeScreen';
import Step3TimePeriodScreen from './screens/Step3TimePeriodScreen';
import io from 'socket.io-client';  // Used for interacting with backend
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 
const socket = io('https://backend-production-e0e1.up.railway.app', {

    transports: ['websocket'],  // Ensure WebSocket is used for real-time communication

});

export default function App() {
    const [isHosting, setIsHosting] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [inSession, setInSession] = useState(false);
    const [sessionCode, setSessionCode] = useState('');
    const [hostName, setHostName] = useState('');
    const [name, setName] = useState('');
    const [participantID, setParticipantID] = useState(0);
    const [participants, setParticipants] = useState([]);
    const [goCatalog, setGoCatalog] = useState(false);
    const [goWaiting, setGoWaiting] = useState(false);
    const [goVoting, setGoVoting] = useState(false);
    const [goWinner, setGoWinner] = useState(false);
    const [goHome, setGoHome] = useState(false);
    const [finalVotes, setFinalVotes] = useState({});
    const [movies, setMovies] = useState([]);
    const [stepScreen, setStepScreen] = useState(null); // "Step1", "Step2", or "Step3"
    const [finishedUsers, setFinishedUsers] = useState(0);
    const [joinError, setJoinError] = useState('');
    const [genreFilters, setGenreFilters] = useState([]);
    const [sortOption, setSortOption] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [yearRange, setYearRange] = useState({ from: "", to: "" });

    useEffect(() => {
        try{
            window.onbeforeunload = function() {
                return "Are you sure you want to leave?";
            }
        } catch (error) {

        }
    }, []);

    // Listen for user_joined and user_left events
    useEffect(() => {
        const handleUserJoined = (data) => {
            console.log("User joined:", data);
            setParticipants(data.name);
        }

        socket.on("user_joined", handleUserJoined);

        const participantLeft = (data) => {
            console.log("User left:", data);
            setParticipants((prev) => // update list of participants when someone leaves
                prev.filter((participant) => participant !== data.participant_name)
            );
        }

        socket.on("participant_left", participantLeft);

        const sessionDisbanded = (data) => {
            console.log("data is", data)
            if (data.session_id == sessionCode) {
                console.log("Session disbanded:", data);
                setInSession(false);
                setGoHome(true);
            }
        }

        socket.on("session_disbanded", sessionDisbanded);


        return () => {
            socket.off("user_joined", handleUserJoined);
            socket.off("participant_left", participantLeft);
            socket.off("session_disbanded", sessionDisbanded);

        };
    }, [sessionCode]);

    useEffect(() => {
        socket.on('selection_progress', (data) => {
            console.log('Selection progress:', data);
            setFinishedUsers(data.done_participants); // update the number of participants who have finished
        });

        socket.on('selection_complete', (data) => {
            console.log('Selection Completed:', data);
            setGoVoting(true); // Move all clients to the Voting page
            setGoWaiting(false);
        });

        return () => {
            socket.off('selection_progress');
            socket.off('selection_complete'); // Cleanup listener
        };
    }, []);

    useEffect(() => {
        socket.on('voting_progress', (data) => {
            console.log('Voting progress:', data);
            setFinishedUsers(data.done_participants); // update the number of participants who have finished
        });

        socket.on('voting_complete', (data) => {
            console.log('Voting Completed:', data);
            setGoWinner(true); // Move all clients to the Winner page
            setGoWaiting(false);
        });

        return () => {
            socket.off('voting_progress')
            socket.off('voting_complete'); // Cleanup listener
        };
    }, []);

    // This useEffect is for switching Session for nonHost participants
    useEffect(() => {
        // Wait for a session_begin signal by backend
        socket.on('session_begin', (data) => {
            console.log("Session begin:", data);
            setStepScreen("Step1"); // Move all clients to the Step 1 page
            setInSession(false);
        });

        return () => {
            socket.off('session_begin'); // Clean up event listener
        };
    }, []);

    const fetchMovies = useCallback(async () => {
        try {
            // Step 1: Fetch movie IDs from the pocket with session_id and participant_id
            console.log("Fetching movies in pocket");
            const movieListResponse = await fetch('https://backend-production-e0e1.up.railway.app/session/movies_in_pocket', {
                method: "POST",  // Use POST to send JSON body
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({session_id: sessionCode, participant_id: participantID}),
            });

            const movieListData = await movieListResponse.json();

            console.log("movieListData", movieListData)

            if (!movieListData.movies || movieListData.movies.length === 0) {
                setMovies([]);  // No movies in pocket
                return;
            }

            // Step 2: Extract movie IDs
            const movieIds = movieListData.movies.map(movie => movie.movie_id);

            console.log("moviedIds: ", movieIds)
            console.log({ids: movieIds});

            // Step 3: Fetch full movie details
            const movieInfoResponse = await fetch('https://backend-production-e0e1.up.railway.app/movies/get_movie_info_by_ids_API', {

                method: "POST",  // Use POST to send JSON body
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ids: movieIds}),
            });

            const movieInfoData = await movieInfoResponse.json();
            console.log(movieInfoData);

            // Step 4: Update state with full movie details
            //setMovies(movieInfoData);
            return movieInfoData;
        } catch (error) {
            console.error("Error fetching movies in pocket:", error);
        }
    }, [sessionCode, participantID]);

    const fetchWinner = useCallback(async () => {
        try {
            // Step 1: Fetch movie IDs from the pocket with session_id and participant_id
            console.log("Fetching winner");
            const movieWinner = await fetch('https://backend-production-e0e1.up.railway.app/session/final_movie', {
                method: "POST",  // Use POST to send JSON body
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({session_id: sessionCode}),
            });

            const movieWinnerData = await movieWinner.json();

            console.log(movieWinnerData)

            return movieWinnerData;
        } catch (error) {
            console.error("Error fetching movies in pocket:", error);
        }
    }, [sessionCode]);

    async function handleHostSession(hostName) {
        try {
            const response = await fetch("https://backend-production-e0e1.up.railway.app/session/start", {
                method: "POST",
                headers: {
                    'Access-Control-Allow-Origin': '*', // USE THIS FOR EVERY FETCH!!!!
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({host_name: hostName})
            });

            const data = await response.json();


            // This is used for talking to sockets & putting names into the database
            const startSession = (session_id, hostName) => {

                socket.emit('join_session_room', {

                    session_id: session_id,

                    name: hostName,

                });

            };

            // Displays if user joined
            socket.on('user_joined', (data) => {

                console.log('User joined:', data);

            });


            if (response.ok) {
                setSessionCode(data.session_id);
                setHostName(hostName);
                setName(hostName);
                setParticipants([hostName]);
                setParticipantID(data.participant_id);
                startSession(data.session_id, hostName); // socket function must be called in here
                setIsHosting(false);
                setInSession(true);
            } else {
                console.error("Error hosting session:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // TODO: currently doesn't handle when user tries to join session that already started, need to fix
    async function handleJoinSession(sessionCode, name) {
        try {
            const response = await fetch("https://backend-production-e0e1.up.railway.app/session/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*' // USE THIS FOR EVERY FETCH!!!!
                },
                body: JSON.stringify({session_id: sessionCode, name: name})
            });



            const joinSession = (sessionCode, name) => {

                socket.emit('join_session_room', {

                    session_id: sessionCode,

                    name: name,

                });

            };

            socket.on('user_joined', (data) => {

                console.log('User joined:', data);

            });

            const data = await response.json();

            if (response.ok && !data.error) {
                setHostName(data.host_name)
                setSessionCode(sessionCode);
                setName(name);
                setParticipants((prev) => [...prev, name]);
                setParticipantID(data.participant_ID);
                joinSession(sessionCode, name);
                setIsJoining(false);
                setInSession(true);
                setJoinError("");
            } else {
                // FIX: not receiving error messages for sessions already started
                console.error("Error joining session:", data.message || data.error);
                setJoinError(data.message || data.error || "Failed to join session.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Handler is for when Host clicks "Start" button
    async function handleStartSession() {
        try {
            const response = await fetch("https://backend-production-e0e1.up.railway.app/session/begin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({session_id: sessionCode})
            });

            const data = await response.json();

            if (response.ok) {
                setGoCatalog(true);
                setInSession(false);
            } else {
                console.error("Error starting session:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function handleLeaveSession() {
        try {
            const response = await fetch("https://backend-production-e0e1.up.railway.app/session/leave", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({session_id: sessionCode, participant_id: participantID})
            });

            const data = await response.json();

            if (response.ok) {
                setInSession(false);
                setGoHome(true);
            } else {
                console.error("Error stopping session:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function handleFinalVote() {

        try {
            const response = await fetch("https://backend-production-e0e1.up.railway.app/session/finish_voting", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({session_id: sessionCode, participant_id: participantID})
            });

            const data = await response.json();

            console.log(data);

            socket.on('voting_progress', (data) => {

                console.log('Voting status:', data);

            });

            if (data.total_participants !== data.done_participants) {
                console.log(data.message);
                setGoWaiting(true);
                setGoVoting(false);
            } else if (data.total_participants === data.done_participants) {
                console.log(data.message);
                setGoWinner(true);
                setGoVoting(false);
                //fetchMovies(); May need to change this to get the winner
            } else {
                console.error("Error starting session:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Handler is for when we have a yes vote
    async function handleYes(movieID) {
        try {
            const response = await fetch("https://backend-production-e0e1.up.railway.app/session/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({session_id: sessionCode, participant_id: participantID, movie_id: movieID})
            });

            const data = await response.json();

            console.log(data);

            socket.on('vote_update', (data) => {

                console.log('Vote status:', data);

            });

            if (response.ok) {
                // Change to next movie handled in Voting.jsx
            } else {
                console.error("Error starting session:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function handleSendMovies(movies) {
        const ids = movies.map(item => item.id);
        console.log(movies);
        console.log(ids);
        //for (i = 0; i < ids.length; i++) {
        try {
            const response = await fetch("https://backend-production-e0e1.up.railway.app/session/add_movie", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    session_id: sessionCode,
                    participant_ID: participantID,
                    movie_ids: ids
                })
            });

            const data = await response.json();

            socket.on('movie_added', (data) => {

                console.log('Movie Info:', data);

            });

            if (response.ok) {

            } else {
                console.error("Error starting session:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
        //}

        try {
            const response = await fetch("https://backend-production-e0e1.up.railway.app/session/finish_selection", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    session_id: sessionCode,
                    participant_id: participantID
                })
            });

            const data = await response.json();

            socket.on('selection_progress', (data) => {

                console.log('Selection Progress:', data);

            });

            if (data.total_participants !== data.done_participants) {
                console.log(data.message);
                setGoWaiting(true);
                setGoCatalog(false);
            } else if (data.total_participants === data.done_participants) {
                console.log(data.message);
                setGoVoting(true);
                setGoCatalog(false);
                //fetchMovies();
            } else {
                console.error("Error starting session:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }

    }

    const Stack = createNativeStackNavigator();
    // check state, go to the respective screen
    // rewrite this code to use React's navigation
    if (isHosting) {
        return <Host handleHostSession={handleHostSession} setIsHosting={setIsHosting}/>;
    } else if (isJoining) {
        return <Join handleJoinSession={handleJoinSession} setIsJoining={setIsJoining} joinError={joinError}/>;
    } else if (inSession) {
        return (
          <Session
            sessionCode={sessionCode}
            hostName={hostName}
            name={name}
            participants={participants}
            handleStartSession={handleStartSession}
            handleLeaveSession={handleLeaveSession}
          />
        );
    } else if (stepScreen === "Step1") {
        return (
            <Step1GenreScreen
                onNext={(genres) => {
                    setGenreFilters(genres);
                    setStepScreen("Step2");
                }}
                sessionCode={sessionCode}
                participantID={participantID}
            />
        );
    } else if (stepScreen === "Step2") {
        return (
            <Step2TypeScreen
                onNext={({ sortBy, order }) => {
                    // onNext({ sortBy: sort, order });


                    setSortOption(sortBy); // popularity / release_date
                    setSortOrder(order); // asc/ desc

                    if(sortBy === "release_date") {
                        setYearRange({ from:  new Date().getFullYear().toString(), to: new Date().getFullYear().toString() });
                        setSortOption("popularity");

                        setStepScreen(null);
                        setGoCatalog(true);
                        return;
                    }
                    setStepScreen("Step3");
                }}
                sessionCode={sessionCode}
                participantID={participantID}
            />

        );
    } else if (stepScreen === "Step3") {
        return (
            <Step3TimePeriodScreen
                onNext={(range) => {
                    setYearRange(range);
                    setStepScreen(null);
                    setGoCatalog(true); // Navigate to Catalog
                }}
                sessionCode={sessionCode}
                participantID={participantID}
            />
        );
    } else if (goCatalog) {
        return <Catalog
            setGoCatalog={setGoCatalog}
            handleSendMovies={handleSendMovies}
            participants={participants}
            selectedGenres={genreFilters}
            selectedSort={sortOption}
            setSelectedGenres={setGenreFilters}
            selectedOrder={sortOrder}
            yearRange={yearRange}
            setYearRange={setYearRange}

            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            sortOption={sortOption}
            setSortOption={setSortOption}

        />
    } else if (goWaiting) {
        return (
          <Waiting
            setGoWaiting={setGoWaiting}
            setGoVoting={setGoVoting}
            participants={participants}
            finishedUsers={finishedUsers}
          />
        );
    } else if (goVoting) {
        return (
          <Voting
            setGoVoting={setGoVoting}
            setGoWinner={setGoWinner}
            setFinalVotes={setFinalVotes}
            handleYes={handleYes}
            handleFinalVote={handleFinalVote}
            fetchMovies={fetchMovies}
          />
        );
    } else if (goWinner) {
        return (
          <Winner
            finalVotes={finalVotes}
            setGoWinner={setGoWinner}
            setGoHome={setGoHome}
            fetchWinner={fetchWinner}
          />
        );
    }
    
    // Wrap Home + Step screens in NavigationContainer
    return (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home">
              {(props) => (
                <Home
                  {...props}
                  setIsHosting={setIsHosting}
                  setIsJoining={setIsJoining}
                  setGoCatalog={setGoCatalog}
                  setGoWaiting={setGoWaiting}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Step1" component={Step1GenreScreen} />
            <Stack.Screen name="Step2" component={Step2TypeScreen} />
            <Stack.Screen name="Step3" component={Step3TimePeriodScreen} />
          </Stack.Navigator>
        </NavigationContainer>
    );
}