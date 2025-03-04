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
            const response = await fetch("http://localhost:8081/session/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ host_name: hostName })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setSessionCode(data.session_id);
                setHostName(hostName);
                setParticipants([hostName]);
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
            const response = await fetch("http://localhost:8081/session/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ session_id: sessionCode, name })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setSessionCode(code);
                setName(name);
                setParticipants((prev) => [...prev, name]);
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
            const response = await fetch("http://localhost:8081/session/begin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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
            const response = await fetch(`http://localhost:8081/session/list_join_participants?session_id=${sessionCode}`);
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