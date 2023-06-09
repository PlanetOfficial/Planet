import React, { useState } from 'react';
import {View, StyleSheet, SafeAreaView, Text, TouchableOpacity, TextInput} from 'react-native';
import PhoneInput from 'react-phone-number-input/react-native-input';

import colors from '../../constants/colors';
import styles from '../../constants/styles';
import strings from '../../constants/strings';
import { E164Number } from 'libphonenumber-js/types';

/*
 * route params:
 * - 
 */
const SignUpPhone = ({navigation}: {navigation: any}) => {
  // TODO: have userId at this point?
  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>();
  const [code, setCode] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleSendCode = () => {
    setError('');

    if (phoneNumber === undefined || phoneNumber.length === 0) {
      setError(strings.signUp.missingFields);
      return;
    }

    // TODO: call API to send a code

    
  };

  const handleVerifyCode = () => {
    setError('');

    if (code.length === 0) {
      setError(strings.signUp.missingFields);
      return;
    }

    // TODO: call API and verify code for user

    navigation.navigate('SignUpInfo');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{strings.login.signUp}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text>{strings.signUp.phoneNumber}: </Text>
        <PhoneInput
          placeholder={strings.signUp.phoneNumber}
          value={phoneNumber}
          onChange={setPhoneNumber}
        />
      </View>
      <TouchableOpacity onPress={() => handleSendCode()}>
        <Text>{strings.signUp.sendCode}</Text>
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <Text>{strings.signUp.code}: </Text>
        <TextInput
          placeholder={strings.signUp.code}
          value={code}
          onChangeText={text => setCode(text)}
          placeholderTextColor={colors.darkgrey}
        />
      </View>
      <TouchableOpacity onPress={() => handleVerifyCode()}>
        <Text>{strings.signUp.verifyCode}</Text>
      </TouchableOpacity>

      <View>
        {error.length !== 0 ? (
          <Text>{error}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default SignUpPhone;
