import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Text from '../components/Text';

import {sendCode} from '../../utils/api/authAPI';
import {useLoadingState} from '../../utils/Misc';

const SignUpPhone = ({
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
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [authToken] = useState<string>(route.params.authToken);

  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [error, setError] = useState<string>('');

  const [loading, withLoading] = useLoadingState();

  const handleSendCode = async () => {
    setError('');

    if (phoneNumber === '' || phoneNumber.length === 0) {
      setError(strings.signUp.missingFields);
      return;
    }

    const response = await sendCode(authToken, phoneNumber);

    if (response) {
      navigation.navigate('SignUpVerify', {authToken});
    } else {
      setError(strings.signUp.codeSendFailed);
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
              <Text size="l" center={true} color={colors[theme].neutral}>
                {strings.signUp.accountHasBeenCreated}
              </Text>
            </View>
            <Text weight="l" center={true} color={colors[theme].neutral}>
              {strings.signUp.promptPhoneNumber}
            </Text>
            <View style={STYLES.inputContainer}>
              <PhoneInput
                autoFocus={true}
                textContainerStyle={STYLES.input}
                value={phoneNumber}
                onChangeFormattedText={setPhoneNumber}
                defaultCode="US"
              />
            </View>
            {error.length > 0 && (
              <View>
                <View style={STYLES.error}>
                  <Text weight="l" size="s" color={colors[theme].red}>
                    {error}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
          <SafeAreaView>
            <TouchableOpacity
              style={[
                STYLES.buttonBig,
                {
                  backgroundColor: phoneNumber
                    ? colors[theme].accent
                    : colors[theme].secondary,
                },
              ]}
              disabled={!phoneNumber || loading}
              onPress={() => withLoading(handleSendCode)}>
              {loading ? (
                <ActivityIndicator size="small" color={colors[theme].primary} />
              ) : (
                <Text weight="b" color={colors[theme].primary}>
                  {strings.signUp.sendCode}
                </Text>
              )}
            </TouchableOpacity>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default SignUpPhone;
