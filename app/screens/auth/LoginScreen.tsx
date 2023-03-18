import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';

import strings from '../../constants/strings';

import {login} from '../../utils/api/auth/login';
import {colors} from '../../constants/theme';
import {vectors} from '../../constants/images';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // TODO: make sure encrypted storage is cleared if we end up on this screen

  const handleLogin = async () => {
    // Perform login logic, e.g. send login request to API

    const response = await login(email, password);
    if (response?.authToken) {
      // successful login
      await EncryptedStorage.setItem('auth_token', response?.authToken);
      setEmail('');
      setPassword('');
      navigation.navigate('TabStack');
    } else {
      console.log('Failed login, error: ' + response?.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.background} source={vectors.shape3} />
      <Text style={styles.title}>{strings.main.rivalet}</Text>
      <TextInput
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
        style={styles.input}
        placeholder={strings.login.password}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        textContentType="password"
      />
      <Text
        style={styles.forgotPassword}
        onPress={() => navigation.navigate('ForgotPassword')}>
        {strings.login.forgotPassword}
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
    width: W,
    height: H,
    backgroundColor: colors.white,
  },
  background: {
    position: 'absolute',
    width: W,
    height: H,
    tintColor: colors.fill,
  },
  title: {
    marginTop: 175,
    marginBottom: 30,
    fontSize: 75,
    fontWeight: 'bold',
    color: colors.black,
  },
  input: {
    paddingHorizontal: 25,
    marginTop: 30,
    width: '80%',
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grey,
  },
  forgotPassword: {
    marginTop: 5,
    paddingLeft: 15,
    width: '80%',
    fontSize: 14,
    color: colors.accent,
  },
  button: {
    marginTop: 40,
    width: '50%',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  bottomText: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  bottomTextLink: {
    color: colors.accent,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
