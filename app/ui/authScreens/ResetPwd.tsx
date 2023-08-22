import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Icon from '../components/Icon';
import Text from '../components/Text';

import {useLoadingState} from '../../utils/Misc';

import {handleResetPassword} from './functions';

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

  const [loading, withLoading] = useLoadingState();
  const [error, setError] = useState<string>('');
  const disabled =
    password.length === 0 || password !== passwordConfirm || loading;

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const getIsLoggedIn = async () => {
      const _authToken = await EncryptedStorage.getItem('auth_token');
      setIsLoggedIn(_authToken !== undefined);
    };
    getIsLoggedIn();
  }, []);

  return (
    <KeyboardAvoidingView
      {...(Platform.OS === 'ios' ? {behavior: 'padding'} : {})}
      style={STYLES.container}
      onTouchStart={Keyboard.dismiss}>
      <SafeAreaView>
        <View style={STYLES.header}>
          {isLoggedIn ? (
            <Icon size="m" icon={icons.back} onPress={navigation.goBack} />
          ) : (
            <Icon size="m" icon={icons.back} color="transparent" />
          )}
          <Text>{strings.login.resetPassword}</Text>
          <Icon size="m" icon={icons.back} color="transparent" />
        </View>
      </SafeAreaView>
      <ScrollView>
        <View style={STYLES.inputContainer}>
          <View style={STYLES.prompt}>
            <Text size="s" weight="l">
              {strings.login.newPassword}:{' '}
            </Text>
          </View>
          <TextInput
            style={STYLES.input}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
          />
        </View>
        <View style={STYLES.inputContainer}>
          <View style={STYLES.prompt}>
            <Text size="s" weight="l">
              {strings.signUp.confirmPassword}:{' '}
            </Text>
          </View>
          <TextInput
            style={STYLES.input}
            value={passwordConfirm}
            onChangeText={text => setPasswordConfirm(text)}
            secureTextEntry={true}
          />
        </View>
        <View>
          {error.length !== 0 ? (
            <View style={STYLES.error}>
              <Text size="s" weight="l" center={true} color={colors[theme].red}>
                {error}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <SafeAreaView>
        <TouchableOpacity
          style={[
            STYLES.buttonBig,
            {
              backgroundColor: disabled
                ? colors[theme].secondary
                : colors[theme].accent,
            },
          ]}
          disabled={disabled}
          onPress={() =>
            withLoading(() =>
              handleResetPassword(
                navigation,
                authToken,
                password,
                passwordConfirm,
                setError,
              ),
            )
          }>
          {loading ? (
            <ActivityIndicator size="small" color={colors[theme].primary} />
          ) : (
            <Text color={colors[theme].primary}>
              {strings.login.resetPassword}
            </Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ResetPwd;
