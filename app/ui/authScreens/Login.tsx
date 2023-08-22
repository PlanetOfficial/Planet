import React, {useState} from 'react';
import {
  ActivityIndicator,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Keyboard,
  Image,
  SafeAreaView,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';

import icons from '../../constants/icons';
import colors from '../../constants/colors';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Text from '../components/Text';

import {useLoadingState} from '../../utils/Misc';

import {useFriendsContext} from '../../context/FriendsContext';
import {useBookmarkContext} from '../../context/BookmarkContext';
import {useLocationContext} from '../../context/LocationContext';

import {handleLogin} from './functions';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const theme = 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [error, setError] = useState<string>('');
  const [loading, withLoading] = useLoadingState();
  const disabled = username === '' || password === '' || loading;

  const {initializeBookmarks} = useBookmarkContext();
  const {initializeFriendsInfo} = useFriendsContext();
  const {initializeLocation} = useLocationContext();

  const initializeContext = async () => {
    await initializeBookmarks();
    await initializeFriendsInfo();
    await initializeLocation();
  };

  return (
    <View style={styles.container} onTouchStart={Keyboard.dismiss}>
      <LinearGradient
        colors={[colors[theme].accent, colors[theme].primary]}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        locations={[0, 0.2]}>
        <SafeAreaView>
          <Image source={icons.logo} style={styles.logo} />
        </SafeAreaView>
        <View style={styles.greeting}>
          <Text>{strings.login.greeting}</Text>
        </View>
        <View style={styles.description}>
          <Text weight="l">{strings.login.description}</Text>
        </View>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder={strings.login.username}
          placeholderTextColor={colors[theme].secondary}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder={strings.login.password}
          placeholderTextColor={colors[theme].secondary}
          textContentType="password"
          secureTextEntry={true}
        />
        <View>
          {error.length !== 0 ? (
            <View style={STYLES.error}>
              <Text size="s" weight="l" color={colors[theme].red}>
                {error}
              </Text>
            </View>
          ) : null}
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: disabled
                ? colors[theme].secondary
                : colors[theme].accent,
            },
          ]}
          onPress={() =>
            withLoading(() =>
              handleLogin(
                navigation,
                username,
                password,
                setError,
                initializeContext,
              ),
            )
          }
          disabled={disabled}>
          {loading ? (
            <ActivityIndicator size="small" color={colors[theme].primary} />
          ) : (
            <Text weight="b" color={colors[theme].primary}>
              {strings.login.login}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text size="s" weight="l" color={colors[theme].neutral}>
            {strings.login.forgotPasswordQuestion}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.noAccount}
          onPress={() => navigation.navigate('SignUpName')}>
          <Text size="s" weight="l" color={colors[theme].neutral}>
            {strings.login.noAccount + '  '}
          </Text>
          <Text size="s" weight="b" color={colors[theme].accent}>
            {strings.signUp.signUp}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
    },
    logo: {
      marginTop: vs(10),
      width: s(60),
      height: s(60),
    },
    greeting: {
      marginTop: vs(50),
      marginBottom: vs(10),
    },
    description: {
      marginBottom: vs(50),
    },
    input: {
      paddingHorizontal: s(25),
      marginBottom: vs(25),
      width: s(250),
      height: s(50),
      borderWidth: 1,
      borderRadius: s(25),
      borderColor: colors[theme].secondary,
      color: colors[theme].neutral,
      fontFamily: 'Lato',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: vs(40),
      width: s(250),
      height: s(50),
      borderRadius: s(25),
      backgroundColor: colors[theme].accent,
    },
    forgotPassword: {
      marginTop: vs(20),
    },
    noAccount: {
      flexDirection: 'row',
      marginTop: vs(40),
    },
  });

export default LoginScreen;
