import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import {s} from 'react-native-size-matters';

import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {Destination, Spin} from '../../utils/types';
import PoiCardXS from '../components/PoiCardXS';
import colors from '../../constants/colors';
import moment from 'moment';

const SpinHistory = ({navigation, route}: {navigation: any; route: any}) => {
  const [destination] = useState<Destination>(route.params.destination);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon icon={icons.close} onPress={() => navigation.goBack()} />
          <Text>{strings.roulette.spinHistory}</Text>
          <Icon
            size="m"
            icon={icons.question}
            onPress={() =>
              Alert.alert(
                strings.roulette.spinHistory,
                strings.roulette.spinHistoryDescription,
              )
            }
          />
        </View>
      </SafeAreaView>
      <View style={localStyles.header}>
        <View style={localStyles.result}>
          <Text size="s" weight="l">
            {strings.roulette.result}
          </Text>
        </View>
        <View style={localStyles.spunBy}>
          <Text size="s" weight="l">
            {strings.roulette.spunBy}
          </Text>
        </View>
        <View style={localStyles.time}>
          <Text size="s" weight="l">
            {strings.roulette.time}
          </Text>
        </View>
      </View>
      <FlatList
        data={destination.spin_history}
        renderItem={({item}: {item: Spin}) => {
          return (
            <View style={localStyles.row}>
              <PoiCardXS poi={item.result.poi} />

              <View style={userStyles.container}>
                <View style={userStyles.profilePic}>
                  <Image
                    style={userStyles.pic}
                    source={{uri: 'https://picsum.photos/200'}}
                  />
                </View>
                <Text size="s" weight="l" numberOfLines={1}>
                  {item.spinner.first_name}
                </Text>
              </View>

              <View style={localStyles.texts}>
                <Text size="s" color={colors.darkgrey} numberOfLines={2}>
                  {moment(item.created_at).format('MMM Do')}
                </Text>
                <Text size="s" color={colors.darkgrey} numberOfLines={2}>
                  {moment(item.created_at).format('h:mm a')}
                </Text>
              </View>
            </View>
          );
        }}
        keyExtractor={(item: Spin) => item.id.toString()}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: s(20),
    marginHorizontal: s(20),
    paddingHorizontal: s(10),
    paddingBottom: s(5),
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  result: {
    alignItems: 'center',
    width: s(120),
  },
  spunBy: {
    alignItems: 'center',
    width: s(100),
  },
  time: {
    alignItems: 'center',
    width: s(70),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: s(30),
    marginTop: s(15),
    paddingBottom: s(15),
    borderBottomWidth: 0.5,
    borderColor: colors.lightgrey,
  },
  texts: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: s(18),
    width: s(70),
  },
});

const userStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: s(10),
    width: s(100),
  },
  profilePic: {
    width: s(35),
    height: s(35),
    borderRadius: s(17.5),
    overflow: 'hidden',
  },
  pic: {
    width: '100%',
    height: '100%',
  },
});

export default SpinHistory;