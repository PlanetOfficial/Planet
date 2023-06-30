import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';

import Text from '../../components/Text';

import {Review} from '../../../utils/types';

interface Props {
  reviews: Review[];
}

const Reviews: React.FC<Props> = ({reviews}) => {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text>{strings.poi.reviews}</Text>
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
              <Text size="s" weight="l" color={colors.black}>
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

const styles = StyleSheet.create({
  container: {
    marginTop: s(20),
    marginHorizontal: s(20),
  },
  title: {
    marginBottom: s(5),
  },
  row: {
    borderTopWidth: 1,
    borderColor: colors.grey,
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
});

export default Reviews;
