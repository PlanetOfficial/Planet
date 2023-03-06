import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import {colors} from '../../constants/colors';
import icons from '../../constants/icons';
import Back from '../../assets/vectors/back.svg';
import Shape2 from '../../assets/vectors/shape2.svg';
import {Svg, Line, Circle} from 'react-native-svg';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

const Place = () => {
  return (
    <View style={styles.container}>
      <View style={styles.back}>
        <Back fill={colors.black} />
      </View>
      <Text style={styles.name}>Share Tea but better</Text>
      <Text style={styles.category}>Bubble Tea Shop</Text>
      <View style={styles.shape2}>
        <Shape2 fill={colors.fill} />
      </View>
      <View style={styles.shareButton}>
        <Svg width={60} height={60}>
          <Circle
            stroke={colors.accent}
            strokeWidth={1.5}
            fill={colors.white}
            cx={30}
            cy={30}
            r={29}
          />
        </Svg>
        <Image style={styles.share} source={icons.share} />
      </View>
      <View style={styles.infoLeft}>
        <View style={styles.hoursContainer}>
          <Text style={styles.hours}>Hours:</Text>
          <Text style={styles.hoursText}>
            Mon-Fri: 1:00 PM - 11:00 PM{'\n'}Sat-Sun: 1:00 PM - 5:00 PM{' '}
          </Text>
        </View>
        <Svg>
          <Line
            x1={0}
            y1={67.5}
            x2={(W - 60) / 2}
            y2={67.5}
            stroke={colors.accent}
            strokeWidth={1.5}
          />
        </Svg>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>
            4730 University Way NE{'\n'}Unit 109{'\n'}Seattle WA 98105{'\n'}
            United States
          </Text>
        </View>
      </View>
      <View style={styles.infoRight}>
        <Svg>
          <Line
            x1={0}
            y1={110}
            x2={(W - 60) / 2}
            y2={110}
            stroke={colors.accent}
            strokeWidth={1.5}
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: W,
    height: H,
    backgroundColor: colors.white,
  },
  back: {
    width: '100%',
    aspectRatio: 1,
    position: 'absolute',
    top: 75,
    left: 25,
  },
  name: {
    position: 'absolute',
    top: 75,
    left: 60,
    width: W - 85,

    // font-family: 'Lato;,
    fontSize: 24,
    fontWeight: 'bold',

    color: colors.black,
  },
  category: {
    position: 'absolute',
    top: 112,
    left: 60,

    // font-family: 'Lato;,
    fontSize: 16,

    color: colors.accent,
  },
  shape2: {
    width: '100%',
    aspectRatio: 1,
    position: 'absolute',
    top: 135,
  },
  shareButton: {
    width: '100%',
    aspectRatio: 1,
    position: 'absolute',
    top: 110,
    left: W - 85,
  },
  share: {
    backgroundColor: 'white',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    tintColor: colors.accent,
    top: 9,
    left: 10,

    shadowColor: colors.black,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  infoLeft: {
    position: 'absolute',
    top: 180,
    left: 30,
    width: (W - 60) / 2,
    height: 160,
  },
  infoRight: {
    position: 'absolute',
    top: 180,
    right: 30,
    width: (W - 60) / 2,
    height: 160,
  },
  hoursContainer: {
    position: 'absolute',
    width: (W - 60) / 2,
    height: 60,
  },
  hours: {
    // font-family: 'Lato;,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 24,

    color: colors.black,
  },
  hoursText: {
    // font-family: 'Lato;,
    fontSize: 12,
    lineHeight: 18,

    color: colors.black,
  },
  addressContainer: {
    position: 'absolute',
    width: (W - 60) / 2,
    height: 80,
    top: 75,
  },
  address: {
    // font-family: 'Lato;,
    fontSize: 14,
    lineHeight: 20,

    color: colors.black,
  },
});

export default Place;
