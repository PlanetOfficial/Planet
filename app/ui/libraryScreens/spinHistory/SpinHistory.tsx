import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';
import moment from 'moment';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import PoiCardXS from '../../components/PoiCardXS';
import UserIcon from '../../components/UserIcon';
import Separator from '../../components/Separator';

import {Destination, Spin} from '../../../utils/types';

const SpinHistory = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      destination: Destination;
    };
  };
}) => {
  const [destination] = useState<Destination>(route.params.destination);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
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
      <View style={styles.header}>
        <View style={styles.result}>
          <Text size="s" weight="l">
            {strings.roulette.result}
          </Text>
        </View>
        <View style={styles.spunBy}>
          <Text size="s" weight="l">
            {strings.roulette.spunBy}
          </Text>
        </View>
        <View style={styles.time}>
          <Text size="s" weight="l">
            {strings.roulette.time}
          </Text>
        </View>
      </View>
      <FlatList
        data={destination.spin_history}
        renderItem={({item}: {item: Spin}) => {
          return (
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Poi', {
                    poi: item.result.poi,
                  })
                }>
                <PoiCardXS poi={item.result.poi} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.user}
                onPress={() =>
                  navigation.push('User', {
                    user: item.spinner,
                  })
                }>
                <View style={styles.profilePic}>
                  <UserIcon user={item.spinner} />
                </View>
                <Text size="s" weight="l" numberOfLines={1}>
                  {item.spinner.first_name}
                </Text>
              </TouchableOpacity>

              <View style={styles.texts}>
                <Text size="s" numberOfLines={2}>
                  {moment(item.created_at).format('MMM Do')}
                </Text>
                <Text size="s" numberOfLines={2}>
                  {moment(item.created_at).format('h:mm a')}
                </Text>
              </View>
            </View>
          );
        }}
        keyExtractor={(item: Spin) => item.id.toString()}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: s(20),
    marginHorizontal: s(20),
    paddingHorizontal: s(10),
    paddingBottom: s(5),
    borderBottomWidth: 1,
    borderColor: colors.neutral,
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
  },
  texts: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: s(18),
    width: s(70),
  },
  user: {
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
});

export default SpinHistory;
