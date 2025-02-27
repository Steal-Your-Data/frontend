import { useState } from "react";
import { View, Text } from "react-native";
import Winner from './screens/Winner';
import Home from './screens/Home';
import Host from './screens/Host';
import Join from './screens/Join';
import Session from './screens/Session';
import Catalog from './screens/Catalog';
import Waiting from './screens/Waiting';
import Voting from './screens/Voting'; // Import Voting Screen

export default function App() {
    const [isHosting, setIsHosting] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [inSession, setInSession] = useState(false);
    const [doneSelecting, setDoneSelecting] = useState(false);
    const [doneVoting, setDoneVoting] = useState(false);
    const [goWinner, setGoWinner] = useState(false);
    const [finalVotes, setFinalVotes] = useState({});
    const [goCatalog, setGoCatalog] = useState(false); // Temporary catalog access
    const [goWaiting, setGoWaiting] = useState(false);
    const [goVoting, setGoVoting] = useState(false); 
    const [goHome, setGoHome] = useState(false);

    function handleHostSession(sessionCode, hostName) {
        setSessionCode(sessionCode);
        setName(hostName);
        setIsHosting(false);
        setInSession(true);
    }

    function handleJoinSession(code, name) {
        setSessionCode(code);
        setName(name);
        setIsJoining(false);
        setInSession(true);
    }

    if (isHosting) {
        return <Host handleHostSession={handleHostSession}/>;
    } else if (isJoining) {
        return <Join handleJoinSession={handleJoinSession}/>;
    } else if (inSession) {
        return <Session sessionCode={sessionCode} hostName={hostName} code={code} name={name}/>;
    } else if (goCatalog) {
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

    return <Home setIsHosting={setIsHosting} setIsJoining={setIsJoining} setGoCatalog={setGoCatalog} setGoWaiting={setGoWaiting}/>; // Remove setGoCatalog in final version
}
