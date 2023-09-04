import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Linking,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Image,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Icon from '../components/Icon';
import Text from '../components/Text';

import {signup} from '../../utils/api/authAPI';
import {useLoadingState} from '../../utils/Misc';

const SignUpCreds = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      displayName: string;
      birthday: string;
    };
  };
}) => {
  const theme = 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [error, setError] = useState<string>('');

  const [userAgreed, setUserAgreed] = useState<boolean>(false);

  const [loading, withLoading] = useLoadingState();

  const handleNext = async () => {
    setError('');

    if (username.length === 0 || password.length === 0) {
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

    const response = await signup(
      route.params.displayName,
      route.params.birthday,
      username,
      password,
    );

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

  const disabled =
    !userAgreed || username.length === 0 || password.length === 0;

  return (
    <View style={STYLES.container} onTouchStart={Keyboard.dismiss}>
      <LinearGradient
        colors={[colors[theme].accent, colors[theme].primary]}
        style={STYLES.signUpContainer}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        locations={[0, 0.2]}>
        <SafeAreaView>
          <Image source={icons.logo} style={STYLES.logo} />
        </SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={STYLES.titleContainer}>
            <Text center={true} color={colors[theme].neutral}>
              {strings.signUp.setUpPrompt}
            </Text>
          </View>
          <Text weight="l" size="s" center={true} color={colors[theme].neutral}>
            {strings.signUp.setUpDescription}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={STYLES.input}
              value={username}
              autoCapitalize={'none'}
              autoCorrect={false}
              autoFocus={true}
              onChangeText={text => setUsername(text.toLowerCase())}
              placeholder={strings.signUp.username}
              placeholderTextColor={colors[theme].secondary}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={STYLES.input}
              value={password}
              onChangeText={text => setPassword(text)}
              placeholder={strings.login.password}
              placeholderTextColor={colors[theme].secondary}
              secureTextEntry={true}
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
          <View style={styles.footer}>
            <TouchableOpacity style={styles.check}>
              <Icon
                size="m"
                icon={userAgreed ? icons.checked : icons.unchecked}
                onPress={() => setUserAgreed(!userAgreed)}
                color={colors[theme].accent}
              />
            </TouchableOpacity>
            <Text size="s" weight="l" color={colors[theme].neutral}>
              {strings.signUp.iAgreeTo + '  '}
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(strings.main.url + '/terms-and-conditions')
              }>
              <Text
                size="s"
                weight="l"
                underline={true}
                color={colors[theme].accent}>
                {strings.settings.termsAndConditions}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              STYLES.buttonBig,
              {
                backgroundColor: disabled
                  ? colors[theme].secondary
                  : colors[theme].accent,
              },
            ]}
            disabled={disabled || loading}
            onPress={() => withLoading(handleNext)}>
            {loading ? (
              <ActivityIndicator size="small" color={colors[theme].primary} />
            ) : (
              <Text weight="b" color={colors[theme].primary}>
                {strings.signUp.signUp}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: s(30),
    marginBottom: s(20),
    width: s(270),
  },
  footer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(50),
    height: s(30),
  },
  check: {
    marginRight: s(5),
  },
});

export default SignUpCreds;
