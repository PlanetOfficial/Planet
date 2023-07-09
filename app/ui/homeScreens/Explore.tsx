import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
} from 'react-native';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import PoiRow from '../components/PoiRow';

import {Poi} from '../../utils/types';
import {handleBookmark} from '../../utils/Misc';

// TODO: INCOMPLETE
const Explore = ({navigation, route}: {navigation: any; route: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const {name, pois, location} = route.params;
  const [bookmarks, setBookmarks] = useState<Poi[]>([]);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text size="l">{name}</Text>
          <Icon
            size="m"
            icon={icons.question}
            onPress={() =>
              Alert.alert(
                'What is this page?',
                'Put the page description here.',
              )
            }
          />
        </View>
      </SafeAreaView>
      <FlatList
        data={pois}
        renderItem={({item}: {item: Poi}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Poi', {
                  poi: item,
                  bookmarked: true,
                  mode: 'none',
                })
              }>
              <PoiRow
                poi={item}
                bookmarked={true}
                location={location}
                handleBookmark={(poi: Poi) =>
                  handleBookmark(poi, bookmarks, setBookmarks)
                }
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={STYLES.center}>
            <Text>{strings.search.noResultsFound}</Text>
            <Text> </Text>
            <Text size="s">{strings.search.noResultsFoundDescription}</Text>
          </View>
        }
        keyExtractor={(item: Poi) => item.id.toString()}
      />
    </View>
  );
};

export default Explore;
