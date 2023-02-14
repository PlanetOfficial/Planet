import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import strings from '../../constants/strings';

import { signup } from '../../utils/auth/signup';

const SignUp = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmed, setPasswordConfirmed] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');

  const handleSignUp = async () => {
    // Perform login logic, e.g. send login request to API

    const response = await signup(name, email, password);
    if (response?.authToken) {
      // successful login
      navigation.navigate('TabStack')
    } else {
      console.log("Failed login, error: " + response?.message);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={strings.signUp.nameAndUsername}
        value={name}
        onChangeText={text => setName(text)}
      />
      <View style={styles.verticalSpace} />
      <TextInput
        style={styles.input}
        placeholder={strings.login.email}
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <View style={styles.verticalSpace} />
      <TextInput
        style={styles.input}
        placeholder={strings.login.password}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <View style={styles.verticalSpace} />
      <TextInput
        style={styles.input}
        placeholder={strings.signUp.confirmPassword}
        value={passwordConfirmed}
        onChangeText={text => setPasswordConfirmed(text)}
      />
      <View style={styles.verticalSpace} />
      <TextInput
        style={styles.input}
        placeholder={strings.signUp.phoneNumber}
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
      />
      <View style={styles.verticalSpace} />
      <TextInput
        style={styles.input}
        placeholder={strings.signUp.age}
        value={age}
        onChangeText={text => setAge(text)}
      />
      <View style={styles.verticalSpace} />
      <TouchableOpacity 
        style={styles.button}
        onPress={() => handleSignUp()}
      >
        <Text style={styles.buttonText}>{strings.signUp.signUp}</Text>
      </TouchableOpacity>
      <View style={styles.verticalSpace} />
      <Text style={styles.footerText}>
      {strings.signUp.termsAgreement}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10
  },
  verticalSpace: {
    height: 20
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'gray'
  }
})

export default SignUp;
