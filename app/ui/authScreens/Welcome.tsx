import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';

import icons from '../../constants/icons';
import colors from '../../constants/colors';
import {onboarding} from '../../constants/images';
import strings from '../../constants/strings';

import Text from '../components/Text';
import ScrollIndicator from '../components/ScrollIndicator';

const Welcome = ({navigation}: {navigation: any}) => {
  const theme = 'light';
  const styles = styling(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [index, setIndex] = useState<number>(0);

  const steps = [
    {
      title: strings.login.title1,
      description: strings.login.description1,
      image: onboarding.one,
    },
    {
      title: strings.login.title2,
      description: strings.login.description2,
      image: onboarding.two,
    },
    {
      title: strings.login.title3,
      description: strings.login.description3,
      image: onboarding.three,
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors[theme].accent, colors[theme].primary]}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        locations={[0, 1]}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          scrollEventThrottle={16}
          snapToInterval={s(350)}
          snapToAlignment={'start'}
          decelerationRate={'fast'}
          onScroll={event => {
            let idx = Math.round(event.nativeEvent.contentOffset.x / s(350));
            if (idx !== index) {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              setIndex(idx);
            }
          }}>
          <View style={styles.page}>
            <View style={styles.welcome}>
              <Image source={icons.logo} style={styles.logo} />
              <View style={styles.title}>
                <Text size="xxl" weight="b" color={colors[theme].primary}>
                  {strings.login.welcome}
                </Text>
              </View>
              <Text weight="l" color={colors[theme].primary} center={true}>
                {strings.main.description}
              </Text>
            </View>
          </View>
          {steps.map((step, i) => (
            <View key={i} style={styles.page}>
              <View style={styles.title}>
                <Text size="xxl" weight="b" color={colors[theme].primary}>
                  {step.title}
                </Text>
              </View>
              <Text weight="l" color={colors[theme].primary} center={true}>
                {step.description}
              </Text>
              <View style={styles.image}>
                <Image source={onboarding.two} style={styles.img} />
              </View>
            </View>
          ))}
          <View style={styles.page}>
            <View style={styles.welcome}>
              <Image source={icons.logo} style={styles.logo} />
              <View style={styles.title}>
                <Text size="xxl" weight="b" color={colors[theme].primary}>
                  {strings.main.appName}
                </Text>
              </View>
              <Text
                size="l"
                weight="l"
                color={colors[theme].primary}
                center={true}>
                {strings.main.tagLine}
              </Text>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.signUp}
                onPress={() => navigation.navigate('SignUpName')}>
                <Text
                  size="l"
                  weight="b"
                  color={colors[theme].primary}
                  center={true}>
                  {strings.signUp.signUp}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logIn}
                onPress={() => navigation.navigate('Login')}>
                <Text size="l" color={colors[theme].accent} center={true}>
                  {strings.login.login}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      <SafeAreaView>
        <ScrollIndicator max={5} index={index} />
      </SafeAreaView>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      backgroundColor: colors[theme].background,
    },
    page: {
      alignItems: 'center',
      width: s(350),
      padding: s(50),
    },
    welcome: {
      flex: 1,
      alignItems: 'center',
      marginTop: vs(50),
    },
    title: {
      marginVertical: vs(10),
    },
    logo: {
      width: s(100),
      height: s(100),
    },
    buttons: {
      justifyContent: 'space-between',
      height: s(120),
    },
    signUp: {
      alignItems: 'center',
      justifyContent: 'center',
      width: s(250),
      height: s(50),
      borderRadius: s(10),
      backgroundColor: colors[theme].accent,
    },
    logIn: {
      alignItems: 'center',
      justifyContent: 'center',
      width: s(250),
      height: s(50),
      borderRadius: s(10),
      borderColor: colors[theme].accent,
      borderWidth: 2,
    },
    image: {
      width: s(300),
      height: vs(430),
      marginVertical: vs(20),
    },
    img: {
      resizeMode: 'contain',
      width: '100%',
      height: '100%',
    },
  });

export default Welcome;
