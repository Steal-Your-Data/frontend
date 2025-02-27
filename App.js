import { useState } from "react";
import Home from './screens/Home';
import Host from './screens/Host';
import Join from './screens/Join';
import Session from './screens/Session';
import Catalog from './screens/Catalog';
import Waiting from './screens/Waiting';

export default function App() {
    const [isHosting, setIsHosting] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [inSession, setInSession] = useState(false);

    const [sessionCode, setSessionCode] = useState('');
    const [hostName, setHostName] = useState('');
    const [name, setName] = useState('');
    const [participants, setParticipants] = useState([]);

    const [goCatalog, setGoCatalog] = useState(false); //temporary catalog access
    const [goWaiting, setGoWaiting] = useState(false);

    const [doneSelecting, setDoneSelecting] = useState(false);
    const [doneVoting, setDoneVoting] = useState(false);

    function handleHostSession(sessionCode, hostName) {
        setSessionCode(sessionCode);
        setHostName(hostName);
        setParticipants([hostName]);
        setIsHosting(false);
        setInSession(true);
    }

    function handleJoinSession(code, name) {
        setSessionCode(code);
        setName(name);
        setParticipants((prev) => [...prev, name]);
        setIsJoining(false);
        setInSession(true);
    }

    function handleStartSession() {
        setGoCatalog(true);
        setInSession(false);
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
    } else if (goCatalog) { //temporary catalog access
        return <Catalog setGoCatalog={setGoCatalog}/>;
    } else if (goWaiting) {
        return <Waiting setGoWaiting={setGoWaiting}/>;
    }

    return <Home
        setIsHosting={setIsHosting}
        setIsJoining={setIsJoining}
        setGoCatalog={setGoCatalog} 
        setGoWaiting={setGoWaiting}
    />; //remember to remove setGoCatalog
}