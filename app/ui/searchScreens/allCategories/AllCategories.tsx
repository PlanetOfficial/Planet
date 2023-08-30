import React from 'react';
import {
  View,
  useColorScheme,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {Coordinate, Genre, ExploreModes} from '../../../utils/types';

import GenreContainer from './GenreContainer';

const AllCategories = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      location: Coordinate;
      mode: ExploreModes;
      genres: Genre[];
    };
  };
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const {location, mode, genres} = route.params;

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text>{strings.explore.allCategories}</Text>
          <Icon size="m" icon={icons.back} color="transparent" />
        </View>
      </SafeAreaView>
      <ScrollView scrollIndicatorInsets={{right: 1}}>
        {genres.map(genre => (
          <GenreContainer
            navigation={navigation}
            location={location}
            mode={mode}
            genre={genre}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default AllCategories;
