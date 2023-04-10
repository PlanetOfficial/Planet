import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import {icons} from '../../constants/images';
import misc from '../../constants/misc';
import strings from '../../constants/strings';
import DatePicker from 'react-native-date-picker';
import MapView, {Marker} from 'react-native-maps';
import {s} from 'react-native-size-matters';
import {colors} from '../../constants/theme';

import EncryptedStorage from 'react-native-encrypted-storage';
import {sendEvent} from '../../utils/api/CreateCalls/sendEvent';
import {getRegionForCoordinates} from '../../utils/functions/Misc';
import {MarkerObject} from '../../utils/interfaces/MarkerObject';
import PlaceCard from '../components/PlaceCard';

const SelectDestinations = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [selectedDestinations] = useState(route?.params?.selectedDestinations);
  const [markers] = useState(route?.params?.markers);
  const [bookmarks] = useState(route?.params?.bookmarks);
  const [categories] = useState(route?.params?.categories);
  const [eventTitle, setEventTitle] = useState(
    strings.createTabStack.untitledEvent,
  );
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    // send destinations to backend
    const placeIds = selectedDestinations?.map((item: any) => item?.id);
    const authToken = await EncryptedStorage.getItem('auth_token');

    const responseStatus = await sendEvent(
      eventTitle,
      placeIds,
      authToken,
      date.toLocaleDateString(),
    );

    if (responseStatus) {
      navigation.navigate('TabStack', {screen: 'Library'});
      // TODO: show successful save
    } else {
      // TODO: error, make sure connected to internet and logged in, if error persists, log out and log back in
    }
  };

  const getCategoryName = (id: number) => {
    const category = categories.find((item: any) => id === item.id);

    if (category) {
      return category.name;
    }

    return strings.main.notApplicable;
  };

  return (
    <SafeAreaView testID="finalizeScreenView" style={styles.container}>
      <View style={headerStyles.container}>
        <TouchableOpacity
          testID="finalizeScreenBack"
          style={headerStyles.back}
          onPress={() => navigation.navigate('SelectDestinations')}>
          <Image style={headerStyles.icon} source={icons.next} />
        </TouchableOpacity>
        <View style={headerStyles.texts}>
          <TextInput
            testID="eventTitleText"
            style={headerStyles.title}
            onChangeText={setEventTitle}>
            {eventTitle}
          </TextInput>
          <View>
            <TouchableOpacity onPress={() => setOpen(true)}>
              <Text style={headerStyles.date}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={newDate => {
                setOpen(false);
                setDate(newDate);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          testID="saveEventButton"
          style={headerStyles.confirm}
          onPress={() => {
            handleSave();
          }}>
          <Image style={headerStyles.icon} source={icons.confirm} />
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        initialRegion={getRegionForCoordinates(markers)}>
        {markers?.length > 0
          ? markers?.map((marker: MarkerObject, index: number) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker?.latitude,
                  longitude: marker?.longitude,
                }}
                title={marker?.name}
              />
            ))
          : null}
      </MapView>
      <FlatList
        style={styles.flatlist}
        data={selectedDestinations}
        keyExtractor={item => item?.id}
        ItemSeparatorComponent={Spacer}
        contentContainerStyle={styles.contentContainer}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Place', {
                  destination: item,
                  category: getCategoryName(item?.category),
                });
              }}>
              <PlaceCard
                id={item?.id}
                name={item?.name}
                info={getCategoryName(item?.category)}
                marked={bookmarks?.includes(item?.id)}
                image={
                  item?.images && item?.images?.length !== 0
                    ? {
                        uri:
                          item?.images[0]?.prefix +
                          misc.imageSize +
                          item?.images[0]?.suffix,
                      }
                    : icons.defaultIcon
                }
              />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const Spacer = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  flatlist: {
    marginTop: s(10),
    paddingHorizontal: s(20),
  },
  map: {
    height: s(200),
    borderRadius: s(10),
    marginHorizontal: s(20),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
  },
  contentContainer: {
    paddingVertical: s(10),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
  },
  texts: {
    marginLeft: s(10),
  },
  title: {
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,
  },
  date: {
    marginTop: s(5),
    fontSize: s(14),
    fontWeight: '700',
    color: colors.accent,
  },
  back: {
    marginRight: s(20 / 3),
    width: s(40 / 3),
    height: s(20),
  },
  confirm: {
    position: 'absolute',
    right: s(20),
    width: s(20),
    height: s(20),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
});

export default SelectDestinations;
