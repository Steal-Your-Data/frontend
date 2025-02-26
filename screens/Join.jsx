import { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";

function Join(props) {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join a Session</Text>
            <Text>Enter Session Code</Text>
            <TextInput
                value={code}
                style={styles.input}
            />
            <Text>Enter Your Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <Button title="JOIN" onPress={() => props.handleJoinSession(code, name)}/>
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
    input: {
        height: 50,
        margin: 12,
        borderWidth: 1,
        width: '70%',
        padding: 12
    }
})

export default Join;