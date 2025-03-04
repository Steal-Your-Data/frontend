import { View, Text, Button, StyleSheet, FlatList } from 'react-native';

function Session(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{props.hostName}'s Session</Text>
            <Text style={styles.code}>Code: {props.sessionCode}</Text>
            <Text style={styles.subtitle}>Participants:</Text>

            <FlatList
                data={props.participants}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.participant}>{item}</Text>}
            />

            {props.participants.length < 2 ? (
                <Text>{props.participants.length} participant</Text>
            ) : (
                <Text>{props.participants.length} participants</Text>
            )}

            {props.participants[0] === props.hostName ? (
                <Button
                    title="START"
                    onPress={props.handleStartSession}
                    // commented out for now to test going to catalog, remember to uncomment later
                    // disabled={props.participants.length < 2}
                />
            ) : (
                <Text>Waiting for host to start...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    code: {
        fontSize: 18,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    participant: {
        fontSize: 18,
        padding: 5,
    }
});

export default Session;