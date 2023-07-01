import React, {useState} from 'react';
import {
  ActivityIndicator,
  View,
  Text as RNText,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
  StatusBar,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import messaging from '@react-native-firebase/messaging';

import strings from '../../constants/strings';
import colors from '../../constants/colors';

import Text from '../components/Text';

import {isVerified, login, saveTokenToDatabase} from '../../utils/api/authAPI';
import {cacheUserInfo} from '../../utils/CacheHelpers';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    // Perform login logic, e.g. send login request to API

    setError('');

    // display an error if one of the fields are missing
    if (username.length === 0 || password.length === 0) {
      setError(strings.login.missingInfo);
      return;
    }

    setLoading(true);
    const response = await login(username, password);
    setLoading(false);

    if (response?.authToken) {
      // check if verified
      const verifiedResponse = await isVerified(response.authToken);
      if (!verifiedResponse) {
        navigation.reset({
          index: 0,
          routes: [
            {name: 'SignUpPhone', params: {authToken: response.authToken}},
          ],
        });

        return;
      }

      const cacheSuccess = await cacheUserInfo(response?.authToken);
      if (!cacheSuccess) {
        Alert.alert('Something went wrong. Please try again.');
        return;
      }

      // save to firebase
      const fcm_token = await messaging().getToken();
      await saveTokenToDatabase(fcm_token);

      navigation.reset({
        index: 0,
        routes: [{name: 'TabStack'}],
      });
    } else {
      setError(response?.message);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors[theme].primary, colors[theme].accent]}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        locations={[0.6, 1]}>
        <RNText style={styles.title}>{strings.main.appName}</RNText>
        <TextInput
          style={styles.input}
          placeholder={strings.login.username}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={colors[theme].neutral}
        />
        <TextInput
          style={styles.input}
          placeholder={strings.login.password}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          textContentType="password"
          placeholderTextColor={colors[theme].neutral}
        />
        <View>
          {error.length !== 0 ? (
            <Text size="s" color={colors[theme].red}>
              {error}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator size="small" color={colors[theme].primary} />
          ) : (
            <Text weight="b" color={colors[theme].primary}>
              {strings.login.login}
            </Text>
          )}
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate('SignUpName')}>
            <Text weight="b" color={colors[theme].primary}>
              {strings.login.signUp}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text size="s" weight="l">
            {strings.login.forgotPassword}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
    },
    title: {
      marginTop: vs(110),
      marginBottom: vs(70),
      fontSize: s(55),
      fontWeight: '900',
      fontFamily: 'Lato',
      color: colors[theme].accent,
    },
    input: {
      paddingHorizontal: s(25),
      marginBottom: vs(30),
      width: s(250),
      height: s(50),
      borderRadius: s(25),
      borderWidth: 1,
      borderColor: colors[theme].secondary,
      backgroundColor: colors[theme].primary,
      color: colors[theme].neutral,
      fontFamily: 'Lato',
    },
    button: {
      marginTop: vs(10),
      width: s(150),
      height: s(50),
      borderRadius: s(25),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors[theme].accent,
    },
    bottomContainer: {
      alignItems: 'center',
      marginTop: vs(20),
    },
    signUpButton: {
      marginBottom: vs(10),
      width: s(150),
      height: s(50),
      borderRadius: s(25),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors[theme].neutral,
    },
  });

export default LoginScreen;
