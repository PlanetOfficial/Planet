import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  useColorScheme,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';

import Text from '../../components/Text';

import {Review} from '../../../utils/types';
import icons from '../../../constants/icons';
import Icon from '../../components/Icon';

interface Props {
  reviews: Review[];
  url?: string;
}

const Reviews: React.FC<Props> = ({reviews, url}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text>{strings.poi.reviews}</Text>
        {url ? (
          <TouchableOpacity
            style={styles.link}
            onPress={() => Linking.openURL(url)}>
            <Text size="xs" color={colors[theme].accent}>
              {strings.poi.viewMoreReviews}
            </Text>
            <View style={styles.next}>
              <Icon size="xs" icon={icons.next} color={colors[theme].accent} />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
      {reviews.map((review: Review, index: number) => (
        <View key={index} style={styles.row}>
          <View style={styles.reviewerContainer}>
            <View style={styles.reviewerContainer}>
              <Image
                style={styles.reviewer}
                source={{uri: review.profile_photo_url}}
              />
            </View>
            <View style={styles.texts}>
              <Text size="s">{review.author_name}</Text>
              <Text size="s" weight="l">
                {`Rating: ${review.rating}/5・${review.relative_time_description}`}
              </Text>
            </View>
          </View>
          <Text size="s" weight="l" lineHeight={s(20)}>
            {review.text}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      marginTop: s(20),
      marginHorizontal: s(20),
    },
    title: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: s(5),
    },
    row: {
      borderTopWidth: 1,
      borderColor: colors[theme].secondary,
      padding: s(12),
    },
    reviewerContainer: {
      flexDirection: 'row',
      marginBottom: s(5),
    },
    reviewer: {
      width: s(40),
      height: s(40),
    },
    icon: {
      width: '100%',
      height: '100%',
    },
    texts: {
      marginLeft: s(10),
      height: s(40),
      justifyContent: 'space-evenly',
    },
    link: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    next: {
      marginLeft: s(3),
    },
  });

export default Reviews;
