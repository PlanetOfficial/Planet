import React, {useState} from 'react';
import {View, SafeAreaView, TouchableOpacity, StyleSheet} from 'react-native';
import PhoneInput from 'react-phone-number-input/react-native-input';
import {s} from 'react-native-size-matters';

import {E164Number} from 'libphonenumber-js/types';

import Text from '../components/Text';
import colors from '../../constants/colors';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import {sendCode} from '../../utils/api/authAPI';

/*
 * route params:
 * - authToken: string
 */
const SignUpPhone = ({navigation, route}: {navigation: any; route: any}) => {
  const [authToken] = useState<string>(route.params?.authToken);

  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>();

  const [error, setError] = useState<string>('');

  const handleSendCode = async () => {
    setError('');

    if (phoneNumber === undefined || phoneNumber.length === 0) {
      setError(strings.signUp.missingFields);
      return;
    }

    const response = await sendCode(authToken, phoneNumber);

    if (response) {
      navigation.navigate('VerifyPhone', {authToken});
    } else {
      setError(strings.signUp.codeSendFailed);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={localStyles.messageContainer}>
          <Text size="l" center={true}>
            {strings.signUp.signUpSuccess}
          </Text>
        </View>
      </SafeAreaView>

      <View style={localStyles.promptContainer}>
        <Text size="l" weight="l" center={true}>
          {strings.signUp.phonePrompt}
        </Text>
      </View>

      <View style={localStyles.inputContainer}>
        <Text weight="l">{strings.signUp.phoneNumber}: </Text>
        <PhoneInput
          style={localStyles.input}
          placeholder={strings.signUp.phoneNumber}
          value={phoneNumber}
          onChange={setPhoneNumber}
        />
      </View>
      {error.length !== 0 ? (
        <Text weight="l" center={true} color={colors.red}>
          {error}
        </Text>
      ) : null}
      <TouchableOpacity
        style={[
          localStyles.button,
          {
            backgroundColor: phoneNumber ? colors.accent : colors.darkgrey,
          },
        ]}
        disabled={!phoneNumber}
        onPress={() => handleSendCode()}>
        <Text weight="b" color={colors.white}>
          {strings.signUp.sendCode}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  messageContainer: {
    margin: s(20),
  },
  promptContainer: {
    margin: s(40),
    paddingHorizontal: s(20),
  },
  prompt: {
    width: s(100),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: s(30),
    marginHorizontal: s(50),
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: colors.darkgrey,
    marginHorizontal: s(5),
    paddingHorizontal: s(10),
    paddingVertical: s(5),
    fontFamily: 'Lato',
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: s(30),
    width: s(150),
    height: s(50),
    borderRadius: s(25),
  },
});

export default SignUpPhone;
