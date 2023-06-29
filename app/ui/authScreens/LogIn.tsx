import React, {useState} from 'react';
import {
  ActivityIndicator,
  View,
  Text as RNText,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
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
        colors={[colors.white, colors.primary]}
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
          placeholderTextColor={colors.black}
        />
        <TextInput
          style={styles.input}
          placeholder={strings.login.password}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          textContentType="password"
          placeholderTextColor={colors.black}
        />
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text size="s" weight="l">
            {strings.login.forgotPassword}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text weight="b" color={colors.white}>
              {strings.login.login}
            </Text>
          )}
        </TouchableOpacity>
        <View>
          {error.length !== 0 ? (
            <Text size="s" color={colors.red}>
              {error}
            </Text>
          ) : null}
        </View>
        <View style={styles.bottomContainer}>
          <Text size="s">{strings.login.noAccount}</Text>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate('SignUpName')}>
            <Text weight="b" color={colors.white}>
              {strings.login.signUp}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    marginTop: vs(110),
    marginBottom: vs(70),
    fontSize: s(75),
    fontWeight: '900',
    fontFamily: 'Lato',
    color: colors.primary,
  },
  input: {
    paddingHorizontal: s(25),
    marginBottom: vs(30),
    width: s(250),
    height: s(50),
    borderRadius: s(25),
    borderWidth: s(1.5),
    borderColor: colors.grey,
    backgroundColor: colors.white,
    color: colors.black,
    fontFamily: 'Lato',
  },
  button: {
    marginTop: vs(10),
    marginBottom: vs(10),
    width: s(150),
    height: s(50),
    borderRadius: s(25),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  bottomContainer: {
    alignItems: 'center',
    marginTop: vs(20),
  },
  signUpButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(10),
    width: s(150),
    height: s(50),
    borderRadius: s(25),
    backgroundColor: colors.black,
  },
});

export default LoginScreen;
