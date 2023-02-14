import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import strings from '../../constants/strings';

import { login } from '../../utils/auth/login';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Perform login logic, e.g. send login request to API

    const response = await login(email, password);
    if (response?.authToken) {
      // successful login
      navigation.navigate('TabStack')
    } else {
      console.log("Failed login, error: " + response?.message);
    }
  };

  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{strings.login.login}</Text>
      </TouchableOpacity>
      <Text
        style={styles.forgotPassword}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        {strings.login.forgotPassword}
      </Text>
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>{strings.login.noAccount}</Text>
        <Text
          style={styles.bottomTextLink}
          onPress={() => navigation.navigate('SignUp')}
        >
          {strings.login.signUp}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 48,
  },
  input: {
    width: '80%',
    height: 40,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 8,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 8,
    fontSize: 14,
    color: 'blue',
    textAlign: 'right',
    width: '80%'
  },
  bottomText: {
    fontSize: 14,
    textAlign: 'center'
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: 24
  },
  bottomTextLink: {
    color: 'blue',
    marginLeft: 8,
    fontWeight: 'bold'
  }
});

export default LoginScreen;
