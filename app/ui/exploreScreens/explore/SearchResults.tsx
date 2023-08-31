import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Keyboard,
  Image,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';

import {
  Coordinate,
  ExploreModes,
  GoogleAutocompleteResult,
  Category,
} from '../../../utils/types';

interface Props {
  navigation: any;
  loading: boolean;
  searchResults: (Category | GoogleAutocompleteResult)[];
  myLocation?: Coordinate;
  mode: ExploreModes;
}

const SearchResults: React.FC<Props> = ({
  navigation,
  loading,
  searchResults,
  myLocation,
  mode,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  return loading ? (
    <View style={[STYLES.center, STYLES.container]}>
      <ActivityIndicator size="small" color={colors[theme].accent} />
    </View>
  ) : (
    <FlatList
      data={searchResults}
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      initialNumToRender={10}
      onScrollBeginDrag={() => Keyboard.dismiss()}
      keyboardShouldPersistTaps={'always'}
      scrollIndicatorInsets={{right: 1}}
      renderItem={({item}: {item: Category | GoogleAutocompleteResult}) => {
        if ('id' in item) {
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                navigation.navigate('SearchCategory', {
                  category: item,
                  myLocation: myLocation,
                  mode: mode,
                })
              }>
              <Image
                source={{uri: item.icon.url}}
                style={styles.icon}
                tintColor={colors[theme].neutral}
              />
              <View style={styles.text}>
                <Text size="s">{item.name}</Text>
              </View>
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                navigation.navigate('Poi', {
                  place_id: item.place_id,
                  mode: mode,
                })
              }>
              <Image source={icons.pin} style={styles.icon} />
              <View style={styles.texts}>
                <Text size="s">{item.structured_formatting.main_text}</Text>
                {item.structured_formatting.secondary_text ? (
                  <Text size="xs" weight="l">
                    {item.structured_formatting.secondary_text}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        }
      }}
      ListEmptyComponent={
        <View style={STYLES.center}>
          <Text weight="l">{strings.error.noResultsFound}</Text>
        </View>
      }
      keyExtractor={(_, index) => index.toString()}
    />
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: s(20),
      paddingHorizontal: s(10),
      paddingVertical: s(10),
      minHeight: s(55),
      borderBottomWidth: 1,
      borderBottomColor: colors[theme].secondary,
    },
    texts: {
      marginLeft: s(10),
      minHeight: s(35),
      justifyContent: 'space-evenly',
    },
    text: {
      marginLeft: s(10),
    },
    icon: {
      width: s(25),
      height: s(25),
    },
  });

export default SearchResults;
