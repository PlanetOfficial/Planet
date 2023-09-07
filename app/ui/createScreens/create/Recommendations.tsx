import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Alert,
  useColorScheme,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import {s} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
import Text from '../../components/Text';
import PoiCardXL from '../../components/PoiCardXL';

import {Coordinate, Poi, Recommendation} from '../../../utils/types';
import {fetchUserLocation, handleBookmark} from '../../../utils/Misc';
import {getRecommendations} from '../../../utils/api/recommenderAPI';

interface Props {
  navigation: any;
  bookmarks: Poi[];
  setBookmarks: (bookmarks: Poi[]) => void;
  setRecommendationsShown: (recommendationsShown: boolean) => void;
  setDestinations: (destinations: Poi[]) => void;
  setDestinationNames: (destinationNames: Map<number, string>) => void;
}

const Recommendations: React.FC<Props> = ({
  navigation,
  bookmarks,
  setBookmarks,
  setRecommendationsShown,
  setDestinations,
  setDestinationNames,
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  const styles = styling(theme);

  const [index, setIndex] = useState<number>(0);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const loadRecommendations = useCallback(async (loc: Coordinate) => {
    const _recommendations = await getRecommendations(
      loc?.latitude,
      loc?.longitude,
      false,
    );
    if (_recommendations) {
      setRecommendations(_recommendations);
    } else {
      Alert.alert(strings.error.error, strings.error.loadRecommendations);
    }
  }, []);

  useEffect(() => {
    const initializeRecommendations = async () => {
      loadRecommendations(await fetchUserLocation());
    };

    initializeRecommendations();
  }, [loadRecommendations]);

  return (
    <>
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.scrollView}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        scrollEventThrottle={16}
        snapToInterval={s(325)}
        snapToAlignment={'start'}
        decelerationRate={'fast'}
        onScroll={event => {
          let idx = Math.round(event.nativeEvent.contentOffset.x / s(325));
          if (idx !== index) {
            setIndex(idx);
          }
        }}>
        {recommendations.map((recommendation, idx) => (
          <View key={idx}>
            <View style={styles.header}>
              <Text size="s" weight="l">
                {strings.event.suggestion} #{idx + 1}
              </Text>
            </View>
            <ScrollView
              contentContainerStyle={styles.scrollViewVertical}
              showsVerticalScrollIndicator={false}
              onTouchStart={() => Keyboard.dismiss()}>
              {recommendation.places.map((destination: Poi, i: number) => (
                <View key={i}>
                  <View style={styles.container}>
                    <View style={styles.cardHeader}>
                      <Text size="s">{recommendation.categories[i]}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.card}
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
                        handleBookmark={(poi: Poi) =>
                          handleBookmark(poi, bookmarks, setBookmarks)
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
      <View style={styles.absolute}>
        <LinearGradient
          colors={[colors[theme].transparent, colors[theme].background]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          locations={[0, 0.25]}>
          <SafeAreaView>
            <View style={styles.footer}>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {backgroundColor: colors[theme].accent},
                  ]}
                  onPress={() => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut,
                    );
                    setRecommendationsShown(false);
                    setDestinations(recommendations[index].places);
                    setDestinationNames(
                      new Map(
                        recommendations[index].places.map(
                          (place: Poi, idx: number) => [
                            place.id,
                            recommendations[index].categories[idx],
                          ],
                        ),
                      ),
                    );
                  }}>
                  <View style={STYLES.icon}>
                    <Icon icon={icons.check} color={colors[theme].primary} />
                  </View>
                  <Text size="s" color={colors[theme].primary}>
                    {strings.event.accept}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {backgroundColor: colors[theme].secondary},
                  ]}
                  onPress={() => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut,
                    );
                    setRecommendationsShown(false);
                  }}>
                  <View style={STYLES.icon}>
                    <Icon icon={icons.hide} />
                  </View>
                  <Text size="s">{strings.event.hide}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginLeft: s(15),
      marginTop: s(5),
      paddingBottom: s(5),
      borderBottomWidth: 1,
      borderColor: colors[theme].secondary,
    },
    scrollView: {
      paddingLeft: s(5),
      paddingRight: s(20),
    },
    scrollViewVertical: {
      paddingBottom: s(100),
    },
    container: {
      width: s(310),
      marginLeft: s(15),
      paddingBottom: s(5),
      borderBottomWidth: 1,
      borderColor: colors[theme].secondary,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: s(10),
      paddingHorizontal: s(5),
    },
    card: {
      marginBottom: s(10),
    },
    footer: {
      height: s(100),
      width: s(350),
    },
    absolute: {
      position: 'absolute',
      bottom: 0,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: s(20),
      paddingVertical: s(10),
      marginTop: s(30),
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: s(150),
      paddingVertical: s(10),
      borderRadius: s(5),
    },
  });

export default Recommendations;
