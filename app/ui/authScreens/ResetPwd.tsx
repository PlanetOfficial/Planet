import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLES from '../../constants/styles';

import Icon from '../components/Icon';
import Text from '../components/Text';

import {resetPassword} from '../../utils/api/authAPI';
import {clearCaches} from '../../utils/CacheHelpers';

const ResetPwd = ({
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

  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleNext = async () => {
    setError('');

    if (password.length === 0 || passwordConfirm.length === 0) {
      setError(strings.signUp.missingFields);
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

    const response = await resetPassword(authToken, password);

    if (response) {
      clearCaches();

      Alert.alert(strings.login.passwordResetSuccess);

      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } else {
      setError(strings.error.resetPassword);
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
      <View style={STYLES.inputContainer}>
        <View style={STYLES.prompt}>
          <Text weight="l">{strings.login.newPassword}: </Text>
        </View>
        <TextInput
          style={STYLES.input}
          placeholder={strings.login.password}
          value={password}
          onChangeText={text => setPassword(text)}
          placeholderTextColor={colors.neutral}
          secureTextEntry={true}
        />
      </View>
      <View style={STYLES.inputContainer}>
        <View style={STYLES.prompt}>
          <Text weight="l">{strings.signUp.confirmPassword}: </Text>
        </View>
        <TextInput
          style={STYLES.input}
          placeholder={strings.signUp.confirmPassword}
          value={passwordConfirm}
          onChangeText={text => setPasswordConfirm(text)}
          placeholderTextColor={colors.neutral}
          secureTextEntry={true}
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
            backgroundColor:
              password.length === 0 || password !== passwordConfirm
                ? colors.secondary
                : colors.accent,
          },
        ]}
        disabled={password.length === 0 || password !== passwordConfirm}
        onPress={() => handleNext()}>
        <Text color={colors.primary}>{strings.login.resetPassword}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPwd;
