import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import PhoneInput from 'react-phone-number-input/react-native-input';
import {E164Number} from 'libphonenumber-js/types';

import colors from '../../constants/colors';
import styles from '../../constants/styles';
import strings from '../../constants/strings';
import {sendCode, verifyCode} from '../../utils/api/authAPI';

/*
 * route params:
 * - authToken: string
 */
const SignUpPhone = ({navigation, route}: {navigation: any; route: any}) => {
  const [authToken] = useState<string>(route.params.authToken);

  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>();
  const [code, setCode] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleSendCode = async () => {
    setError('');

    if (phoneNumber === undefined || phoneNumber.length === 0) {
      setError(strings.signUp.missingFields);
      return;
    }

    const response = await sendCode(authToken, phoneNumber);

    if (!response) {
      setError(strings.signUp.codeSendFailed);
    }
  };

  const handleVerifyCode = async () => {
    setError('');

    if (code.length === 0) {
      setError(strings.signUp.missingFields);
      return;
    }

    const response = await verifyCode(authToken, code);

    if (response) {
      navigation.reset({
        index: 0,
        routes: [{name: 'SignUpInfo', params: {authToken: authToken}}],
      });
    } else {
      setError(strings.signUp.codeVerifyFailed);
    }
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

      <View>{error.length !== 0 ? <Text>{error}</Text> : null}</View>
    </SafeAreaView>
  );
};

export default SignUpPhone;
