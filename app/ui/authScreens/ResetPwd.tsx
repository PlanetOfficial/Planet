import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  useColorScheme,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

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
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [authToken] = useState<string>(route.params.authToken);

  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  const [error, setError] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const handleNext = async () => {
    setLoading(true);
    setError('');

    if (password.length === 0 || passwordConfirm.length === 0) {
      setError(strings.signUp.missingFields);
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError(strings.signUp.passwordShort);
      setLoading(false);
      return;
    }

    if (password.length > 100) {
      setError(strings.signUp.inputLong);
      setLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      setError(strings.signUp.passwordsMatch);
      setLoading(false);
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
      setLoading(false);
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
          placeholderTextColor={colors[theme].neutral}
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
          placeholderTextColor={colors[theme].neutral}
          secureTextEntry={true}
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
              password.length === 0 || password !== passwordConfirm
                ? colors[theme].secondary
                : colors[theme].accent,
          },
        ]}
        disabled={
          password.length === 0 || password !== passwordConfirm || loading
        }
        onPress={() => handleNext()}>
        {loading ? (
          <ActivityIndicator size="small" color={colors[theme].primary} />
        ) : (
          <Text color={colors[theme].primary}>
            {strings.login.resetPassword}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ResetPwd;
