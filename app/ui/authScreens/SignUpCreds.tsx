import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {s} from 'react-native-size-matters';

import Icon from '../components/Icon';
import Text from '../components/Text';

import icons from '../../constants/icons';
import colors from '../../constants/colors';
import styles from '../../constants/styles';
import strings from '../../constants/strings';

import {signup} from '../../utils/api/authAPI';

/*
 * route params:
 * - firstName: string
 * - lastName: string
 */
const SignUpCreds = ({navigation, route}: {navigation: any; route: any}) => {
  const [firstName] = useState<string>(route.params.firstName);
  const [lastName] = useState<string>(route.params.lastName);

  const [username, setUsername] = useState<string>(firstName + lastName);
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleNext = async () => {
    setError('');

    if (
      username.length === 0 ||
      password.length === 0 ||
      passwordConfirm.length === 0
    ) {
      setError(strings.signUp.missingFields);
      return;
    }

    if (username.length > 100) {
      setError(strings.signUp.inputLong);
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

    const response = await signup(firstName, lastName, username, password);

    if (response?.authToken) {
      navigation.reset({
        index: 0,
        routes: [
          {name: 'SignUpPhone', params: {authToken: response?.authToken}},
        ],
      });
    } else {
      setError(response?.message);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>

      <View style={localStyles.promptContainer}>
        <Text size="l" weight="l" center={true}>
          {strings.signUp.credPrompt}
        </Text>
      </View>

      <View style={localStyles.inputContainer}>
        <View style={localStyles.prompt}>
          <Text weight="l">{strings.signUp.username}: </Text>
        </View>
        <TextInput
          style={localStyles.input}
          placeholder={strings.signUp.username}
          value={username}
          onChangeText={text => setUsername(text)}
          placeholderTextColor={colors.darkgrey}
        />
      </View>
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
      {error.length !== 0 ? <Text weight='l' center={true} color={colors.red}>{error}</Text> : null}
      <TouchableOpacity
        style={[
          localStyles.button,
          {
            backgroundColor:
              username.length === 0 ||
              password.length === 0 ||
              password !== passwordConfirm
                ? colors.darkgrey
                : colors.accent,
          },
        ]}
        disabled={
          username.length === 0 ||
          password.length === 0 ||
          password !== passwordConfirm
        }
        onPress={() => handleNext()}>
        <Text weight="b" color={colors.white}>
          {strings.main.next}
        </Text>
      </TouchableOpacity>
    </View>
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

export default SignUpCreds;
