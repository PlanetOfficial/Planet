import React from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import PoiCardXS from '../../components/PoiCardXS';

import {Destination, Suggestion} from '../../../utils/types';

interface Props {
  navigation: any;
  destination: Destination;
  displayingSuggestion: boolean;
  setInsertionDestination: (insertionDestination: Destination) => void;
  suggestionRefs: React.MutableRefObject<Map<number, any>>;
  onSuggestionPress: (suggestion: Suggestion, destination: Destination) => void;
}

const Suggestions: React.FC<Props> = ({
  navigation,
  destination,
  displayingSuggestion,
  setInsertionDestination,
  suggestionRefs,
  onSuggestionPress,
}) => {
  return destination.suggestions.length > 1 ? (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {destination.suggestions.map((suggestion: Suggestion) =>
          !suggestion.is_primary ? (
            <TouchableOpacity
              key={suggestion.id}
              ref={r => suggestionRefs.current.set(suggestion.id, r)}
              style={styles.suggestion}
              disabled={displayingSuggestion}
              onPress={() => onSuggestionPress(suggestion, destination)}>
              <PoiCardXS poi={suggestion.poi} />
            </TouchableOpacity>
          ) : null,
        )}
      </ScrollView>
      <View style={styles.add}>
        <TouchableOpacity
          style={styles.add}
          disabled={displayingSuggestion}
          onPress={() => {
            setInsertionDestination(destination);
            navigation.navigate('SuggestSearch');
          }}>
          <Icon icon={icons.add} size="xl" color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <TouchableOpacity
      style={[styles.addBig, STYLES.shadow]}
      disabled={displayingSuggestion}
      onPress={() => {
        setInsertionDestination(destination);
        navigation.navigate('SuggestSearch');
      }}>
      <Text color={colors.primary} weight="b">
        {strings.event.addSuggestion}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: s(10),
  },
  scrollView: {
    overflow: 'visible',
  },
  suggestion: {
    marginRight: s(10),
  },
  add: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -s(20),
    paddingRight: s(20),
    width: s(95),
    height: s(85),
    backgroundColor: colors.white,
    borderLeftWidth: 1,
    borderLeftColor: colors.grey,
  },
  addBig: {
    alignItems: 'center',
    marginVertical: s(10),
    paddingVertical: s(10),
    borderRadius: s(10),
    backgroundColor: colors.white,
  },
});

export default Suggestions;
