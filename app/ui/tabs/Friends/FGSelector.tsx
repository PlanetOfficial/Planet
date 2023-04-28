import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';

import strings from '../../../constants/strings';
import {colors} from '../../../constants/theme';
import {icons} from '../../../constants/images';
import fgIcons from '../../../constants/fgIcons';
import {s} from 'react-native-size-matters';

const FGSelector = ({
  bottomSheetRef,
  friendGroups,
  friendGroup,
  setFriendGroup,
  invitations,
  navigation,
}: {
  bottomSheetRef: any;
  friendGroups: any[];
  friendGroup: any;
  setFriendGroup: any;
  invitations: any[];
  navigation: any;
}) => {
  return (
    <ScrollView>
      {friendGroups?.map((fg: any, idx: number) => (
        <TouchableOpacity
          key={idx}
          style={[
            fgBottomSheetStyles.row,
            {
              backgroundColor: idx === friendGroup ? colors.grey : colors.white,
            },
          ]}
          onPress={() => {
            setFriendGroup(idx);
            bottomSheetRef?.current.close();
          }}>
          <Image style={fgBottomSheetStyles.icon} source={icons.user} />
          <View style={fgBottomSheetStyles.texts}>
            <Text
              numberOfLines={1}
              key={idx}
              style={[
                fgBottomSheetStyles.text,
                {color: idx === friendGroup ? colors.accent : colors.black},
              ]}>
              {fg}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      {invitations?.map((invitation: any, idx: number) => (
        <View key={idx} style={fgBottomSheetStyles.row}>
          <Image
            style={fgBottomSheetStyles.icon}
            source={fgIcons[invitation.iconIdx]}
          />
          <View style={fgBottomSheetStyles.wrap}>
            <View style={fgBottomSheetStyles.texts}>
              <Text numberOfLines={1} style={fgBottomSheetStyles.text}>
                {invitation.name}
              </Text>
              <Text numberOfLines={1} style={fgBottomSheetStyles.inviter}>
                {invitation.inviter}
              </Text>
            </View>
            <View style={fgBottomSheetStyles.buttonsContainer}>
              <TouchableOpacity
                style={[fgBottomSheetStyles.button, {backgroundColor: colors.accent}]}
                onPress={() => {
                  //TODO: Accept invitation
                }}>
                <Text style={fgBottomSheetStyles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[fgBottomSheetStyles.button, {backgroundColor: colors.darkgrey}]}
                onPress={() => {
                  //TODO: Reject invitation
                }}>
                <Text style={fgBottomSheetStyles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={fgBottomSheetStyles.row}
        onPress={() => {
          bottomSheetRef?.current.close();
          navigation.navigate('CreateFG');
        }}>
        <View style={fgBottomSheetStyles.plus}>
          <Image style={fgBottomSheetStyles.plusIcon} source={icons.x} />
        </View>
        <Text numberOfLines={1} style={fgBottomSheetStyles.text}>
          {strings.friends.createPrompt}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const fgBottomSheetStyles = StyleSheet.create({
  background: {
    backgroundColor: colors.white,
  },
  wrap: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: s(20),
    alignItems: 'center',
    height: s(70),
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  icon: {
    width: s(40),
    height: s(40),
  },
  plus: {
    justifyContent: 'center',
    alignItems: 'center',
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    borderWidth: s(2),
    borderColor: colors.accent,
  },
  plusIcon: {
    width: '40%',
    height: '40%',
    transform: [{rotate: '45deg'}],
    tintColor: colors.accent,
  },
  texts: {
    flex: 1,
  },
  text: {
    marginLeft: s(12),
    fontSize: s(15),
    fontWeight: '600',
  },
  inviter: {
    marginLeft: s(12),
    fontSize: s(12),
    fontWeight: '500',
    color: colors.darkgrey,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    margin: s(5),
    justifyContent: 'center',
    alignItems: 'center',
    width: s(55),
    height: s(30),
    borderRadius: s(10),
  },
  buttonText: {
    fontSize: s(12),
    fontWeight: '600',
    color: colors.white,
  }
});

export default FGSelector;
