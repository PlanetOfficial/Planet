import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import PoiCard from '../../components/PoiCard';

import {Coordinate, Poi, Recommendation} from '../../../utils/types';
import {handleBookmark} from '../../../utils/Misc';
import {useBookmarkContext} from '../../../context/BookmarkContext';

interface Props {
  navigation: any;
  location: Coordinate;
  recommendations: Recommendation[];
  loadRecommendations: (location: Coordinate) => void;
  recommendationsLoading: boolean;
}

const Recommendations: React.FC<Props> = ({
  navigation,
  location,
  recommendations,
  loadRecommendations,
  recommendationsLoading,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const {bookmarks, setBookmarks} = useBookmarkContext();

  return (
    <>
      <View style={styles.header}>
        <Text size="s">{strings.home.recommendations}</Text>
        <Icon
          size="s"
          icon={icons.reload}
          onPress={() => {
            loadRecommendations(location);
          }}
        />
      </View>
      {recommendationsLoading ? (
        <View style={STYLES.center}>
          <ActivityIndicator size="small" color={colors[theme].accent} />
        </View>
      ) : recommendations.length > 0 ? (
        recommendations.map((recommendation: Recommendation, index: number) => (
          <View key={index} style={[styles.container, STYLES.shadow]}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollView}>
              {recommendation.places.map((place: Poi, idx: number) => (
                <View key={idx}>
                  <View style={styles.category}>
                    <Text size="s" color={colors[theme].accent}>
                      {recommendation.categories[idx]}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.cardContainer}
                    onPress={() => {
                      navigation.navigate('Poi', {
                        poi: place,
                        bookmarked: bookmarks.some(
                          (bookmark: Poi) => bookmark.id === place.id,
                        ),
                        mode: 'none',
                      });
                    }}>
                    <PoiCard
                      place={place}
                      bookmarked={bookmarks.some(
                        (bookmark: Poi) => bookmark.id === place.id,
                      )}
                      handleBookmark={(poi: Poi) => {
                        handleBookmark(poi, bookmarks, setBookmarks);
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.footer}
              onPress={() => {
                navigation.navigate('Create', {
                  destinations: recommendation.places,
                  names: recommendation.categories,
                });
              }}>
              <View style={STYLES.texts}>
                <Text size="s">{strings.home.customize}</Text>
              </View>
              <Icon icon={icons.next} />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={STYLES.center}>
          <Text weight="l">{strings.home.noRecommendations}</Text>
        </View>
      )}
    </>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      backgroundColor: colors[theme].primary,
      paddingVertical: s(10),
      borderRadius: s(5),
      marginHorizontal: s(15),
      marginBottom: s(25),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginVertical: s(10),
      paddingHorizontal: s(20),
      paddingVertical: s(5),
    },
    scrollView: {
      paddingHorizontal: s(15),
      marginBottom: s(10),
    },
    cardContainer: {
      marginRight: s(15),
      paddingTop: s(10),
      paddingBottom: s(5),
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: s(40),
      marginHorizontal: s(10),
      paddingRight: s(5),
      paddingTop: s(5),
    },
    separator: {
      height: s(1),
      marginLeft: s(15),
      backgroundColor: colors[theme].secondary,
    },
    category: {
      alignItems: 'center',
      paddingRight: s(20),
    },
  });

export default Recommendations;
