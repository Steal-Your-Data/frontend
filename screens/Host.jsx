import { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";

function Host(props) {
    const [hostName, setHostName] = useState('');

    return (
        <View style={styles.container}>
            <Button title="Back to Home" onPress={() => props.setIsHosting(false)}/>
            <Text style={styles.title}>Host a Session</Text>
            <Text>Enter Your Name</Text>
            <TextInput
                value={hostName}
                onChangeText={setHostName}
                style={styles.input}
            />
            <Button
                title="HOST"
                onPress={() => props.handleHostSession(hostName)}
                disabled={hostName.trim() === ''}
            />
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