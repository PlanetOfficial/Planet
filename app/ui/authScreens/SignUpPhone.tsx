import React, {useState} from 'react';
import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import PhoneInput from 'react-phone-number-input/react-native-input';

import {E164Number} from 'libphonenumber-js/types';

import Text from '../components/Text';
import colors from '../../constants/colors';
import strings from '../../constants/strings';
import STYLES from '../../constants/styles';

import {sendCode} from '../../utils/api/authAPI';

const SignUpPhone = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      authToken: string;
    };
  };
}) => {
  const [authToken] = useState<string>(route.params.authToken);

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
      navigation.navigate('SignUpVerify', {authToken});
    } else {
      setError(strings.signUp.codeSendFailed);
    }
  };

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.promptContainer}>
          <Text size="l" center={true}>
            {strings.signUp.signUpSuccess}
          </Text>
        </View>
      </SafeAreaView>

      <View style={STYLES.promptContainer}>
        <Text size="l" weight="l" center={true}>
          {strings.signUp.phonePrompt}
        </Text>
      </View>

      <View style={STYLES.inputContainer}>
        <Text weight="l">{strings.signUp.phoneNumber}: </Text>
        <PhoneInput
          style={STYLES.input}
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
          STYLES.buttonBig,
          {
            backgroundColor: phoneNumber ? colors.primary : colors.black,
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

export default SignUpPhone;
