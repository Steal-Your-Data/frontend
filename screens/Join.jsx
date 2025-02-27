import { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";

function Join(props) {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');

    const handleInputCode = (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setCode(numericText);
    };

    return (
        <View style={styles.container}>
            <Button title="Back to Home" onPress={() => props.setIsJoining(false)}/>
            <Text style={styles.title}>Join a Session</Text>
            <Text>Enter Session Code</Text>
            <TextInput
                value={code}
                onChangeText={handleInputCode}
                keyboardType="numeric"
                maxLength={6}
                style={styles.input}
            />
            <Text>Enter Your Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <Button
                title="JOIN"
                onPress={() => props.handleJoinSession(code, name)}
                disabled={code.trim() === '' && name.trim() === ''}
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
    input: {
        height: 50,
        margin: 12,
        borderWidth: 1,
        width: '70%',
        padding: 12
    }
})

export default Join;