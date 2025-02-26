import { useState } from "react";
import { View, Text } from "react-native";

import Home from './screens/Home';
import Host from './screens/Host';
import Join from './screens/Join';
import Session from './screens/Session';
import Catalog from './screens/Catalog';

export default function App() {
    const [isHosting, setIsHosting] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [inSession, setInSession] = useState(false);
    const [doneSelecting, setDoneSelecting] = useState(false);
    const [doneVoting, setDoneVoting] = useState(false);

    const [goCatalog, setGoCatalog] = useState(false); //temporary catalog access
    
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
    } else if (goCatalog) { //temporary catalog access
        return <Catalog setGoCatalog={setGoCatalog}/>;
    }

    return <Home setIsHosting={setIsHosting} setIsJoining={setIsJoining} setGoCatalog={setGoCatalog}/>; //remember to remove setGoCatalog
}