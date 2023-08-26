import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import {s} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Text from '../components/Text';

import {verifyCode} from '../../utils/api/authAPI';
import {useLoadingState} from '../../utils/Misc';

const SignUpVerify = ({
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
  const theme = 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [authToken] = useState<string>(route.params.authToken);

  const [code, setCode] = useState<string>('');

  const [error, setError] = useState<string>('');

  const [loading, withLoading] = useLoadingState();

  const disabled = code.length !== 6;

  const handleVerifyCode = async () => {
    setError('');

    if (code.length === 0) {
      setError(strings.signUp.missingFields);
      return;
    }

    const response = await verifyCode(authToken, code);

    if (response) {
      navigation.navigate('SignUpInvite', {authToken: authToken});
    } else {
      setError(strings.signUp.codeVerifyFailed);
    }
  };

  return (
    <View style={STYLES.container} onTouchStart={Keyboard.dismiss}>
      <LinearGradient
        colors={[colors[theme].accent, colors[theme].primary]}
        style={STYLES.signUpContainer}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        locations={[0, 0.2]}>
        <KeyboardAvoidingView
          {...(Platform.OS === 'ios' ? {behavior: 'padding'} : {})}
          style={STYLES.signUpContainer}
          onTouchStart={Keyboard.dismiss}>
          <SafeAreaView>
            <Image source={icons.logo} style={STYLES.logo} />
          </SafeAreaView>
          <ScrollView showsVerticalScrollIndicator={false}>
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
                autoFocus={true}
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
                  <Text
                    size="s"
                    weight="l"
                    center={true}
                    color={colors[theme].red}>
                    {error}
                  </Text>
                </View>
              ) : null}
            </View>
          </ScrollView>
          <SafeAreaView>
            <TouchableOpacity
              style={styles.change}
              onPress={() => navigation.goBack()}>
              <Text size="s" weight="l">
                {strings.signUp.changeNumber}
              </Text>
            </TouchableOpacity>
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
              onPress={() => withLoading(handleVerifyCode)}>
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
      </LinearGradient>
    </View>
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
    change: {
      alignSelf: 'center',
    },
  });

export default SignUpVerify;
