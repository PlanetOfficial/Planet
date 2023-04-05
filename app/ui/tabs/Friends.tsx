import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import {s} from 'react-native-size-matters';

const friendGroups = ['The Boys', 'Reanne', 'Tennis People'];

const Friends = () => {
  const [friendGroup, setFriendGroup] = useState(0);
  const [fgSelectorOpen, setFgSelectorOpen] = useState(false);

  return (
    <SafeAreaView testID="friendsScreenView" style={styles.container}>
      <View style={headerStyles.container}>
        <Text style={headerStyles.title}>{strings.title.friends}</Text>
        <TouchableOpacity
          style={[
            headerStyles.fgSelector,
            fgSelectorOpen
              ? null
              : {
                  borderBottomLeftRadius: s(10),
                  borderBottomRightRadius: s(10),
                },
          ]}
          onPress={() => setFgSelectorOpen(!fgSelectorOpen)}>
          <Text numberOfLines={1} style={headerStyles.selectedText}>
            {friendGroups[friendGroup]}
          </Text>
          <View style={headerStyles.drop}>
            <Image
              style={[
                headerStyles.icon,
                {transform: [{rotate: fgSelectorOpen ? '90deg' : '270deg'}]},
              ]}
              source={icons.back}
            />
          </View>
          {fgSelectorOpen ? (
            <View style={dropDownStyles.container}>
              {friendGroups?.map((fg: any, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  style={dropDownStyles.rect}
                  onPress={() => {
                    setFriendGroup(idx);
                    setFgSelectorOpen(false);
                  }}>
                  <Text numberOfLines={1} key={idx} style={dropDownStyles.text}>
                    {fg}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(20),
    width: '100%',
  },
  title: {
    fontSize: s(28),
    fontWeight: '700',
    color: colors.black,
  },
  fgSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(120),
    height: s(33),
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
    backgroundColor: colors.grey,
    paddingHorizontal: s(10),
  },
  selectedText: {
    flex: 1,
    fontSize: s(15),
    fontWeight: '700',
    color: colors.accent,
  },
  drop: {
    justifyContent: 'center',
    alignItems: 'center',
    width: s(18),
    height: s(12),
  },
  icon: {
    width: s(12),
    height: s(18),
    tintColor: colors.black,
  },
});

const dropDownStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: s(33),
    borderBottomLeftRadius: s(10),
    borderBottomRightRadius: s(10),
    backgroundColor: colors.grey,
  },
  rect: {
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.darkgrey,
    width: s(120),
    height: s(30),
  },
  text: {
    marginHorizontal: s(10),
    fontSize: s(14),
    fontWeight: '600',
    color: colors.black,
  },
});

export default Friends;
