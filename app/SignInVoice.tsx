import React, { useEffect, useState } from 'react';
import { Button, View, Text, Platform, PermissionsAndroid } from 'react-native';
import Voice, { SpeechResultsEvent } from 'react-native-voice';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';

function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button title="Sign Out" onPress={signOut} />;
}

interface VoiceControlledSignOutProps {
  onSignOutCommand: () => void;
}

const VoiceControlledSignOut: React.FC<VoiceControlledSignOutProps> = ({ onSignOutCommand }) => {
  const [transcript, setTranscript] = useState<string>('');
  const [listening, setListening] = useState<boolean>(false);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    setListening(true);
  };

  const onSpeechEnd = () => {
    setListening(false);
  };

  const onSpeechResults = (event: SpeechResultsEvent) => {
    const text = event.value ? event.value[0] : '';
    setTranscript(text);
    if (text.toLowerCase().includes('sign out') || text.toLowerCase().includes('log out') || text.toLowerCase().includes('sign off')) {
      onSignOutCommand();
    }
  };

  const startListening = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'App needs access to your microphone to recognize speech.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return;
      }
    }
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Transcript: {transcript}</Text>
      <Button title={listening ? "Listening..." : "Start Listening"} onPress={startListening} disabled={listening} />
    </View>
  );
};

const App: React.FC = () => {
  const { signOut } = useAuthenticator();

  const handleSignOutCommand = () => {
    signOut();
  };

  return (
    <Authenticator.Provider>
      <Authenticator>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <SignOutButton />
          <VoiceControlledSignOut onSignOutCommand={handleSignOutCommand} />
        </View>
      </Authenticator>
    </Authenticator.Provider>
  );
};

export default App;
