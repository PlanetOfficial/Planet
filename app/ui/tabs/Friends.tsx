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

//TODO: Display actual friend groups
const friendGroups = ['Poplar Residents', 'The Boys', 'Tennis People'];

//TODO: Display actual events
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

  const [fgBottomSheetOpen, setFgBottomSheetOpen] = useState(false);
  const fgBottomSheetRef: any = useRef<BottomSheetModal>(null);
  const fgSnapPoints = useMemo(
    () => [s(70) * friendGroups.length + s(120)],
    [],
  );
  const handleFgSheetChange = useCallback(
    (fromIndex: number, toIndex: number) => {
      setFgBottomSheetOpen(toIndex === 0);
    },
    [],
  );

  const [addBottomSheetOpen, setAddBottomSheetOpen] = useState(false);
  const addBottomSheetRef: any = useRef<BottomSheetModal>(null);
  const addSnapPoints = useMemo(() => ['80%'], []);
  const handleAddSheetChange = useCallback(
    (fromIndex: number, toIndex: number) => {
      setAddBottomSheetOpen(toIndex === 0);
    },
    [],
  );

  return (
    <>
      <SafeAreaView testID="friendsScreenView" style={styles.container}>
        <View style={headerStyles.container}>
          <TouchableOpacity
            style={headerStyles.fgSelector}
            onPress={() => fgBottomSheetRef.current?.present()}>
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
        <TouchableOpacity
          style={styles.addEventContainer}
          onPress={() => addBottomSheetRef.current?.present()}>
          <Image style={styles.plus} source={icons.x} />
          <Text style={styles.text}>{strings.friends.addPrompt}</Text>
        </TouchableOpacity>
        <FlatList
          data={events}
          style={contentStyles.container}
          initialNumToRender={4}
          keyExtractor={(item: any) => item?.id}
          ItemSeparatorComponent={Spacer}
          contentContainerStyle={contentStyles.content}
          renderItem={({item}) => {
            // TODO: Display actual events + user's icons and, if authorized, ability to remove events (LATER)
            // const images = getImagesFromURLs(item?.places);
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('FGEvent', {
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

        {fgBottomSheetOpen || addBottomSheetOpen ? (
          <Pressable
            onPress={() => {
              fgBottomSheetRef?.current.close();
              addBottomSheetRef?.current.close();
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
        ref={fgBottomSheetRef}
        snapPoints={fgSnapPoints}
        onAnimate={handleFgSheetChange}>
        {friendGroups?.map((fg: any, idx: number) => (
          <TouchableOpacity
            key={idx}
            style={[
              fgBottomSheetStyles.row,
              {
                backgroundColor:
                  idx === friendGroup ? colors.grey : colors.white,
              },
            ]}
            onPress={() => {
              setFriendGroup(idx);
              fgBottomSheetRef?.current.close();
            }}>
            <Image style={fgBottomSheetStyles.icon} source={icons.user} />
            <Text
              numberOfLines={1}
              key={idx}
              style={[
                fgBottomSheetStyles.text,
                {color: idx === friendGroup ? colors.accent : colors.black},
              ]}>
              {fg}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={fgBottomSheetStyles.row}
          onPress={() => {
            fgBottomSheetRef?.current.close();
            navigation.navigate('CreateFG');
          }}>
          <View style={fgBottomSheetStyles.plus}>
            <Image style={fgBottomSheetStyles.plusIcon} source={icons.x} />
          </View>
          <Text numberOfLines={1} style={fgBottomSheetStyles.text}>
            {strings.friends.createPrompt}
          </Text>
        </TouchableOpacity>
      </BottomSheetModal>

      <BottomSheetModal
        ref={addBottomSheetRef}
        snapPoints={addSnapPoints}
        onAnimate={handleAddSheetChange}>
        {/* TODO: Display all events in library, tap on it to add to friend group */}
        <View />
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
  addEventContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: s(310),
    height: s(50),
    marginVertical: s(10),
    borderWidth: 3,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    borderRadius: s(10),
  },
  plus: {
    width: s(16),
    height: s(16),
    marginRight: s(13),
    tintColor: colors.accent,
    transform: [{rotate: '45deg'}],
  },
  text: {
    fontSize: s(16),
    fontWeight: '700',
    color: colors.black,
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
  },
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

const fgBottomSheetStyles = StyleSheet.create({
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
