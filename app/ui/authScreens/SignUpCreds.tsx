import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Icon from '../components/Icon';
import Text from '../components/Text';

import {signup} from '../../utils/api/authAPI';

const SignUpCreds = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      firstName: string;
      lastName: string;
    };
  };
}) => {
  const theme = 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [firstName] = useState<string>(route.params.firstName);
  const [lastName] = useState<string>(route.params.lastName);

  const [username, setUsername] = useState<string>(
    firstName.toLowerCase() + lastName.toLowerCase(),
  );
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
          {name: 'SignUpPhone', params: {authToken: response.authToken}},
        ],
      });
    } else {
      setError(response?.message);
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
          {strings.signUp.credPrompt}
        </Text>
      </View>

      <View style={STYLES.inputContainer}>
        <View style={STYLES.prompt}>
          <Text weight="l" color={colors[theme].neutral}>
            {strings.signUp.username}:{' '}
          </Text>
        </View>
        <TextInput
          style={STYLES.input}
          placeholder={strings.signUp.username}
          value={username}
          onChangeText={text => setUsername(text.toLowerCase())}
          placeholderTextColor={colors[theme].neutral}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={STYLES.inputContainer}>
        <View style={STYLES.prompt}>
          <Text weight="l" color={colors[theme].neutral}>
            {strings.login.password}:{' '}
          </Text>
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
          <Text weight="l" color={colors[theme].neutral}>
            {strings.signUp.confirmPassword}:{' '}
          </Text>
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
              username.length === 0 ||
              password.length === 0 ||
              password !== passwordConfirm
                ? colors[theme].secondary
                : colors[theme].accent,
          },
        ]}
        disabled={
          username.length === 0 ||
          password.length === 0 ||
          password !== passwordConfirm
        }
        onPress={() => handleNext()}>
        <Text weight="b" color={colors[theme].primary}>
          {strings.signUp.signUp}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpCreds;
