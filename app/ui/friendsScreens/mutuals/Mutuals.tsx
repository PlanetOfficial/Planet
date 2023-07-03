import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserRow from '../../components/UserRow';

import {UserInfo} from '../../../utils/types';

const Mutuals = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      mutuals: UserInfo[];
    };
  };
}) => {
  const [mutuals] = useState<UserInfo[]>(route.params.mutuals);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon icon={icons.close} onPress={() => navigation.goBack()} />
          <Text>{strings.friends.mutualFriends}</Text>
          <Icon
            size="m"
            icon={icons.question}
            onPress={() =>
              Alert.alert(
                strings.friends.mutualFriends,
                strings.friends.mutualFriendsDescriptions,
              )
            }
          />
        </View>
      </SafeAreaView>
      <FlatList
        style={STYLES.container}
        contentContainerStyle={STYLES.flatList}
        data={mutuals}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}: {item: UserInfo}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.push('User', {
                user: item,
              })
            }>
            <UserRow user={item}>
              <Icon size="xs" icon={icons.next} />
            </UserRow>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={STYLES.center}>
            <Text>{strings.friends.noFriendsFound}</Text>
            <Text> </Text>
            <Text size="s">{strings.friends.noFriendsFoundDescription}</Text>
          </View>
        }
      />
    </View>
  );
};

export default Mutuals;
