//This Component will be used by customers in moments of danger
//The Component needs to be implemented on EVERY page

import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native';

const TapDetector: React.FC = () => {
  const [flash, setFlash] = useState(false);

  const handleLongPress = () => {
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
    }, 500); // 0.5 seconds
  };

  return (
    <>
      <TouchableOpacity
        style={styles.tapArea}
        onLongPress={handleLongPress}
        delayLongPress={5000} // 5 seconds
      >
        {/* Touchable Area */}
      </TouchableOpacity>

      {/* Full-screen white overlay */}
      {flash && <View style={styles.flashOverlay} />}
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  tapArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%', 
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'white',
    zIndex: 9999,
  },
});

export default TapDetector;
