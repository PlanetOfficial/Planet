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
import {createWalkThrough} from '../../../constants/images';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import ScrollIndicator from '../../components/ScrollIndicator';

interface Props {
  showTutorial: boolean;
}

const Tutorial: React.FC<Props> = ({showTutorial}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  const styles = styling(theme);

  const [index, setIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(showTutorial);

  const steps = [
    {
      text: strings.createWalkthroughText.step1,
      image: createWalkThrough.text,
    },
    {
      text: strings.createWalkthroughText.step2,
      image: createWalkThrough.date,
    },
    {
      text: strings.createWalkthroughText.step3,
      image: createWalkThrough.suggestions,
    },
    {
      text: strings.createWalkthroughText.step4,
      image: createWalkThrough.destination,
    },
    {
      text: strings.createWalkthroughText.step5,
      image: createWalkThrough.friends,
    },
  ];

  return (
    <Modal visible={visible} transparent={true} animationType={'fade'}>
      <View style={[STYLES.dim, STYLES.absolute]} />
      <SafeAreaView>
        <View style={[styles.container, STYLES.shadow]}>
          <Text size="l">{strings.createWalkthroughText.tutorial}</Text>
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
            {steps.map((step, i) => (
              <View key={i} style={styles.page}>
                <Text size="s">{step.text}</Text>
                <View style={styles.image}>
                  <Image source={step.image} style={styles.img} />
                </View>
              </View>
            ))}
          </ScrollView>
          {index === steps.length - 1 ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setVisible(false);
                AsyncStorage.setItem(
                  'create_tutorial_completed',
                  JSON.stringify(true),
                );
              }}>
              <Text color={colors[theme].primary}>
                {strings.createWalkthroughText.create}
              </Text>
            </TouchableOpacity>
          ) : (
            <ScrollIndicator max={steps.length} index={index} />
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
