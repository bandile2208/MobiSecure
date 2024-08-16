// src/components/ShakeDetector.tsx
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import Shake from 'react-native-shake';
import { useAuthenticator } from '@aws-amplify/ui-react-native';

const ShakeDetector: React.FC<{ onShake: () => void }> = ({ onShake }) => {
  const { signOut } = useAuthenticator();

  useEffect(() => {
    const subscription = Shake.addListener(() => {
      Alert.alert(
        'Logout',
        'You are about to be logged out and will need to authenticate again.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              signOut();
              onShake();
            },
          },
        ],
      );
    });

    return () => {
      subscription.remove();
    };
  }, [signOut, onShake]);

  return null;
};

export default ShakeDetector;
