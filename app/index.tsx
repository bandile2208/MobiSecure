// index.tsx
import React, { useState } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import BiometricAuthComponent from '@/components/BiometricAuth';
//import ShakeDetector from '@/components/ShakeDetector';
import awsconfig from '../src/aws-exports';

Amplify.configure(awsconfig);

const MySignInFooter = () => <Text>My Footer</Text>;

function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button onPress={signOut} title="Sign Out" />;
}

const App = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [showBiometricAuth, setShowBiometricAuth] = useState<boolean>(false);

  const handleBiometricSuccess = () => {
    setAuthenticated(true);
    setShowBiometricAuth(false);
  };

 /* const handleShake = () => {
    setAuthenticated(false);
    setShowBiometricAuth(true);
  };*/

  return (
    <Authenticator.Provider>
      
      {showBiometricAuth ? (
        <BiometricAuthComponent onSuccess={handleBiometricSuccess} />
      ) : (
        <Authenticator>
          <View style={styles.container}>
            {authenticated && <SignOutButton />}
          </View>
        </Authenticator>
      )}
    </Authenticator.Provider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default App;
