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

import {handleMove} from './functions';
import AddSeparator from './AddSeparator';

interface Props {
  navigation: any;
  destinations: Poi[];
  setDestinations: (destinations: Poi[]) => void;
  bookmarks: Poi[];
  setInsertionIndex: (insertionIndex: number) => void;
  destinationNames: Map<number, string>;
}

const DestinationsList: React.FC<Props> = ({
  navigation,
  destinations,
  setDestinations,
  bookmarks,
  setInsertionIndex,
  destinationNames,
}) => {
  const theme = useColorScheme() || 'light';

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      scrollIndicatorInsets={{right: 1}}
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
                    name: strings.main.rename,
                    onPress: () => {
                      setTimeout(() => {
                        prompt(
                          strings.main.rename,
                          strings.event.renamePrompt,
                          [
                            {text: strings.main.cancel, style: 'cancel'},
                            {
                              text: strings.main.save,
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
                      }, 200);
                    },
                    color: colors[theme].neutral,
                  },
                  {
                    name: strings.main.remove,
                    onPress: () => {
                      handleMove(index, 0, destinations, setDestinations);
                    },
                    color: colors[theme].red,
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
                  mode: 'inCreate',
                })
              }>
              <PoiCardXL
                place={destination}
                bookmarked={bookmarks.some(
                  bookmark => bookmark.id === destination.id,
                )}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              setInsertionIndex(index + 1);
              navigation.navigate('ModeExplore', {
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
