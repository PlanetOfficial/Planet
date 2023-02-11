import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const SignUp = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmed, setPasswordConfirmed] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name/Username"
        value={name}
        onChangeText={text => setName(text)}
      />
      <View style={styles.verticalSpace} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <View style={styles.verticalSpace} />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <View style={styles.verticalSpace} />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={passwordConfirmed}
        onChangeText={text => setPasswordConfirmed(text)}
      />
      <View style={styles.verticalSpace} />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
      />
      <View style={styles.verticalSpace} />
      <TextInput
        style={styles.input}
        placeholder="Age (optional)"
        value={age}
        onChangeText={text => setAge(text)}
      />
      <View style={styles.verticalSpace} />
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('TabStack')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.verticalSpace} />
      <Text style={styles.footerText}>
        By signing up, you agree to Rivalet's Terms and Conditions and Privacy Policy.
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
