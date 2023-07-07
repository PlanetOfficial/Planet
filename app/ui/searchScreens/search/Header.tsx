import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {
  GooglePlaceData,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {GoogleMapsAPIKey} from '../../../utils/api/APIConstants';

interface Props {
  navigation: any;
  searching: boolean;
  setSearching: (searching: boolean) => void;
  setSearchText: (searchText: string) => void;
  mode: 'create' | 'suggest' | 'add' | 'none';
}

const Header: React.FC<Props> = ({
  navigation,
  searching,
  setSearching,
  setSearchText,
  mode,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const autocompleteRef = useRef<GooglePlacesAutocompleteRef>(null);

  const handleSelection = async (data: GooglePlaceData) => {
    if (data) {
      navigation.navigate('Poi', {
        place_id: data.place_id,
        mode: mode,
      });
    } else {
      Alert.alert(strings.error.error, strings.error.loadDestinationDetails);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        {mode !== 'none' && !searching ? (
          <View style={styles.x}>
            <Icon
              icon={icons.close}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
        ) : null}
        <GooglePlacesAutocomplete
          ref={autocompleteRef}
          placeholder={strings.search.search}
          disableScroll={true}
          isRowScrollable={false}
          enablePoweredByContainer={false}
          fetchDetails={false}
          query={{
            key: GoogleMapsAPIKey,
            language: 'en',
          }}
          textInputProps={{
            selectTextOnFocus: true,
            style: styles.text,
            autoCapitalize: 'none',
            onFocus: () => {
              LayoutAnimation.configureNext(
                LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'),
              );
              setSearching(true);
            },
            onBlur() {
              LayoutAnimation.configureNext(
                LayoutAnimation.create(100, 'easeInEaseOut', 'opacity'),
              );
              setSearching(false);
            },
            placeholderTextColor: colors[theme].neutral,
            onChangeText: text => {
              setSearchText(text);
            },
          }}
          onPress={handleSelection}
          styles={{
            textInputContainer: [
              styles.textInputContainer,
              STYLES.shadow,
              searching
                ? {
                    width: s(250),
                  }
                : null,
            ],
            row: styles.row,
            textInput: styles.textInput,
            separator: styles.separator,
          }}
          renderLeftButton={() => (
            <Image style={styles.icon} source={icons.search} />
          )}
          renderRow={rowData => (
            <View>
              <Text size="s" weight="r">
                {rowData.structured_formatting.main_text}
              </Text>
              <Text size="xs" weight="l">
                {rowData.structured_formatting.secondary_text}
              </Text>
            </View>
          )}
        />
        {searching ? (
          <TouchableOpacity
            style={styles.cancel}
            onPress={() => autocompleteRef.current?.blur()}>
            <Text>{strings.main.cancel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: s(20),
    },
    row: {
      backgroundColor: colors[theme].background,
    },
    text: {
      padding: 0,
      paddingLeft: s(30),
      fontSize: s(14),
      fontWeight: '400',
      width: '100%',
      fontFamily: 'Lato',
      color: colors[theme].neutral,
    },
    textInputContainer: {
      backgroundColor: colors[theme].primary,
      height: s(30),
      justifyContent: 'center',
      borderRadius: s(10),
      marginVertical: s(5),
    },
    textInput: {
      marginLeft: s(15),
      paddingLeft: s(10),
      fontSize: s(12),
      color: colors[theme].neutral,
      backgroundColor: 'transparent',
    },
    separator: {
      height: 1,
      backgroundColor: colors[theme].secondary,
    },
    icon: {
      marginTop: s(7.5),
      marginLeft: s(8),
      marginRight: s(-23),
      width: s(15),
      height: s(15),
      tintColor: colors[theme].neutral,
      zIndex: 5,
    },
    cancel: {
      position: 'absolute',
      top: s(5),
      right: 0,
      height: s(30),
      justifyContent: 'center',
    },
    x: {
      marginRight: s(15),
    },
    flatList: {
      paddingBottom: s(250),
    },
  });

export default Header;
