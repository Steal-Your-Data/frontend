import React, { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions, Animated } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default function Step3TimePeriodScreen({ onNext, sessionCode, participantID }) {
  const currentYear = new Date().getFullYear();
  const MAX_YEAR = 2025;
  const initialToYear = currentYear > MAX_YEAR ? MAX_YEAR : currentYear;

  const [range, setRange] = useState([2000, initialToYear]);
  const { width } = useWindowDimensions();

  // Animated pulse values for thumbs
  const thumbScale = useRef(new Animated.Value(1)).current;

  const handleFinish = () => {
    onNext({ from: range[0].toString(), to: range[1].toString() });
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

  return (
    <View className="flex-1 justify-center items-center bg-black px-6">
      <Text className="text-gray-400 text-lg mb-2">Step 3 of 3</Text>

      <Text className="text-white text-3xl font-bold mb-6 text-center">
        What time period are you interested in?
      </Text>

      <View className="items-center w-full mb-16">
        <Text className="text-orange-500 text-2xl font-extrabold mb-4 tracking-wide">
          {range[0]} — {range[1]}
        </Text>

        {/* Slider and Number Labels */}
        <View style={{ width: width * 0.8, alignItems: 'center' }}>
          {/* Top year labels (above thumbs) */}
          <View style={styles.labelRow}>
            <Text style={styles.thumbLabel}>1850</Text>
            <Text style={styles.thumbLabel}>{MAX_YEAR}</Text>
          </View>

          {/* Actual slider */}
          <MultiSlider
            values={range}
            min={1850}
            max={MAX_YEAR}
            onValuesChange={setRange}
            enableLabel={false}
            sliderLength={width * 0.8}
            trackStyle={{
              height: 8,
              borderRadius: 10,
              backgroundColor: '#555',
            }}
            selectedStyle={{
              backgroundColor: '#FFA500',
              shadowColor: '#FFA500',
              shadowOffset: { width: 0, height: 0 },
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
                  { transform: [{ scale: thumbScale }] },
                ]}
              />
            )}
            onValuesChangeStart={onDragStart}
            onValuesChangeFinish={onDragEnd}
          />
        </View>
      </View>

      <Pressable
        onPress={handleFinish}
        className="bg-orange-500 px-12 py-3 rounded-full"
        style={({ pressed }) => [
          {
            transform: [{ scale: pressed ? 1.05 : 1 }],
            shadowColor: '#FFA500',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
            elevation: 8,
          },
        ]}
      >
        <Text className="text-white font-bold text-lg">Finish</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  thumbLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  marker: {
    height: 26,
    width: 26,
    borderRadius: 13,
    backgroundColor: '#FFA500',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 6,
  },
});
