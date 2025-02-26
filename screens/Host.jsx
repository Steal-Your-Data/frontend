import { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";

function Host(props) {
    const [sessionCode, setSessionCode] = useState(generateCode());
    const [hostName, setHostName] = useState('');

    function generateCode() {
        random_num = Math.floor(Math.random() * 1000000);
        return random_num.toString().padStart(6, '0');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Host a Session</Text>
            <Text>Your Session Code</Text>
            <Text style={styles.code}>{sessionCode}</Text>
            <Text>Enter Your Name</Text>
            <TextInput
                value={hostName}
                onChangeText={setHostName}
                style={styles.input}
            />
            <Button title="HOST" onPress={() => props.handleHostSession(sessionCode, hostName)}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 10
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20
    },
    code: {
        fontSize: 18
    },
    input: {
        height: 50,
        margin: 12,
        borderWidth: 1,
        width: '70%',
        padding: 12
    }
})

export default Host;