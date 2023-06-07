import React, {useState} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import messaging from '@react-native-firebase/messaging';

import strings from '../../constants/strings';

import {login, saveTokenToDatabase} from '../../utils/api/authAPI';
import colors from '../../constants/colors';
import {cacheUserInfo} from '../../utils/CacheHelpers';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    // Perform login logic, e.g. send login request to API

    setError('');

    // display an error if one of the fields are missing
    if (email.length === 0 || password.length === 0) {
      setError(strings.login.missingInfo);
      return;
    }

    setLoading(true);
    const response = await login(email, password);
    setLoading(false);

    if (response?.authToken) {
      // successful login
      await cacheUserInfo(response?.authToken);

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
    <View testID="loginScreenView" style={styles.container}>
      <Text style={styles.title}>{strings.main.appName}</Text>
      <TextInput
        testID="emailTextInput"
        style={styles.input}
        placeholder={strings.login.email}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        placeholderTextColor={colors.darkgrey}
      />
      <TextInput
        testID="passwordTextInput"
        style={styles.input}
        placeholder={strings.login.password}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        textContentType="password"
        placeholderTextColor={colors.darkgrey}
      />
      <Text
        style={styles.forgotPwd}
        onPress={() => navigation.navigate('ForgotPassword')}>
        {strings.login.forgotPassword}
      </Text>
      <View>
        {error.length !== 0 ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <View>
        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} />
        ) : null}
      </View>
      <TouchableOpacity
        testID="loginButton"
        style={styles.button}
        onPress={handleLogin}>
        <Text style={styles.buttonText}>{strings.login.login}</Text>
      </TouchableOpacity>
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>{strings.login.noAccount}</Text>
        <Text
          style={styles.bottomTextLink}
          onPress={() => navigation.navigate('SignUp')}>
          {strings.login.signUp}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    tintColor: colors.accent,
  },
  title: {
    marginTop: vs(140),
    marginBottom: vs(30),
    fontSize: s(70),
    fontWeight: '700',
    color: colors.accent,
  },
  input: {
    paddingHorizontal: s(25),
    marginTop: vs(30),
    width: s(250),
    height: s(50),
    borderRadius: s(25),
    borderWidth: 2,
    borderColor: colors.darkgrey,
    backgroundColor: colors.white,
    color: colors.black,
  },
  forgotPwd: {
    marginTop: vs(7),
    paddingHorizontal: s(20),
    width: s(250),
    fontSize: s(12),
    textAlign: 'right',
    color: colors.black,
  },
  button: {
    marginTop: vs(40),
    width: s(150),
    height: s(50),
    borderRadius: s(25),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  buttonText: {
    color: colors.white,
    fontSize: s(16),
    fontWeight: '700',
  },
  bottomText: {
    fontSize: s(12),
    textAlign: 'center',
    color: colors.black,
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: vs(20),
  },
  bottomTextLink: {
    color: colors.accent,
    marginLeft: s(8),
    fontWeight: '700',
  },
  error: {
    color: colors.black,
  },
});

export default LoginScreen;
