import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  useColorScheme,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {TouchableOpacity} from 'react-native-gesture-handler';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {
  Category,
  Coordinate,
  CreateModes,
  Locality,
} from '../../../utils/types';

import {useLocationContext} from '../../../context/LocationContext';
import SearchBar from '../../components/SearchBar';

import {useLoadingState} from '../../../utils/Misc';
import {
  autocompleteLocality,
  autocompleteLocalityLatLng,
} from '../../../utils/api/poiAPI';

const SearchMap = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      mode: CreateModes;
      myLocation: Coordinate;
      category: Category;
    };
  };
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  const styles = styling(theme);

  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const {mode, myLocation, category} = route.params;
  const {setLocation} = useLocationContext();

  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Locality[]>([]);
  const [searching, setSearching] = useState<boolean>(false);

  const [loading, withLoading] = useLoadingState();

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            icon={icons.close}
            onPress={() =>
              navigation.navigate('SearchCategory', {
                category,
                myLocation,
                mode,
              })
            }
          />
          <Text>{strings.explore.setLocation}</Text>
          <Icon icon={icons.close} color="transparent" />
        </View>
      </SafeAreaView>

      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        searching={searching}
        setSearching={setSearching}
        setSearchResults={setSearchResults}
        search={text =>
          withLoading(async () => {
            setSearchText(text);
            if (text.length > 2) {
              const results = await autocompleteLocality(
                text,
                myLocation.latitude,
                myLocation.longitude,
              );

              if (results) {
                setSearchResults(results);
              } else {
                Alert.alert(strings.error.error, strings.error.searchLocailty);
              }
            } else {
              setSearchResults([]);
            }
          })
        }
        searchPrompt={strings.explore.searchLocation}
        autoFocus={true}
      />
      <ScrollView
        style={STYLES.container}
        contentContainerStyle={STYLES.flatList}
        scrollIndicatorInsets={{right: 1}}
        onScrollBeginDrag={() => Keyboard.dismiss()}>
        <TouchableOpacity
          style={styles.yourLocation}
          onPress={() => {
            setLocation(myLocation);
            navigation.navigate('SearchCategory', {
              category,
              myLocation,
              mode,
            });
          }}>
          <Text color={colors[theme].blue}>{strings.explore.yourLocation}</Text>
          <Icon
            size="m"
            icon={icons.locationFilled}
            color={colors[theme].blue}
          />
        </TouchableOpacity>

        {searching ? (
          loading ? (
            <View style={[STYLES.center, STYLES.container]}>
              <ActivityIndicator size="small" color={colors[theme].accent} />
            </View>
          ) : (
            searchResults.map((item: Locality) => (
              <TouchableOpacity
                key={item.place_id}
                style={styles.row}
                onPress={async () => {
                  const response = await autocompleteLocalityLatLng(
                    item.place_id,
                  );
                  if (response) {
                    setLocation({
                      latitude: response.lat,
                      longitude: response.lng,
                    });
                    navigation.navigate('SearchCategory', {
                      category,
                      myLocation,
                      mode,
                    });
                  } else {
                    Alert.alert(
                      strings.error.error,
                      strings.error.searchLocailty,
                    );
                  }
                }}>
                <View style={styles.texts}>
                  <Text size="s">{item.structured_formatting.main_text}</Text>
                  {item.structured_formatting.secondary_text ? (
                    <Text size="xs" weight="l">
                      {item.structured_formatting.secondary_text}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))
          )
        ) : null}
      </ScrollView>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    yourLocation: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: s(20),
      paddingHorizontal: s(10),
      paddingVertical: s(10),
      minHeight: s(55),
      borderRadius: s(5),
      borderWidth: 1,
      borderColor: colors[theme].blue,
    },
    row: {
      flexDirection: 'row',
      marginHorizontal: s(20),
      paddingHorizontal: s(10),
      paddingVertical: s(10),
      minHeight: s(55),
      borderBottomWidth: 1,
      borderBottomColor: colors[theme].secondary,
    },
    texts: {
      minHeight: s(35),
      justifyContent: 'space-evenly',
    },
  });

export default SearchMap;
