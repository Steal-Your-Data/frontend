import React, {useState, useRef} from 'react';
import {View, Text, Pressable, StyleSheet, useWindowDimensions, Animated, SafeAreaView} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import GradientBackground from "../components/GradientBackground";

export default function Step3TimePeriodScreen({onNext, sessionCode, participantID}) {
    const currentYear = new Date().getFullYear();
    const MAX_YEAR = 2025;
    const initialToYear = currentYear > MAX_YEAR ? MAX_YEAR : currentYear;

    const [range, setRange] = useState([2000, initialToYear]);
    const {width} = useWindowDimensions();

    // Animated pulse values for thumbs
    const thumbScale = useRef(new Animated.Value(1)).current;

    const handleFinish = () => {
        onNext({from: range[0].toString(), to: range[1].toString()});
    };

    const onDragStart = () => {
        Animated.spring(thumbScale, {
            toValue: 1.3,
            friction: 4,
            useNativeDriver: true,
        }).start();
    };

    const onDragEnd = () => {
        Animated.spring(thumbScale, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
        }).start();
    };

    const isMobile = width < 768;
    const sliderLength = width * (isMobile ? 0.67 : 0.76);

    return (
        <GradientBackground>
            <SafeAreaView className="flex-1 bg-transparent">
                <View className="flex-1 justify-center items-center bg-transparent px-6">
                    <Text className="text-gray-400 text-lg mb-2">Step 3 of 3</Text>

                    <Text className="text-white text-3xl font-bold mb-6 text-center">
                        What time period are you interested in?
                    </Text>

                    <View className="items-center w-full mb-8">
                        <Text className="bg-orange-500 text-white text-xl px-3 py-2 rounded-full font-extrabold overflow-hidden mb-1">
                            {range[0]} — {range[1]}
                        </Text>

                        {/* Slider and Number Labels */}
                        <View style={{width: width * 0.8, alignItems: 'center'}}>

                            {/* Actual slider */}
                            <MultiSlider
                                values={range}
                                min={1850}
                                max={MAX_YEAR}
                                onValuesChange={setRange}
                                enableLabel={false}
                                sliderLength={sliderLength}
                                trackStyle={{
                                    height: 8,
                                    borderRadius: 10,
                                    backgroundColor: '#555',
                                }}
                                selectedStyle={{
                                    backgroundColor: '#FFA500',
                                    shadowColor: '#FFA500',
                                    shadowOffset: {width: 0, height: 0},
                                    shadowOpacity: 0.8,
                                    shadowRadius: 6,
                                    elevation: 5,
                                }}
                                unselectedStyle={{
                                    backgroundColor: '#333',
                                }}
                                customMarker={() => (
                                    <Animated.View
                                        style={[
                                            styles.marker,
                                            {transform: [{scale: thumbScale}]},
                                        ]}
                                    />
                                )}
                                onValuesChangeStart={onDragStart}
                                onValuesChangeFinish={onDragEnd}
                            />

                            {/* Bottom year labels (above thumbs) */}
                            <View style={styles.labelRow}>
                                <Text style={styles.thumbLabel} className="bg-white/90 rounded-full px-2 py-1">1850</Text>
                                <Text style={styles.thumbLabel} className="bg-white/90 rounded-full px-2 py-1">{MAX_YEAR}</Text>
                            </View>
                        </View>
                    </View>

                </View>
                <View className="p-6 bg-orange-50/10 border-t border-white/20">
                    <Pressable
                        onPress={handleFinish}
                        className={"bg-orange-500 px-12 py-3 rounded-full"}
                        style={({pressed}) => [
                            {
                                transform: [{scale: pressed ? 1.05 : 1}],
                                shadowColor: '#FFA500',
                                shadowOffset: {width: 0, height: 4},
                                shadowOpacity: 0.6,
                                shadowRadius: 8,
                                elevation: 8,
                            },
                        ]}
                    >
                        <Text className="text-black font-bold text-lg text-center">Finish</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    labelRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    thumbLabel: {
        color: 'black',
        fontSize: 16,
        fontWeight: '700',
    },
    marker: {
        height: 26,
        width: 26,
        borderRadius: 13,
        backgroundColor: '#FFA500',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#FFA500',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 6,
    },
});
