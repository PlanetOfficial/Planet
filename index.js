/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry, Text, TextInput, useColorScheme} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';

Text.defaultProps = {
  ...Text.defaultProps,
  maxFontSizeMultiplier: 1.2,
};

TextInput.defaultProps = {
  ...TextInput.defaultProps,
  maxFontSizeMultiplier: 1.2,
};

messaging().setBackgroundMessageHandler(async remoteMessage => {});

AppRegistry.registerComponent(appName, () => App);
