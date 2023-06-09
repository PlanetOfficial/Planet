import React, { useState } from 'react';
import {View, StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity} from 'react-native';
import colors from '../../constants/colors';
import styles from '../../constants/styles';
import strings from '../../constants/strings';

/*
 * route params:
 * - firstName: string
 * - lastName: string
 */
const SignUpCreds = ({navigation, route}: {navigation: any; route: any}) => {
  const [firstName] = useState<string>(route.params.firstName);
  const [lastName] = useState<string>(route.params.lastName);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleNext = () => {
    setError('');

    if (username.length === 0 || password.length === 0 || passwordConfirm.length === 0) {
      setError(strings.signUp.missingFields);
      return;
    }

    if (username.length > 100) {
      setError(strings.signUp.inputLong);
      return;
    }

    if (password.length < 8) {
      setError(strings.signUp.passwordShort);
      return;
    }

    if (password.length > 100) {
      setError(strings.signUp.inputLong);
      return;
    }

    if (password !== passwordConfirm) {
      setError(strings.signUp.passwordsMatch);
      return;
    }

    // TODO: POST to API here**

    navigation.navigate('SignUpPhone');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{strings.login.signUp}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text>{strings.signUp.username}: </Text>
        <TextInput
          placeholder={strings.signUp.username}
          value={username}
          onChangeText={text => setUsername(text)}
          placeholderTextColor={colors.darkgrey}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>{strings.login.password}: </Text>
        <TextInput
          placeholder={strings.login.password}
          value={password}
          onChangeText={text => setPassword(text)}
          placeholderTextColor={colors.darkgrey}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>{strings.signUp.confirmPassword}: </Text>
        <TextInput
          placeholder={strings.signUp.confirmPassword}
          value={passwordConfirm}
          onChangeText={text => setPasswordConfirm(text)}
          placeholderTextColor={colors.darkgrey}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity onPress={() => handleNext()}>
        <Text>{strings.main.next}</Text>
      </TouchableOpacity>
      <View>
        {error.length !== 0 ? (
          <Text>{error}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default SignUpCreds;
