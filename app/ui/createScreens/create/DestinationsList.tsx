import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Keyboard,
} from 'react-native';
import {s} from 'react-native-size-matters';
import prompt from 'react-native-prompt-android';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';

import Text from '../../components/Text';
import PoiCardXL from '../../components/PoiCardXL';
import OptionMenu from '../../components/OptionMenu';

import {Poi} from '../../../utils/types';
import {handleBookmark} from '../../../utils/Misc';

import {handleMove} from './functions';
import AddSeparator from './AddSeparator';

interface Props {
  navigation: any;
  destinations: Poi[];
  setDestinations: (destinations: Poi[]) => void;
  bookmarks: Poi[];
  setBookmarks: (bookmarks: Poi[]) => void;
  setInsertionIndex: (insertionIndex: number) => void;
  destinationNames: Map<number, string>;
}

const DestinationsList: React.FC<Props> = ({
  navigation,
  destinations,
  setDestinations,
  bookmarks,
  setBookmarks,
  setInsertionIndex,
  destinationNames,
}) => {
  const theme = useColorScheme() || 'light';

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      onTouchStart={() => Keyboard.dismiss()}>
      {destinations.map((destination: Poi, index: number) => (
        <View key={index}>
          <View style={styles.destination}>
            <View style={styles.destinationHeader}>
              <Text>{destinationNames.get(destination.id)}</Text>
              <OptionMenu
                options={[
                  {
                    name: strings.event.moveUp,
                    onPress: () => {
                      handleMove(index, -1, destinations, setDestinations);
                    },
                    color: colors[theme].neutral,
                    disabled: index === 0,
                  },
                  {
                    name: strings.event.moveDown,
                    onPress: () => {
                      handleMove(index, 1, destinations, setDestinations);
                    },
                    color: colors[theme].neutral,
                    disabled: index === destinations.length - 1,
                  },
                  {
                    name: strings.main.remove,
                    onPress: () => {
                      handleMove(index, 0, destinations, setDestinations);
                    },
                    color: colors[theme].red,
                  },
                  {
                    name: strings.main.rename,
                    onPress: () => {
                      prompt(
                        strings.main.rename,
                        strings.event.renamePrompt,
                        [
                          {text: 'Cancel', style: 'cancel'},
                          {
                            text: 'Save',
                            onPress: name => {
                              const _destinations = [...destinations];
                              destinationNames.set(
                                destination.id,
                                name as string,
                              );
                              setDestinations(_destinations);
                            },
                          },
                        ],
                        {
                          type: 'plain-text',
                          cancelable: false,
                          defaultValue: destinationNames.get(destination.id),
                        },
                      );
                    },
                    color: colors[theme].neutral,
                  },
                ]}
              />
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Poi', {
                  poi: destination,
                  bookmarked: bookmarks.some(
                    bookmark => bookmark.id === destination.id,
                  ),
                  mode: 'none',
                })
              }>
              <PoiCardXL
                place={destination}
                bookmarked={bookmarks.some(
                  bookmark => bookmark.id === destination.id,
                )}
                handleBookmark={(poi: Poi) =>
                  handleBookmark(poi, bookmarks, setBookmarks)
                }
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              setInsertionIndex(index + 1);
              navigation.navigate('ModeSearch', {
                mode: 'create',
              });
            }}>
            <AddSeparator />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: s(100),
  },
  destination: {
    marginHorizontal: s(20),
    marginBottom: s(10),
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: s(10),
    paddingHorizontal: s(5),
  },
});
export default DestinationsList;
