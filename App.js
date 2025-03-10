import { useState } from "react";
import { View, Text } from "react-native";
import Home from './screens/Home';
import Host from './screens/Host';
import Join from './screens/Join';
import Session from './screens/Session';
import Catalog from './screens/Catalog';
import Waiting from './screens/Waiting';
import Voting from './screens/Voting'; // Import Voting Screen
import Winner from './screens/Winner';
import io from 'socket.io-client';  // Used for interacting with backend
import { useEffect } from "react";
 
const socket = io('http://localhost:5000', {

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
    const [participants, setParticipants] = useState('');
    const [goCatalog, setGoCatalog] = useState(false); // temporary catalog access
    const [goWaiting, setGoWaiting] = useState(false);
    const [goVoting, setGoVoting] = useState(false);
    const [goWinner, setGoWinner] = useState(false);
    const [goHome, setGoHome] = useState(false);
    const [doneSelecting, setDoneSelecting] = useState(false);
    const [doneVoting, setDoneVoting] = useState(false);
    const [finalVotes, setFinalVotes] = useState({});

    // Listen for user_joined and user_left events
    useEffect(() => {
        socket.on("user_joined", (data) => {
            console.log("User joined:", data);
            setParticipants((prev) => { // update list of participants when someone joins
                if (!prev.includes(data.name)) {
                    return [...prev, data.name];
                }
                return prev;
            });
        });
    
        socket.on("user_left", (data) => {
            console.log("User left:", data);
            setParticipants((prev) => // update list of participants when someone leaves
                prev.filter((participant) => participant !== data.name)
            );
        });

        socket.on('selection_complete', (data) => {

            console.log('Selection Completed:', data);
            setGoVoting(true); // Move all clients to the Voting page
            setGoWaiting(false); // Might have to change???
        });
    
        return () => {
            socket.off("user_joined");
            socket.off("user_left");
        };
    }, []);
    
    // This useEffect is for switching Session for nonHost participants
    useEffect(() => {
        // Wait for a session_begin signal by backend
        socket.on('session_begin', (data) => {
            console.log("Session begin:", data);
            setGoCatalog(true); // Move all clients to the Catalog page
            setInSession(false);
        });
     
        return () => {
            socket.off('session_begin'); // Clean up event listener
        };
    }, []);


    // This useEffect is for switching from Voting to movie voting
    useEffect(() => {
        // Wait for a session_begin signal by backend
        socket.on('dummy', (data) => {
            console.log("Voting begin:", data);
            setGoWinner(true); // Move all clients to the Voting page
            setFinalVotes(false); // Might have to change???
        });
     
        return () => {
            socket.off('dummy'); // Clean up event listener
        };
    }, []);

    async function handleHostSession(hostName) {
        try {
            const response = await fetch("http://localhost:5000/session/start", {
                method: "POST",
                headers: {
                    'Access-Control-Allow-Origin': '*', // USE THIS FOR EVERY FETCH!!!!
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ host_name: hostName })
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
                setParticipants([hostName]);
                setParticipantID(data.participant_id);
                console.log(data.participant_id)
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

    async function handleJoinSession(sessionCode, name) {
        try {
            const response = await fetch("http://localhost:5000/session/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*' // USE THIS FOR EVERY FETCH!!!!
                },
                body: JSON.stringify({ session_id: sessionCode, name: name})
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
    
            if (response.ok) {
                setSessionCode(sessionCode);
                setName(name);
                setParticipants((prev) => [...prev, name]);
                setParticipantID(data.participant_ID);
                joinSession(sessionCode, name);
                setIsJoining(false);
                setInSession(true);
            } else {
                console.error("Error joining session:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Handler is for when Host clicks "Start" button
    async function handleStartSession() {
        try {
            const response = await fetch("http://localhost:5000/session/begin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ session_id: sessionCode })
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

    async function handleSendMovies(movieIDs) {
        const ids = Object.keys(movieIDs);
        //console.log(participantID);
        for (i = 0; i < ids.length; i++) {
            try {
                const response = await fetch("http://localhost:5000/session/add_movie", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ session_id: sessionCode,
                                           participant_ID: participantID,
                                           movie_id: ids[i]})
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
        }
        
        try {
            const response = await fetch("http://localhost:5000/session/finish_selection", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ session_id: sessionCode,
                                       participant_id: participantID})
            });
    
            const data = await response.json();

            socket.on('selection_progress', (data) => {

                console.log('Selection Progress:', data);
              
            });

  
    
            if (response.ok) {
                console.log(data.message);  
                setGoWaiting(true);
                setGoCatalog(false);
            } else {
                console.error("Error starting session:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }

    } 

    async function fetchParticipants() {
        try {
            const response = await fetch(`http://localhost:5000/session/list_join_participants?session_id=${sessionCode}`);
            const data = await response.json();
    
            if (response.ok) {
                setParticipants(data.participants_name);
            } else {
                console.error("Error fetching participants:", data.error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }    

    if (isHosting) {
        return <Host handleHostSession={handleHostSession} setIsHosting={setIsHosting}/>;
    } else if (isJoining) {
        return <Join handleJoinSession={handleJoinSession} setIsJoining={setIsJoining}/>;
    } else if (inSession) {
        return <Session
            sessionCode={sessionCode}
            hostName={hostName} 
            name={name}
            participants={participants}
            handleStartSession={handleStartSession}
        />;
    } else if (goCatalog) { // temporary catalog access
        return <Catalog setGoCatalog={setGoCatalog} handleSendMovies={handleSendMovies}/>;
    } else if (goWaiting) {
        return <Waiting setGoWaiting={setGoWaiting} setGoVoting={setGoVoting}/>; // Pass setGoVoting
    } else if (goVoting) {
      return <Voting setGoVoting={setGoVoting} setGoWinner={setGoWinner} setFinalVotes={setFinalVotes} />;
    } else if (goWinner) {
      return <Winner finalVotes={finalVotes} setGoWinner={setGoWinner} setGoHome={setGoHome} />;
    } else if (goHome) {
        return <Home setIsHosting={setIsHosting} setIsJoining={setIsJoining} setGoCatalog={setGoCatalog} setGoWaiting={setGoWaiting} />;
    }
    return <Home
        setIsHosting={setIsHosting}
        setIsJoining={setIsJoining}
        setGoCatalog={setGoCatalog} 
        setGoWaiting={setGoWaiting}
    />; //remember to remove setGoCatalog
}