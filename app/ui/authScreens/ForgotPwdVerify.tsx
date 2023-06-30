import React, {useState} from 'react';
import {View, SafeAreaView, TouchableOpacity, TextInput} from 'react-native';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLES from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {verifyCodeUsername} from '../../utils/api/authAPI';

const ForgotPwdVerify = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      username: string;
    };
  };
}) => {
  const [username] = useState<string>(route.params.username);

  const [code, setCode] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleVerifyCode = async () => {
    setError('');

    if (code.length === 0) {
      setError(strings.signUp.missingFields);
      return;
    }

    const response = await verifyCodeUsername(username, code);

    if (response) {
      navigation.reset({
        index: 0,
        routes: [
          {name: 'ResetPassword', params: {authToken: response.authToken}},
        ],
      });
    } else {
      setError(strings.signUp.codeVerifyFailed);
    }
  };

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>

      <View style={STYLES.promptContainer}>
        <Text size="l" weight="l" center={true}>
          {strings.signUp.verifyPrompt}
        </Text>
      </View>

      <View style={STYLES.inputContainer}>
        <TextInput
          style={STYLES.input}
          value={code}
          onChangeText={text =>
            setCode(text.replace(/[^0-9]/g, '').substring(0, 6))
          }
          placeholderTextColor={colors.black}
          keyboardType="number-pad"
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
            backgroundColor: code.length !== 6 ? colors.grey : colors.primary,
          },
        ]}
        disabled={code.length !== 6}
        onPress={() => handleVerifyCode()}>
        <Text weight="b" color={colors.white}>
          {strings.signUp.verifyCode}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPwdVerify;
