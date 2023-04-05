import React, {useState} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';

import strings from '../../constants/strings';

import {login} from '../../utils/api/auth/login';
import {colors} from '../../constants/theme';
import {vectors} from '../../constants/images';
import {cacheUserInfo} from '../../utils/functions/CacheHelpers';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      <Image style={styles.background} source={vectors.login} />
      <Text style={styles.title}>{strings.main.rivalet}</Text>
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
      />
      <TextInput
        testID="passwordTextInput"
        style={styles.input}
        placeholder={strings.login.password}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        textContentType="password"
      />
      <Text
        style={styles.forgotPwd}
        onPress={() => navigation.navigate('ForgotPassword')}>
        {strings.login.forgotPassword}
      </Text>
      <View>{error.length !== 0 ? <Text>{error}</Text> : null}</View>
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
});

export default LoginScreen;
