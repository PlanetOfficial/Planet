import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Pressable,
  Platform,
  FlatList,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {BlurView} from '@react-native-community/blur';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import {s} from 'react-native-size-matters';
import EventCard from '../components/EventCard';

//TEMP
const friendGroups = ['Poplar Residents', 'The Boys', 'Tennis People'];

//TEMP
const events = [
  {
    id: 1,
    name: 'Event 1',
    date: '2021-01-01',
    location: 'Seattle, WA',
  },
  {
    id: 2,
    name: 'Event 2',
    date: '2021-01-01',
    location: 'Capitol Hill, WA',
  },
  {
    id: 3,
    name: 'Event 3',
    date: '2021-01-01',
    location: 'Seattle, WA',
  },
  {
    id: 4,
    name: 'Event 4',
    date: '2021-01-01',
    location: 'Seattle, WA',
  },
  {
    id: 5,
    name: 'Event 5',
    date: '2021-01-01',
    location: 'Seattle, WA',
  },
];

const Friends = ({navigation}: {navigation: any}) => {
  const [friendGroup, setFriendGroup] = useState(0);
  const [bottomSheetOpen, setbottomSheetOpen] = useState(false);

  const bottomSheetRef: any = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [s(70) * friendGroups.length + s(120)], []);
  const handleSheetChange = useCallback(
    (fromIndex: number, toIndex: number) => {
      setbottomSheetOpen(toIndex === 0);
    },
    [],
  );

  return (
    <>
      <SafeAreaView testID="friendsScreenView" style={styles.container}>
        <View style={headerStyles.container}>
          <TouchableOpacity
            style={headerStyles.fgSelector}
            onPress={() => {
              bottomSheetRef.current?.present();
            }}>
            <Text numberOfLines={1} style={headerStyles.title}>
              {friendGroup === -1
                ? strings.title.friends
                : friendGroups[friendGroup]}
            </Text>
            <View style={headerStyles.drop}>
              <Image style={[headerStyles.icon]} source={icons.next} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={headerStyles.notification}>
            <Image style={headerStyles.bell} source={icons.notification} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={events}
          style={contentStyles.container}
          initialNumToRender={4}
          keyExtractor={(item: any) => item?.id}
          ItemSeparatorComponent={Spacer}
          contentContainerStyle={contentStyles.content}
          renderItem={({item}) => {
            // const images = getImagesFromURLs(item?.places);
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Event', {
                    eventData: item,
                    // bookmarks: places?.map(place => place?.id),
                  });
                }}>
                <EventCard
                  name={item?.name}
                  info={item?.date}
                  image={
                    // images && images?.length !== 0
                    //   ? {uri: images[0]} :
                    icons.defaultIcon
                  }
                />
              </TouchableOpacity>
            );
          }}
        />

        {bottomSheetOpen ? (
          <Pressable
            onPress={() => {
              bottomSheetRef?.current.close();
            }}
            style={styles.pressable}>
            {Platform.OS === 'ios' ? (
              <BlurView blurAmount={2} blurType="dark" style={styles.blur} />
            ) : (
              <View style={[styles.blur, styles.nonBlur]} />
            )}
          </Pressable>
        ) : null}
      </SafeAreaView>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onAnimate={handleSheetChange}>
        {friendGroups?.map((fg: any, idx: number) => (
          <TouchableOpacity
            key={idx}
            style={[
              bottomSheetStyles.row,
              {
                backgroundColor:
                  idx === friendGroup ? colors.grey : colors.white,
              },
            ]}
            onPress={() => {
              setFriendGroup(idx);
              bottomSheetRef?.current.close();
            }}>
            <Image style={bottomSheetStyles.icon} source={icons.user} />
            <Text
              numberOfLines={1}
              key={idx}
              style={[
                bottomSheetStyles.text,
                {color: idx === friendGroup ? colors.accent : colors.black},
              ]}>
              {fg}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={bottomSheetStyles.row}
          onPress={() => {
            bottomSheetRef?.current.close();
            navigation.navigate('CreateFG');
          }}>
          <View style={bottomSheetStyles.plus}>
            <Image style={bottomSheetStyles.plusIcon} source={icons.x} />
          </View>
          <Text numberOfLines={1} style={bottomSheetStyles.text}>
            {strings.friends.createPrompt}
          </Text>
        </TouchableOpacity>
      </BottomSheetModal>
    </>
  );
};

const Spacer = () => <View style={contentStyles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  pressable: {
    position: 'absolute',
    width: '100%',
    height: '150%',
  },
  blur: {
    width: '100%',
    height: '100%',
  },
  nonBlur: {
    backgroundColor: colors.black,
    opacity: 0.85,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingVertical: s(15),
    width: '100%',
  },
  title: {
    fontSize: s(24),
    fontWeight: '700',
    color: colors.black,
  },
  fgSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drop: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(10),
    width: s(15),
    height: s(10),
  },
  icon: {
    width: s(10),
    height: s(15),
    tintColor: colors.black,
    transform: [{rotate: '90deg'}],
  },
  notification: {
    width: s(25),
    height: s(25),
  },
  bell: {
    width: '100%',
    height: '100%',
  }
});

const contentStyles = StyleSheet.create({
  container: {
    width: s(350),
    paddingHorizontal: s(20),
  },
  content: {
    paddingVertical: s(10),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
  },
});

const bottomSheetStyles = StyleSheet.create({
  container: {
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
  },
  background: {
    backgroundColor: colors.white,
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
  text: {
    marginLeft: s(12),
    fontSize: s(15),
    fontWeight: '600',
  },
});

export default Friends;
