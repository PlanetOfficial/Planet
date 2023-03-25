import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';

import {colors} from '../../constants/theme';
import {miscIcons, vectors} from '../../constants/images';

import {Svg, Line, Circle} from 'react-native-svg';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

// TODO: screen not implemented yet

const Place = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Library')}>
        <Image style={styles.back} source={miscIcons.back} />
      </TouchableOpacity>
      <Text style={styles.name}>Share Tea but better</Text>
      <Text style={styles.category}>Bubble Tea Shop</Text>
      <Image style={styles.background} source={vectors.shape2} />
      {Share()}
      {Details()}
    </View>
  );
};

const Share = () => (
  <View style={shareStyles.shareButton}>
    <Svg>
      <Circle
        cx={25}
        cy={25}
        r={24}
        fill={colors.white}
        stroke={colors.accent}
        strokeWidth={1}
      />
    </Svg>
    <Image style={shareStyles.share} source={miscIcons.share} />
  </View>
);

const Details = () => (
  <View style={detailsStyles.container}>
    <View style={detailsStyles.leftContainer}>
      <View style={detailsStyles.hoursContainer}>
        <Text style={detailsStyles.hoursTitle}>Hours:</Text>
        <Text style={detailsStyles.hours}>
          Mon-Fri: 1:00 PM - 11:00 PM{'\n'}Sat-Sun: 1:00 PM - 5:00 PM
        </Text>
      </View>
      <Svg style={detailsStyles.lines}>
        <Line
          x1={0}
          y1={7}
          x2={(W - 60) / 2}
          y2={7}
          stroke={colors.accent}
          strokeWidth={1}
        />
      </Svg>
      <View style={detailsStyles.addressContainer}>
        <Text style={detailsStyles.address}>
          4730 University Way NE{'\n'}Unit 109{'\n'}Seattle WA 98105{'\n'}United
          States
        </Text>
      </View>
    </View>
    <View style={detailsStyles.rightContainer}>
      <View style={detailsStyles.accomodationsContainer}>
        <View style={detailsStyles.accomodations} />
        <View style={detailsStyles.accomodations} />
        <View style={detailsStyles.accomodations} />
        <View style={detailsStyles.accomodations} />
      </View>
      <Svg style={detailsStyles.lines}>
        <Line
          x1={0}
          y1={7}
          x2={(W - 80) / 2}
          y2={7}
          stroke={colors.accent}
          strokeWidth={1}
        />
      </Svg>
      <View style={detailsStyles.otherContainer} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: W,
    height: H,
    backgroundColor: colors.white,
  },
  backButton: {
    position: 'absolute',
    top: 75,
    left: 20,
    width: 20,
    height: 30,
  },
  back: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
  name: {
    position: 'absolute',
    top: 70,
    left: 60,
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
  },
  category: {
    position: 'absolute',
    top: 105,
    left: 60,
    fontSize: 16,
    color: colors.accent,
  },
  background: {
    top: 130,
    width: W,
    height: 215,
    tintColor: colors.fill,
  },
});

const shareStyles = StyleSheet.create({
  shareButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    top: 110,
    right: 30,
    aspectRatio: 1,
  },
  share: {
    position: 'absolute',
    width: 36,
    height: 36,
    tintColor: colors.accent,
  },
});

const detailsStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    top: 160,
    width: W,
    height: 185,
  },
  leftContainer: {
    position: 'absolute',
    top: 15,
    left: 30,
    width: (W - 60) / 2,
    height: 155,
  },
  rightContainer: {
    position: 'absolute',
    top: 15,
    right: 30,
    width: (W - 80) / 2,
    height: 155,
  },
  hoursContainer: {
    height: 60,
  },
  hoursTitle: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '700',
    color: colors.black,
  },
  hours: {
    fontSize: 12,
    lineHeight: 20,
    color: colors.black,
  },
  lines: {
    height: 15,
  },
  addressContainer: {
    height: 80,
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.black,
  },
  accomodationsContainer: {
    height: 100,
  },
  accomodations: {
    height: 25,
    borderWidth: 1,
  },
  otherContainer: {
    height: 40,
    borderWidth: 1,
  },
});

export default Place;
