// src/components/BiometricAuthComponent.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const biometrics = new ReactNativeBiometrics();

const BiometricAuthComponent: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [isBiometricSupported, setIsBiometricSupported] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      try {
        const { available } = await biometrics.isSensorAvailable();
        setIsBiometricSupported(available);
        setLoading(false);
      } catch (error) {
        console.error('Biometric support check error:', error);
        setLoading(false);
      }
    };

    checkBiometricSupport();
  }, []);

  const handleBiometricLogin = async () => {
    try {
      setLoading(true);
      const { success } = await biometrics.simplePrompt({ promptMessage: 'Log in with Biometrics' });
      if (success) {
        // User successfully authenticated
        onSuccess();
      } else {
        Alert.alert('Login Failed', 'Biometric authentication failed');
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {isBiometricSupported ? (
        <Button title="Login with Biometrics" onPress={handleBiometricLogin} />
      ) : (
        <Text>Biometric authentication is not supported on this device</Text>
      )}
    </View>
  );
};

export default BiometricAuthComponent;
