import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  LayoutAnimation,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import numbers from '../../../constants/numbers';

import Text from '../../components/Text';

import {Category, Coordinate, Genre, ExploreModes} from '../../../utils/types';

import Icon from '../../components/Icon';

interface Props {
  navigation: any;
  location: Coordinate;
  mode: ExploreModes;
  genre: Genre;
}

const GenreContainer: React.FC<Props> = ({
  navigation,
  location,
  mode,
  genre,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('TODO: Genre Search')}>
          <Text size="s">{genre.name}:</Text>
        </TouchableOpacity>
        <View
          style={{
            transform: [{rotate: expanded ? '0deg' : '180deg'}],
          }}>
          <Icon
            size="xs"
            icon={icons.drop}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setExpanded(!expanded);
            }}
          />
        </View>
      </View>
      {expanded
        ? genre.categories.map((category: Category) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                navigation.navigate('SearchCategory', {
                  category: category,
                  myLocation: location,
                  radius: numbers.defaultRadius,
                  mode: mode,
                })
              }>
              <Text size="s" weight="l">
                {category.name}
              </Text>
            </TouchableOpacity>
          ))
        : null}
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      marginVertical: s(5),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: s(20),
      marginTop: s(10),
      marginBottom: s(5),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: s(30),
      marginRight: s(20),
      paddingHorizontal: s(10),
      paddingVertical: s(8),
      borderBottomWidth: 0.5,
      borderColor: colors[theme].secondary,
    },
  });

export default GenreContainer;
