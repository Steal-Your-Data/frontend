import { View, Text, Button, Image, StyleSheet } from "react-native";

function Home(props) { //remember to delete catalog button
    return (
        <View style={styles.container}>
            <Image source={require('../assets/app-logo.png')} style={styles.image}/>
            <Text style={styles.title}>What are you in the mood for?</Text>
            <Text style={styles.text}>Find something to watch by joining a matching session or hosting your own!</Text>
            <Button title="Join" onPress={() => props.setIsJoining(true)}/>
            <Button title="Host" onPress={() => props.setIsHosting(true)}/>
            <Button title="Catalog" onPress={() => props.setGoCatalog(true)}/>
            <Button title="Voting" onPress={() => props.setGoWaiting(true)} />
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
    image: {
        height: 175,
        width: 175,
        marginBottom: 20
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20
    },
    text: {
        fontSize: 15,
        textAlign: "center",
        marginBottom: 20
    }
})

export default Home;