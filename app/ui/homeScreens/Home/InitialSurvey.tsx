import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Modal,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {RecommenderSurvey} from '../../../utils/types';

interface Props {
  initialSurvey: RecommenderSurvey;
}

const InitialSurvey: React.FC<Props> = ({initialSurvey}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const [visible, setVisible] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  const [answers, setAnswers] = useState<Map<number, string>>(new Map());
  const [cuisines, setCuisines] = useState<number[]>([]);

  return (
    <>
      <View style={STYLES.header}>
        <Text size="s">{strings.home.recommendations}</Text>
      </View>
      <View style={[styles.prompt, STYLES.shadow]}>
        <Text size="s" weight="l" center={true}>
          {strings.home.surveyPrompt}
        </Text>
        <TouchableOpacity
          style={[STYLES.actionButton, STYLES.shadow]}
          onPress={() => setVisible(true)}>
          <View style={STYLES.icon}>
            <Icon size="m" icon={icons.edit} color={colors[theme].primary} />
          </View>
          <Text color={colors[theme].primary}>{strings.home.answerSurvey}</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={visible} transparent={true} animationType={'fade'}>
        <Pressable
          style={[STYLES.dim, STYLES.absolute]}
          onPress={() => setVisible(false)}
        />
        <SafeAreaView>
          <View style={[styles.container, STYLES.shadow]}>
            {index === initialSurvey.questions.length ? (
              <>
                <View style={styles.header}>
                  <Icon
                    size="m"
                    icon={icons.back}
                    disabled={index === 0}
                    color={index === 0 ? 'transparent' : undefined}
                    onPress={() => {
                      setIndex(index - 1);
                    }}
                  />
                </View>
                <View style={styles.content}>
                  <Text size="l" weight="l" center={true}>
                    {strings.home.cuisinePrompt}
                  </Text>
                  <View style={styles.grid}>
                    {initialSurvey.cuisines.map(cuisine => (
                      <TouchableOpacity
                        key={cuisine.id}
                        style={[
                          styles.cuisine,
                          {
                            backgroundColor: cuisines.includes(cuisine.id)
                              ? colors[theme].accent
                              : colors[theme].secondary,
                          },
                        ]}
                        onPress={() => {
                          if (cuisines.includes(cuisine.id)) {
                            setCuisines(
                              cuisines.filter(id => id !== cuisine.id),
                            );
                          } else {
                            setCuisines([...cuisines, cuisine.id]);
                          }
                        }}>
                        <Text
                          size="s"
                          weight="l"
                          color={
                            cuisines.includes(cuisine.id)
                              ? colors[theme].primary
                              : colors[theme].neutral
                          }>
                          {cuisine.name.replace('Restaurant', '').trim()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        backgroundColor:
                          cuisines.length > 2
                            ? colors[theme].accent
                            : colors[theme].secondary,
                      },
                    ]}>
                    <Text color={colors[theme].primary}>
                      {strings.home.done}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.header}>
                  <Icon
                    size="m"
                    icon={icons.back}
                    disabled={index === 0}
                    color={index === 0 ? 'transparent' : undefined}
                    onPress={() => {
                      setIndex(index - 1);
                    }}
                  />
                  <Text>
                    {index + 1}/{initialSurvey.questions.length}
                  </Text>
                  <Icon icon={icons.back} color={'transparent'} />
                </View>
                <View style={styles.content}>
                  <Text size="l" weight="l" center={true}>
                    {initialSurvey.questions[index].prompt}
                  </Text>
                </View>
                <View style={styles.footer}>
                  <View style={styles.buttons}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        const _answers = new Map(answers);
                        _answers.set(index, 'yes');
                        setAnswers(_answers);
                        setIndex(index + 1);
                      }}>
                      <Text color={colors[theme].primary}>
                        {initialSurvey.questions[index].yes}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        const _answers = new Map(answers);
                        _answers.set(index, 'no');
                        setAnswers(_answers);
                        setIndex(index + 1);
                      }}>
                      <Text color={colors[theme].primary}>
                        {initialSurvey.questions[index].no}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.neutral}
                    onPress={() => {
                      const _answers = new Map(answers);
                      _answers.set(index, 'neutral');
                      setAnswers(_answers);
                      setIndex(index + 1);
                    }}>
                    <Text size="s" weight="l">
                      {initialSurvey.questions[index].neutral}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    prompt: {
      marginHorizontal: s(20),
      marginBottom: s(20),
      paddingTop: s(15),
      backgroundColor: colors[theme].primary,
    },
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: s(20),
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: s(20),
    },
    footer: {
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: s(10),
      marginBottom: s(20),
    },
    buttons: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: s(10),
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: s(100),
      height: vs(40),
      borderRadius: s(5),
      backgroundColor: colors[theme].accent,
    },
    neutral: {
      marginTop: s(15),
    },
    grid: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: s(15),
    },
    cuisine: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: s(5),
      padding: s(10),
      borderRadius: s(5),
      backgroundColor: colors[theme].secondary,
    },
  });

export default InitialSurvey;
