import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Text from '../components/Text';

import {useLoadingState} from '../../utils/Misc';
import {handleVerifyCode} from './functions';

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
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [username] = useState<string>(route.params.username);

  const [code, setCode] = useState<string>('');

  const [loading, withLoading] = useLoadingState();
  const [error, setError] = useState<string>('');
  const disabled = code.length !== 6 || loading;

  return (
    <KeyboardAvoidingView
      {...(Platform.OS === 'ios' ? {behavior: 'padding'} : {})}
      style={STYLES.container}
      onTouchStart={Keyboard.dismiss}>
      <SafeAreaView>
        <View style={STYLES.header} />
      </SafeAreaView>
      <ScrollView>
        <View style={STYLES.titleContainer}>
          <Text weight="l" center={true} color={colors[theme].neutral}>
            {strings.signUp.verifyPrompt}
          </Text>
        </View>

        <View style={STYLES.inputContainer}>
          <TextInput
            style={styles.input}
            maxFontSizeMultiplier={1}
            value={code}
            onChangeText={text =>
              setCode(text.replace(/[^0-9]/g, '').substring(0, 6))
            }
            placeholderTextColor={colors[theme].neutral}
            keyboardType="number-pad"
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
              handleVerifyCode(navigation, username, code, setError),
            )
          }>
          {loading ? (
            <ActivityIndicator size="small" color={colors[theme].primary} />
          ) : (
            <Text weight="b" color={colors[theme].primary}>
              {strings.signUp.verifyCode}
            </Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    input: {
      alignSelf: 'center',
      borderBottomWidth: 1,
      borderColor: colors[theme].neutral,
      marginHorizontal: s(5),
      paddingVertical: s(5),
      fontFamily: 'Lato',
      letterSpacing: s(10),
      fontSize: s(20),
      width: s(150),
      color: colors[theme].neutral,
      textAlign: 'center',
    },
  });

export default ForgotPwdVerify;
