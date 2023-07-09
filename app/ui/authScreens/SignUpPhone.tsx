import React, {useState} from 'react';
import {View, SafeAreaView, TouchableOpacity, StatusBar} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

import colors from '../../constants/colors';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Text from '../components/Text';

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
  const theme = 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [authToken] = useState<string>(route.params.authToken);

  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleSendCode = async () => {
    setError('');

    if (phoneNumber === '' || phoneNumber.length === 0) {
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
          <Text size="l" center={true} color={colors[theme].neutral}>
            {strings.signUp.signUpSuccess}
          </Text>
        </View>
      </SafeAreaView>

      <View style={STYLES.promptContainer}>
        <Text size="l" weight="l" center={true} color={colors[theme].neutral}>
          {strings.signUp.phonePrompt}
        </Text>
      </View>

      <View style={STYLES.inputContainer}>
        <PhoneInput
          containerStyle={STYLES.input}
          placeholder={strings.signUp.phoneNumber}
          value={phoneNumber}
          onChangeFormattedText={setPhoneNumber}
          defaultCode='US'
        />
      </View>
      {error.length !== 0 ? (
        <Text weight="l" center={true} color={colors[theme].red}>
          {error}
        </Text>
      ) : null}
      <TouchableOpacity
        style={[
          STYLES.buttonBig,
          {
            backgroundColor: phoneNumber
              ? colors[theme].accent
              : colors[theme].neutral,
          },
        ]}
        disabled={!phoneNumber}
        onPress={() => handleSendCode()}>
        <Text weight="b" color={colors[theme].primary}>
          {strings.signUp.sendCode}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpPhone;
