import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {verifyCodeUsername} from '../../utils/api/authAPI';
import {useLoadingState} from '../../utils/Misc';

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
  const theme = 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [username] = useState<string>(route.params.username);

  const [code, setCode] = useState<string>('');

  const [error, setError] = useState<string>('');

  const [loading, withLoading] = useLoadingState();

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
            color={colors[theme].neutral}
          />
        </View>
      </SafeAreaView>

      <View style={STYLES.promptContainer}>
        <Text size="l" weight="l" center={true} color={colors[theme].neutral}>
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
          placeholderTextColor={colors[theme].neutral}
          keyboardType="number-pad"
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
            backgroundColor:
              code.length !== 6
                ? colors[theme].secondary
                : colors[theme].accent,
          },
        ]}
        disabled={code.length !== 6 || loading}
        onPress={() => withLoading(handleVerifyCode)}>
        {loading ? (
          <ActivityIndicator size="small" color={colors[theme].primary} />
        ) : (
          <Text weight="b" color={colors[theme].primary}>
            {strings.signUp.verifyCode}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPwdVerify;
