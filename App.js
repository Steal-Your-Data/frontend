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
 
const socket = io('http://localhost:5000', {

  transports: ['websocket'],  // Ensure WebSocket is used for real-time communication

});
 
// Listen for incoming messages or events

socket.on('user_joined', (data) => {

  console.log('User joined:', data);

});
 
socket.on('user_left', (data) => {

  console.log('User left:', data);

});

 


export default function App() {
    const [isHosting, setIsHosting] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [inSession, setInSession] = useState(false);
    const [sessionCode, setSessionCode] = useState('');
    const [hostName, setHostName] = useState('');
    const [name, setName] = useState('');
    const [participants, setParticipants] = useState([]);
    const [goCatalog, setGoCatalog] = useState(false); // temporary catalog access
    const [goWaiting, setGoWaiting] = useState(false);
    const [goVoting, setGoVoting] = useState(false);
    const [goWinner, setGoWinner] = useState(false);
    const [goHome, setGoHome] = useState(false);
    const [doneSelecting, setDoneSelecting] = useState(false);
    const [doneVoting, setDoneVoting] = useState(false);
    const [finalVotes, setFinalVotes] = useState({});

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
        return <Catalog setGoCatalog={setGoCatalog}/>;
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