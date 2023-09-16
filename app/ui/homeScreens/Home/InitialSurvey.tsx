import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {RecommenderSurveyQuestion} from '../../../utils/types';

interface Props {
  initialSurvey: RecommenderSurveyQuestion[];
}

const InitialSurvey: React.FC<Props> = ({initialSurvey}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const [surveyShown, setSurveyShown] = useState<boolean>(false);

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
          onPress={() => setSurveyShown(true)}>
          <View style={STYLES.icon}>
            <Icon size="m" icon={icons.edit} color={colors[theme].primary} />
          </View>
          <Text color={colors[theme].primary}>{strings.home.answerSurvey}</Text>
        </TouchableOpacity>
      </View>
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
  });

export default InitialSurvey;
