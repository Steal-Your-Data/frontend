import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

function Waiting({ setGoWaiting, setGoVoting }) { // Accept setGoVoting as prop
    const totalUsers = 4; // Change dynamically if needed
    const [finishedUsers, setFinishedUsers] = useState(0);
    const [countdown, setCountdown] = useState(10); // Simulated countdown

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setFinishedUsers(prev => (prev < totalUsers ? prev + 1 : prev));
        }, 2000); // Simulated user voting completion

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1 || finishedUsers >= totalUsers) {
                    clearInterval(timer);
                    clearInterval(progressInterval);
                    setGoWaiting(false); // Exit Waiting
                    setGoVoting(true);  // Go to Voting
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            clearInterval(progressInterval);
        };
    }, [finishedUsers]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Waiting for Everyone to Finish...</Text>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.progress}>
                {finishedUsers}/{totalUsers} people have finished voting
            </Text>
            <Text style={styles.countdown}>Time Remaining: {countdown}s</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    progress: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        color: '#333',
    },
    countdown: {
        fontSize: 16,
        marginTop: 10,
        color: '#555',
    },
});

export default Waiting;
