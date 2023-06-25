import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {s} from 'react-native-size-matters';

import Text from '../components/Text';

import colors from '../../constants/colors';
import styles from '../../constants/styles';
import strings from '../../constants/strings';

import {resetPassword} from '../../utils/api/authAPI';
import { clearCaches } from '../../utils/CacheHelpers';

/*
 * route params:
 * - authToken: string
 */
const ResetPwd = ({navigation, route}: {navigation: any; route: any}) => {
  const [authToken] = useState<string>(route.params.authToken);

  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleNext = async () => {
    setError('');

    if (
      password.length === 0 ||
      passwordConfirm.length === 0
    ) {
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
        routes: [
          {name: 'Login'},
        ],
      });
    } else {
      setError(strings.error.resetPassword);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={localStyles.inputContainer}>
        <View style={localStyles.prompt}>
          <Text weight="l">{strings.login.password}: </Text>
        </View>
        <TextInput
          style={localStyles.input}
          placeholder={strings.login.password}
          value={password}
          onChangeText={text => setPassword(text)}
          placeholderTextColor={colors.darkgrey}
          secureTextEntry={true}
        />
      </View>
      <View style={localStyles.inputContainer}>
        <View style={localStyles.prompt}>
          <Text weight="l">{strings.signUp.confirmPassword}: </Text>
        </View>
        <TextInput
          style={localStyles.input}
          placeholder={strings.signUp.confirmPassword}
          value={passwordConfirm}
          onChangeText={text => setPasswordConfirm(text)}
          placeholderTextColor={colors.darkgrey}
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
          localStyles.button,
          {
            backgroundColor:
              password.length === 0 ||
              password !== passwordConfirm
                ? colors.darkgrey
                : colors.accent,
          },
        ]}
        disabled={
          password.length === 0 ||
          password !== passwordConfirm
        }
        onPress={() => handleNext()}>
        <Text weight="b" color={colors.white}>
          {strings.login.resetPassword}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
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

export default ResetPwd;
