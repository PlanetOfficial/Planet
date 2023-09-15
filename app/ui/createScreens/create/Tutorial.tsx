import React, {useState} from 'react';
import {
  View,
  useColorScheme,
  Modal,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Image,
  TouchableOpacity,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../../constants/colors';
import {create} from '../../../constants/images';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';

const Tutorial = () => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  const styles = styling(theme);

  const [index, setIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <Modal visible={visible} transparent={true} animationType={'fade'}>
      <View style={[STYLES.dim, STYLES.absolute]} />
      <SafeAreaView>
        <View style={[styles.container, STYLES.shadow]}>
          <Text size="l">{strings.create.tutorial}</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            scrollEventThrottle={16}
            snapToInterval={s(300)}
            snapToAlignment={'start'}
            decelerationRate={'fast'}
            onScroll={event => {
              let idx = Math.round(event.nativeEvent.contentOffset.x / s(300));
              if (idx !== index) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                setIndex(idx);
              }
            }}>
            <View style={styles.page}>
              <Text size="s">{strings.create.step1}</Text>
              <View style={styles.image}>
                <Image source={create.text} style={styles.img} />
              </View>
            </View>
            <View style={styles.page}>
              <Text size="s">{strings.create.step2}</Text>
              <View style={styles.image}>
                <Image source={create.date} style={styles.img} />
              </View>
            </View>
            <View style={styles.page}>
              <Text size="s">{strings.create.step3}</Text>
              <View style={styles.image}>
                <Image source={create.suggestions} style={styles.img} />
              </View>
            </View>
            <View style={styles.page}>
              <Text size="s">{strings.create.step4}</Text>
              <View style={styles.image}>
                <Image source={create.destination} style={styles.img} />
              </View>
            </View>
            <View style={styles.page}>
              <Text size="s">{strings.create.step5}</Text>
              <View style={styles.image}>
                <Image source={create.friends} style={styles.img} />
              </View>
            </View>
          </ScrollView>
          {index === 4 ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setVisible(false);
                AsyncStorage.setItem('create_tutorial', JSON.stringify(true));
              }}>
              <Text color={colors[theme].primary}>{strings.create.create}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.scrollIndicator}>
              {Array.from(Array(5), (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.circle,
                    {
                      width: i === index ? s(20) : s(8),
                      backgroundColor:
                        i === index
                          ? colors[theme].accent
                          : colors[theme].secondary,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: colors[theme].background,
      width: s(300),
      height: vs(540),
      marginTop: vs(40),
      paddingTop: vs(20),
      borderRadius: s(5),
    },
    page: {
      width: s(300),
      height: vs(540),
      alignItems: 'center',
      marginVertical: vs(20),
    },
    image: {
      width: s(280),
      height: vs(375),
      marginVertical: vs(20),
    },
    img: {
      resizeMode: 'contain',
      width: '100%',
      height: '100%',
    },
    scrollIndicator: {
      alignSelf: 'center',
      flexDirection: 'row',
      marginVertical: vs(25),
    },
    circle: {
      height: s(8),
      marginHorizontal: s(3),
      borderRadius: s(5),
    },
    button: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      width: s(100),
      height: s(35),
      marginBottom: vs(13),
      borderRadius: s(5),
      backgroundColor: colors[theme].accent,
    },
  });

export default Tutorial;
