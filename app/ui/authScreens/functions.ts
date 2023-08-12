import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import strings from '../../constants/strings';

import {
  isVerified,
  login,
  resetPassword,
  saveTokenToDatabase,
  sendCodeForgotPwd,
  verifyCodeUsername,
} from '../../utils/api/authAPI';
import {
  cacheCategories,
  cacheUserInfo,
  clearCaches,
} from '../../utils/CacheHelpers';

export const handleLogin = async (
  navigation: any,
  username: string,
  password: string,
  setError: (error: string) => void,
  initializeContext: () => Promise<void>,
) => {
  // Perform login logic, e.g. send login request to API

  setError('');

  // display an error if one of the fields are missing
  if (username.length === 0 || password.length === 0) {
    setError(strings.login.missingInfo);
    return;
  }

  const response = await login(username, password);

  if (response?.authToken) {
    // check if verified
    const verifiedResponse = await isVerified(response.authToken);
    if (!verifiedResponse) {
      navigation.reset({
        index: 0,
        routes: [
          {name: 'SignUpPhone', params: {authToken: response.authToken}},
        ],
      });

      return;
    }
    const cacheSuccess = await cacheUserInfo(response?.authToken);
    if (!cacheSuccess) {
      Alert.alert('Something went wrong. Please try again.');
      return;
    }

    await cacheCategories();

    await initializeContext();

    // save to firebase
    const fcm_token = await messaging().getToken();
    await saveTokenToDatabase(fcm_token);

    navigation.reset({
      index: 0,
      routes: [{name: 'TabStack'}],
    });
  } else {
    setError(response?.message);
  }
};

export const handleSendCodeOnPasswordReset = async (
  navigation: any,
  username: string,
) => {
  const response = await sendCodeForgotPwd(username);

  if (response) {
    navigation.navigate('ForgotPasswordVerify', {username});
  } else {
    // made the error ambiguous so the user can't guess if the username exists or not
    Alert.alert(strings.error.error, strings.error.ambiguousError);
  }
};

export const handleVerifyCode = async (
  navigation: any,
  username: string,
  code: string,
  setError: (error: string) => void,
) => {
  setError('');

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

export const handleResetPassword = async (
  navigation: any,
  authToken: string,
  password: string,
  passwordConfirm: string,
  setError: (error: string) => void,
) => {
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
  }
};
