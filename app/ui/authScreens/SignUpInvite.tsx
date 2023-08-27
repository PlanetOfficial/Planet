import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import messaging from '@react-native-firebase/messaging';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Icon from '../components/Icon';
import Text from '../components/Text';

import {saveTokenToDatabase} from '../../utils/api/authAPI';
import {fetchUserLocation, shareApp, useLoadingState} from '../../utils/Misc';
import {cacheUserInfo} from '../../utils/CacheHelpers';

import {useLocationContext} from '../../context/LocationContext';

const SignUpInvite = ({
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

  const [authToken] = useState<string>(route.params?.authToken);

  const {setLocation} = useLocationContext();

  const insets = useSafeAreaInsets();

  const [loading, withLoading] = useLoadingState();

  const [shared, setShared] = useState<boolean>(false);

  const [skippable, setSkippable] = useState<boolean>(false);

  const handleContinue = async () => {
    const locationResult = await fetchUserLocation();
    if (locationResult) {
      setLocation(locationResult);
    }

    const cacheSuccess = await cacheUserInfo(authToken);

    if (!cacheSuccess) {
      Alert.alert('Something went wrong. Please try again.');
      return;
    }

    // save to firebase
    const fcm_token = await messaging().getToken();
    await saveTokenToDatabase(fcm_token);

    navigation.reset({
      index: 0,
      routes: [{name: 'TabStack'}],
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setTimeout(() => {
        setSkippable(true);
      }, 5000);
    });

    return unsubscribe;
  }, [navigation]);

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
          {skippable ? (
            <TouchableOpacity
              style={[styles.skip, {top: insets.top + vs(10) + s(20)}]}
              disabled={loading}
              onPress={() => withLoading(handleContinue)}>
              <Text size="s" weight="l" color={colors[theme].primary}>
                {strings.signUp.skip}
              </Text>
            </TouchableOpacity>
          ) : null}
        </SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={STYLES.titleContainer}>
            <Text size="l" center={true} color={colors[theme].neutral}>
              {strings.signUp.oneLastStep}
            </Text>
          </View>
          <Text size="s" weight="l" center={true} color={colors[theme].neutral}>
            {strings.signUp.invitePrompt}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => shareApp(setShared)}>
            <View style={styles.icon}>
              <Icon icon={icons.link} size="m" color={colors[theme].primary} />
            </View>
            <Text size="l" color={colors[theme].primary}>
              {strings.signUp.sendAnInviteLink}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <SafeAreaView>
          <TouchableOpacity
            style={[
              STYLES.buttonBig,
              {
                backgroundColor: shared
                  ? colors[theme].accent
                  : colors[theme].secondary,
              },
            ]}
            disabled={!shared || loading}
            onPress={() => withLoading(handleContinue)}>
            {loading ? (
              <ActivityIndicator size="small" color={colors[theme].primary} />
            ) : (
              <Text weight="b" color={colors[theme].primary}>
                {strings.main.continue}
              </Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
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
    skip: {
      position: 'absolute',
      left: s(150),
    },
    button: {
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: vs(30),
      padding: s(20),
      borderRadius: s(10),
      backgroundColor: colors[theme].accent,
    },
    icon: {
      marginRight: s(10),
    },
  });

export default SignUpInvite;
