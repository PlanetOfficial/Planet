import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import PoiCard from '../../components/PoiCard';

import BookmarkContext from '../../../context/BookmarkContext';

import {Poi, Recommendation} from '../../../utils/types';
import {handleBookmark} from '../../../utils/Misc';

interface Props {
  navigation: any;
  recommendations: Recommendation[];
}

const Recommendations: React.FC<Props> = ({navigation, recommendations}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }
  const {bookmarks, setBookmarks} = bookmarkContext;

  return (
    <>
      <View style={styles.header}>
        <Text>{strings.home.recommendations}</Text>
      </View>
      {recommendations.map((recommendation: Recommendation, index: number) => (
        <View key={index} style={[styles.container, STYLES.shadow]}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}>
            {recommendation.places.map((place: Poi, idx: number) => (
              <TouchableOpacity
                key={index + idx}
                style={styles.cardContainer}
                onPress={() => {
                  navigation.navigate('Poi', {
                    poi: place,
                    bookmarked: false,
                    mode: 'none',
                  });
                }}>
                <PoiCard
                  poi={place}
                  bookmarked={false}
                  handleBookmark={(p: Poi) => {
                    handleBookmark(p, bookmarks, setBookmarks);
                  }}
                  index={idx + 1}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.footer} onPress={() => {}}>
            <View style={STYLES.texts}>
              <Text>{strings.home.customize}</Text>
            </View>
            <Icon size="s" icon={icons.next} />
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      backgroundColor: colors[theme].primary,
      paddingVertical: s(10),
      borderRadius: s(20),
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
      paddingTop: s(15),
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
  });

export default Recommendations;
