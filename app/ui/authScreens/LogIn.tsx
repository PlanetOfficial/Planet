import React, {useContext, useState} from 'react';
import {
  ActivityIndicator,
  View,
  Text as RNText,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import messaging from '@react-native-firebase/messaging';

import strings from '../../constants/strings';
import colors from '../../constants/colors';
import STYLING from '../../constants/styles';

import Text from '../components/Text';

import {isVerified, login, saveTokenToDatabase} from '../../utils/api/authAPI';
import {cacheUserInfo} from '../../utils/CacheHelpers';
import {getFriendsInfo} from '../../utils/api/friendsAPI';
import BookmarkContext from '../../context/BookmarkContext';
import FriendsContext from '../../context/FriendsContext';
import {getBookmarks} from '../../utils/api/bookmarkAPI';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const theme = 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }
  const {setBookmarks} = bookmarkContext;

  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {
    setRequests,
    setRequestsSent,
    setFriends,
    setSuggestions,
    setFriendGroups,
    setUsersIBlock,
    setUsersBlockingMe,
  } = friendsContext;

  const initializeContext = async () => {
    const _bookmarks = await getBookmarks();
    if (_bookmarks) {
      setBookmarks(_bookmarks);
    } else {
      Alert.alert(strings.error.error, strings.error.loadBookmarks);
    }

    const result = await getFriendsInfo();
    if (result) {
      setSuggestions(result.suggestions);
      setFriends(result.friends);
      setRequests(result.requests);
      setRequestsSent(result.requests_sent);
      setFriendGroups(result.friend_groups);
      setUsersIBlock(result.usersIBlock);
      setUsersBlockingMe(result.usersBlockingMe);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsList);
    }
  };

  const handleLogin = async () => {
    // Perform login logic, e.g. send login request to API

    setError('');

    // display an error if one of the fields are missing
    if (username.length === 0 || password.length === 0) {
      setError(strings.login.missingInfo);
      return;
    }

    setLoading(true);
    const response = await login(username, password);
    setLoading(false);

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

      initializeContext();

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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ff8c63', '#e9dc96']}
        style={styles.container}
        start={{x: 2, y: 0}}
        end={{x: -0.5, y: 0.7}}
        locations={[0.3, 1]}>
        <RNText style={styles.title}>{strings.main.appName}</RNText>
        <TextInput
          style={[styles.input, STYLES.shadow]}
          placeholder={strings.login.username}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={colors[theme].neutral}
        />
        <TextInput
          style={[styles.input, STYLES.shadow]}
          placeholder={strings.login.password}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          textContentType="password"
          placeholderTextColor={colors[theme].neutral}
        />
        <View>
          {error.length !== 0 ? (
            <Text size="s" color={colors[theme].red}>
              {error}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator size="small" color={colors[theme].primary} />
          ) : (
            <Text weight="b" color={colors[theme].primary}>
              {strings.login.login}
            </Text>
          )}
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate('SignUpName')}>
            <Text weight="b" color={colors[theme].primary}>
              {strings.login.signUp}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text size="s" weight="l" color={colors[theme].neutral}>
            {strings.login.forgotPassword}
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
    title: {
      marginTop: vs(110),
      marginBottom: vs(70),
      fontSize: s(60),
      fontWeight: '900',
      fontFamily: 'Prompt',
      color: colors[theme].primary,
      letterSpacing: 2,
    },
    input: {
      paddingHorizontal: s(25),
      marginBottom: vs(30),
      width: s(250),
      height: s(50),
      borderRadius: s(25),
      backgroundColor: colors[theme].primary,
      color: colors[theme].neutral,
      fontFamily: 'Lato',
    },
    button: {
      marginTop: vs(10),
      width: s(150),
      height: s(50),
      borderRadius: s(25),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors[theme].accent,
    },
    bottomContainer: {
      alignItems: 'center',
      marginTop: vs(20),
    },
    signUpButton: {
      marginBottom: vs(10),
      width: s(150),
      height: s(50),
      borderRadius: s(25),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors[theme].neutral,
    },
  });

export default LoginScreen;
