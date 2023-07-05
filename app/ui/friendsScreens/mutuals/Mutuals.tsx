import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

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
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

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
              <Icon size="s" icon={icons.next} />
            </UserRow>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={STYLES.center}>
            <Text>{strings.friends.noFriendsFound}</Text>
          </View>
        }
      />
    </View>
  );
};

export default Mutuals;
