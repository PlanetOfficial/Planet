import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Button,
  ScrollView,
  TextInput,
} from 'react-native';
import images from '../../constants/Images';
import strings from '../../constants/strings';

import DestinationSimplified from '../../components/DestinationSimplified';
import EncryptedStorage from 'react-native-encrypted-storage';
import { sendEvent } from '../../utils/api/CreateCalls/sendEvent';

const SelectDestinations = ({navigation, route}) => {
  const [selectedDestinations, setSelectedDestinations] = useState(route?.params?.selectedDestinations);
  const [eventTitle, setEventTitle] = useState(strings.createTabStack.untitledEvent);

  const getImage = (imagesData: Array<number>) => {
    // TODO: if there are images provided by API, then return one of those images instead

    return images.experience;
  }

  const handleSave = async () => {
    // send destinations to backend
    const placeIds = selectedDestinations.map(item => item.id);
    const authToken = await EncryptedStorage.getItem("auth_token");
    
    const responseStatus = await sendEvent(eventTitle, placeIds, authToken, '');

    if (responseStatus === 200) {
      navigation.navigate('Library');
    } else {
      // TODO: error, make sure connected to internet and logged in
    }
  }

  return (
    <SafeAreaView>
      <View>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SelectDestinations')}>
            <Image source={images.BackArrow} />
          </TouchableOpacity>
          <TextInput style={styles.headerTitle} onChangeText={setEventTitle}>{eventTitle}</TextInput>
          <View />
        </View>
      </View>
      <View>
        <ScrollView style={styles.scrollView}>
          {selectedDestinations && selectedDestinations.map((destination: Object) => (
            <View key={destination.id}>
              <DestinationSimplified
                name={destination.name}
                image={getImage(destination.images)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      <View>
        <Button
          title={strings.main.save}
          onPress={() => handleSave()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
  },
  scrollView: {
    height: '88%',
  },
});

export default SelectDestinations;
